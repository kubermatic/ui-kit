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
### One credential does both halves of the job. GitHub Packages authenticates
### with a classic PAT, which is what the bot token already is, so a second
### token would have had to be minted from the same bot account — buying
### independent rotation, but no privilege separation, since it is the account
### and not the token that bounds the damage. If this job ever moves to a bot
### of its own, split it back apart: the `repo` scope below is the wide half.
###
### Required environment:
###   KUBERMATIC_BOT_GITHUB_TOKEN — preset-kubermatic-bot-token. Needs `repo`
###     to push the branch and open the PR, and `write:packages` to publish.

set -euo pipefail

cd $(dirname "$0")/../..
source hack/lib.sh

REPO="kubermatic/ui-kit"
RELEASE_BRANCH="changeset-release/main"

if [ -z "${KUBERMATIC_BOT_GITHUB_TOKEN:-}" ]; then
  echodate "ERROR: \$KUBERMATIC_BOT_GITHUB_TOKEN is not set. Is the preset attached to this job?"
  exit 1
fi

npm_ci

# This is the last line of defence, not a second CI.
#
# Tide will not merge a PR whose presubmits are red, so main has already been
# through the full suite on this exact tree. What that does not cover is a
# merge of two individually-green PRs, and a bad version cannot be unpublished
# from GitHub Packages — only deprecated. The fast checks, not the browser
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
# Prow clones over SSH with a deploy key that is not allowed to push. The bot
# token is, and x-access-token is how a token authenticates over HTTPS.
git remote set-url origin "https://x-access-token:${KUBERMATIC_BOT_GITHUB_TOKEN}@github.com/${REPO}.git"

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
  export GITHUB_TOKEN="$KUBERMATIC_BOT_GITHUB_TOKEN"

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
\`main\`, and the next run of this job publishes the result to GitHub Packages.

It still needs \`/lgtm\` and \`/approve\` from a human — Tide does not merge
anything without them.
EOF
      )"
  fi

  echodate "Done."
  exit 0
fi

echodate "No pending changesets, publishing…"

# `npm publish` reads the token from the user-level .npmrc. The scope line
# repeats what packages/*/package.json already declare in publishConfig, so a
# package that forgets it still cannot go to the public registry by accident.
#
# The same bot token that pushed the branch above. npm.pkg.github.com takes a
# classic PAT directly as the auth token; it has no notion of a separate npm
# credential, which is why there is only one secret in play here.
: "${HOME:=/root}"
cat > "$HOME/.npmrc" << EOF
@kubermatic:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${KUBERMATIC_BOT_GITHUB_TOKEN}
EOF
chmod 0600 "$HOME/.npmrc"

# Publishes every package whose version is not on the registry yet, and is a
# no-op when they all are — which is the common case, since this job runs on
# every push to main.
npm run release

# The tags changesets wrote locally. Without this the repo has no record of
# what was published. Tags only, not the branch: main has no new commits at
# this point, and pushing it would fail for nothing if someone merged another
# PR while this job was running.
retry 3 git push origin --tags

echodate "Done."
