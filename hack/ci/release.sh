#!/usr/bin/env bash

# Copyright 2026 The Kubermatic Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

### Postsubmit on main. This is what changesets/action did on GitHub Actions,
### written out: with pending changesets it opens (or refreshes) the "Version
### Packages" PR; with none, main is already versioned and it publishes.
###
### It runs in the Prow control plane cluster, because that is where its token
### lives. It must never be wired up as a presubmit: a presubmit executes code
### from an unreviewed branch, and this job holds a credential that can publish
### under the @kubermatic scope.
###
### The two halves hold separate credentials, because they now live in two
### different systems: GitHub authenticates the branch push and the PR with the
### bot's PAT, and registry.npmjs.org authenticates the publish with a token
### out of Vault. Neither can do the other's job, which is the improvement over
### publishing to GitHub Packages — that took the same PAT for both, so `repo`
### and publish rights travelled together.
###
### The npm token has to be a granular access token scoped to the @kubermatic
### packages, not a classic one: publishing from CI cannot answer a 2FA prompt,
### and a classic automation token carries the whole account.
###
### Required environment:
###   KUBERMATIC_BOT_GITHUB_TOKEN — preset-kubermatic-bot-token. Needs `repo`
###     to push the branch, open the PR, and let the changelog generator read
###     the repository's pull requests. No package scopes anymore.
###   VAULT_ADDR / VAULT_ROLE_ID / VAULT_SECRET_ID — preset-vault. Reads
###     `publish_token` from `dev/npm`.

set -euo pipefail

cd $(dirname "$0")/../..
source hack/lib.sh

REPO="kubermatic/ui-kit"
RELEASE_BRANCH="changeset-release/main"

if [ -z "${KUBERMATIC_BOT_GITHUB_TOKEN:-}" ]; then
  echodate "ERROR: \$KUBERMATIC_BOT_GITHUB_TOKEN is not set. Is the preset attached to this job?"
  exit 1
fi

# Exported up here, not next to the `gh` calls that also read it, because
# `changeset version` needs it first: the changelog generator configured in
# .changeset/config.json is @changesets/changelog-github, which resolves every
# changeset to its pull request and author over the GraphQL API and aborts the
# whole run if GITHUB_TOKEN is unset. It reads that name specifically, so the
# preset's KUBERMATIC_BOT_GITHUB_TOKEN has to be re-exported under it.
#
# No extra credential is needed: the API call only reads a public repository,
# which the `repo` scope already covers. The `read:user` and `repo:status`
# scopes named in the error message are what changesets suggests minting for a
# fresh token, not something it verifies.
export GITHUB_TOKEN="$KUBERMATIC_BOT_GITHUB_TOKEN"

# Checked here rather than at the publish step below, even though only that
# step needs it. A missing preset-vault label would otherwise stay invisible
# until the one run that has something to publish, which is the worst moment
# to discover it — the version PR is already merged by then.
if [ -z "${VAULT_ADDR:-}" ]; then
  echodate "ERROR: \$VAULT_ADDR is not set. Is the preset-vault label on this job?"
  exit 1
fi

npm_ci

# This is the last line of defence, not a second CI.
#
# Tide will not merge a PR whose presubmits are red, so main has already been
# through the full suite on this exact tree. What that does not cover is a
# merge of two individually-green PRs, and a bad version cannot be taken off
# npm either — unpublishing a version is only allowed in the first 72 hours and
# only if nothing depends on it, so in practice it is deprecate-and-move-on.
# The fast checks, not the browser
# suite: that adds several minutes and its own flake surface for a signal the
# presubmits already produced.
echodate "Gating the release on the fast checks…"
npm run lint
npm run typecheck
npm test
npm run check:dist

echodate "Configuring git…"
git config user.email "dev@kubermatic.com"
git config user.name "Kubermatic Bot"
set_push_remote "https://x-access-token:${KUBERMATIC_BOT_GITHUB_TOKEN}@github.com/${REPO}.git"

# Prow checks out a detached HEAD at the merged commit; changesets needs to
# know which branch it is versioning.
git checkout -B main "${PULL_BASE_SHA:-HEAD}"

# A pending changeset is a markdown file in .changeset/ — `changeset version`
# consumes them, so their presence is exactly the question being asked here.
# Counted directly rather than through `changeset status`, whose exit code
# means different things depending on the flags it is given.
pending="$(find .changeset -maxdepth 1 -name '*.md' | wc -l)"

if [ "$pending" -gt 0 ]; then
  echodate "$pending pending changeset(s), preparing the version PR…"

  npm run version-packages

  if git diff --quiet; then
    echodate "Versioning produced no changes; nothing to do."
    exit 0
  fi

  git checkout -B "$RELEASE_BRANCH"
  git add --all
  # Signed off because the dco plugin blocks the merge otherwise, and this
  # branch is force-pushed on every run, so the PR is always the current state
  # of main rather than an accumulation.
  git commit --signoff --message "chore: version packages"
  retry 3 git push --force origin "$RELEASE_BRANCH"

  install_gh

  if gh pr view "$RELEASE_BRANCH" --repo "$REPO" > /dev/null 2>&1; then
    echodate "Version PR already open, the force-push refreshed it."
  else
    gh pr create \
      --repo "$REPO" \
      --base main \
      --head "$RELEASE_BRANCH" \
      --title "chore: version packages" \
      --body "$(
        cat << EOF
Opened automatically by \`post-ui-kit-release\`.

Merging this PR bumps the versions and changelogs from the changesets on
\`main\`, and the next run of this job publishes the result to npm.

It still needs \`/lgtm\` and \`/approve\` from a human — Tide does not merge
anything without them.
EOF
      )"
  fi

  echodate "Done."
  exit 0
fi

echodate "No pending changesets, publishing…"

echodate "Getting the npm token from Vault…"
retry 5 vault_ci_login

# `vault kv get` prints a trailing newline that would end up inside the token
# in the .npmrc; npm sends the value verbatim in the Authorization header, and
# the registry answers 401 with nothing that points at a stray newline.
NPM_TOKEN="$(vault kv get -field=publish_token dev/npm | tr -d '\n')"

if [ -z "$NPM_TOKEN" ]; then
  echodate "ERROR: dev/npm publish_token is empty."
  exit 1
fi

# `npm publish` reads the token from the user-level .npmrc, so it has to be a
# file and not an argument. Written under a umask that keeps it unreadable to
# anyone else from the moment it exists, rather than chmod'ing a file that was
# briefly world-readable, and removed on the way out — this token outlives the
# pod, unlike the GitHub one, which the preset would have rotated anyway.
: "${HOME:=/root}"
NPMRC="$HOME/.npmrc"
trap 'rm -f "$NPMRC"' EXIT

(
  umask 077
  cat > "$NPMRC" << EOF
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
EOF
)

# Fails loudly on a revoked or mistyped token, which is otherwise reported as a
# 404 on the first package — npm does not distinguish "no such package" from
# "you may not see it".
echodate "Publishing as $(npm whoami --registry https://registry.npmjs.org)."

# Publishes every package whose version is not on the registry yet, and is a
# no-op when they all are — which is the common case, since this job runs on
# every push to main. The registry it publishes to is the one in each
# package's publishConfig, and `access: public` in .changeset/config.json is
# what keeps a scoped package from defaulting to private.
npm run release

# The tags changesets wrote locally. Without this the repo has no record of
# what was published. Tags only, not the branch: main has no new commits at
# this point, and pushing it would fail for nothing if someone merged another
# PR while this job was running.
retry 3 git push origin --tags

echodate "Done."
