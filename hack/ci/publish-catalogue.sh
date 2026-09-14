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

### Postsubmit on main. Builds the Storybook catalogue and force-pushes it to
### the gh-pages branch, from where GitHub Pages serves it.
###
### Pages has two publishing sources. The GitHub Actions one needs OIDC and the
### Pages API and is out of reach here; the older "deploy from a branch" one is
### an ordinary git push, which is all this does. So no new credential: the bot
### token's `repo` scope, already needed to push the release branch, covers it.
###
### Nothing is served until somebody sets Settings → Pages → "Deploy from a
### branch" → gh-pages / root. Until then this job just maintains a branch that
### nothing reads, which is the intended order: the branch is harmless, and
### flipping that switch is what makes the catalogue public.
###
### And it *is* public. kubermatic/ui-kit is private and the org is on the Team
### plan, which serves Pages from a private repository but cannot restrict who
### reads the result — that needs Enterprise Cloud. Everything in the catalogue,
### including the prose pages under .storybook/docs, is world-readable and
### indexable once Pages is on.
###
### Separate from post-ui-kit-release on purpose: the catalogue tracks main,
### not the version. Tying it to the release would leave the published docs
### describing whatever was last published rather than what main says.
###
### Required environment:
###   KUBERMATIC_BOT_GITHUB_TOKEN — preset-kubermatic-bot-token, needs `repo`

set -euo pipefail

cd $(dirname "$0")/../..
source hack/lib.sh

REPO="kubermatic/ui-kit"
PAGES_BRANCH="gh-pages"

# A project site is served from /<repo>/, not the origin root. .storybook/main.ts
# reads this into Vite's `base`; without it every asset URL is absolute-from-root
# and the page loads blank with no error in the build log.
export STORYBOOK_BASE_PATH="/ui-kit/"

if [ -z "${KUBERMATIC_BOT_GITHUB_TOKEN:-}" ]; then
  echodate "ERROR: \$KUBERMATIC_BOT_GITHUB_TOKEN is not set. Is the preset attached to this job?"
  exit 1
fi

npm_ci

echodate "Building the catalogue for ${STORYBOOK_BASE_PATH}…"
npm run build-storybook

# Pages runs the output through Jekyll unless this exists, which drops any path
# beginning with an underscore. The current build has none, so this is a guard
# against a future Storybook that does, and it skips a build step nothing needs.
touch storybook-static/.nojekyll

echodate "Configuring git…"
git config user.email "dev@kubermatic.com"
git config user.name "Kubermatic Bot"
# Prow clones over SSH with a deploy key that cannot push. Same swap as the
# release job: the bot token can, and x-access-token is how a token
# authenticates over HTTPS.
git remote set-url origin "https://x-access-token:${KUBERMATIC_BOT_GITHUB_TOKEN}@github.com/${REPO}.git"

# Committed with plumbing rather than by checking out an orphan branch, because
# the build output is in .gitignore and sits inside the working tree. A
# checkout-and-commit dance would have to fight both; writing a tree from a
# throwaway index touches neither the real index nor the checkout.
#
# The result is a parentless commit every run, and the push is a force-push, so
# gh-pages never accumulates history. That matters: the build is ~11 MB across
# ~250 files, and one commit per merge to main would grow the repository
# without bound for a branch whose history nobody will ever read.
echodate "Building the tree…"
gitdir="$(git rev-parse --absolute-git-dir)"
index="$(mktemp -u)"

(
  cd storybook-static
  # --force because of the .gitignore entry; without it this silently stages
  # nothing and publishes an empty site.
  GIT_INDEX_FILE="$index" git --git-dir="$gitdir" --work-tree=. add --all --force
)

tree="$(GIT_INDEX_FILE="$index" git write-tree)"
rm -f "$index"

# The empty tree. Reached if the build produced nothing or the add matched
# nothing, and a force-push of it would replace a working catalogue with a 404.
if [ "$tree" = "$(git hash-object -t tree /dev/null)" ]; then
  echodate "ERROR: the catalogue tree is empty, refusing to publish."
  exit 1
fi

# No parent, and no signoff: nothing here becomes a pull request, so the dco
# plugin never looks at it.
commit="$(git commit-tree "$tree" -m "Publish catalogue from ${PULL_BASE_SHA:-HEAD}")"

echodate "Publishing $(git ls-tree -r --name-only "$tree" | wc -l) files to ${PAGES_BRANCH}…"
retry 3 git push --force origin "${commit}:refs/heads/${PAGES_BRANCH}"

echodate "Done."
