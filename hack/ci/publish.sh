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

# Publishes the package to GitHub Packages, if and only if the version in
# package.json has not been published yet.
#
# The idempotency is load-bearing rather than defensive. This runs as a
# postsubmit on main, so it fires on *every* merge; without the check below the
# second merge after a release would fail on "cannot publish over an existing
# version" and stay red until someone bumped. With it, releasing is simply
# "bump the version, merge", and every other merge is a no-op.
#
# The explicit build is also load-bearing. The usual guard for shipping a stale
# dist/ is a prepublishOnly script, and it does not work in this repo: .npmrc
# sets ignore-scripts=true, which suppresses the package's own lifecycle scripts
# as well as its dependencies'. npm publish therefore runs no build of its own,
# and this script is the only thing standing between a merge and a package whose
# dist/ predates its src/.

set -euo pipefail

cd $(dirname $0)/../..

NAME="$(node -p 'require("./package.json").name')"
VERSION="$(node -p 'require("./package.json").version')"

# A miss here is the normal case on a non-release merge. It is also what a
# never-published package returns, which is why the failure is swallowed rather
# than treated as an error.
if npm view "${NAME}@${VERSION}" version > /dev/null 2>&1; then
  echo "${NAME}@${VERSION} is already published; nothing to do."
  exit 0
fi

echo "--- publishing ${NAME}@${VERSION}"

echo "--- npm ci"
npm ci

echo "--- build"
npm run build

echo "--- publish"
npm publish
