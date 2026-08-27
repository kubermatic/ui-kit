#!/usr/bin/env bash

# Copyright 2026 The Kubermatic ui-kit Authors.
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

# Publishes every publishable workspace to GitHub Packages, skipping any whose
# version the registry already has.
#
# The idempotency is load-bearing rather than defensive. This runs as a
# postsubmit on main, so it fires on *every* merge; without the check below the
# second merge after a release would fail on "cannot publish over an existing
# version" and stay red until someone bumped. With it, releasing is simply
# "bump the version, merge", and every other merge is a no-op.
#
# It is also what makes independent package versions workable: ui-kit and config
# do not have to move together, because each is considered on its own.
#
# The explicit build is likewise load-bearing. The usual guard for shipping a
# stale dist/ is a prepublishOnly script, and it does not work in this repo:
# .npmrc sets ignore-scripts=true, which suppresses the package's own lifecycle
# scripts as well as its dependencies'. npm publish therefore runs no build of
# its own, and this script is the only thing standing between a merge and a
# package whose dist/ predates its src/.

set -euo pipefail

cd $(dirname $0)/../..

echo "--- npm ci"
npm ci

echo "--- build"
npm run build

# `npm query .workspace` reports every workspace with its resolved location, so
# a package added under packages/ is picked up here without editing this script.
WORKSPACES="$(npm query .workspace | node -e '
  const input = require("fs").readFileSync(0, "utf8");
  for (const ws of JSON.parse(input)) {
    if (ws.private) continue;
    console.log(`${ws.name}\t${ws.version}\t${ws.location}`);
  }
')"

if [ -z "${WORKSPACES}" ]; then
  echo "No publishable workspaces found."
  exit 0
fi

published=0
while IFS=$'\t' read -r NAME VERSION LOCATION; do
  [ -z "${NAME}" ] && continue

  # A miss here is the normal case on a non-release merge. It is also what a
  # never-published package returns, which is why the failure is swallowed
  # rather than treated as an error.
  if npm view "${NAME}@${VERSION}" version > /dev/null 2>&1; then
    echo "--- ${NAME}@${VERSION} is already published; nothing to do."
    continue
  fi

  echo "--- publishing ${NAME}@${VERSION}"
  npm publish --workspace "${NAME}"
  published=$((published + 1))
done <<< "${WORKSPACES}"

echo "--- published ${published} package(s)"
