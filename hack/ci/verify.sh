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

### The one presubmit. Lockfile check, lint, typecheck, unit tests, the
### published-package checks, the catalogue, and the axe suite, in that order.
###
### It used to be four jobs. Each of them paid for its own pod and its own cold
### `npm ci` — there is no actions/cache in Prow — which is roughly two minutes
### of the wall clock of every job, spent four times over to produce one verdict
### on one commit. One job runs the install once. The cost is that the report is
### a single red or green: which stage failed is a question for the log, and a
### `/retest` re-runs everything rather than only the part that broke.
###
### Ordered cheapest-first, so the log reads top-down and a lint error does not
### queue behind the browser run. The browser suite is last for the same
### reason: it is the slowest stage and the one with a flake surface, and every
### deterministic check has already reported by the time it starts.

set -euo pipefail

cd $(dirname "$0")/../..
source hack/lib.sh

# Checked explicitly, and first, because `npm ci` fails with a message that
# does not explain the most common cause. Dependabot has a known bug with npm
# lockfile v3 plus workspaces: it updates the workspace package.json but leaves
# the root package-lock.json alone, so its PRs arrive out of sync.
echodate "Checking the lockfile is in sync…"
if ! npm ci --dry-run > /dev/null 2>&1; then
  echodate "ERROR: package-lock.json is out of sync with the package.json files."
  echodate "Run 'npm install' locally and commit the updated package-lock.json."
  echodate "On a Dependabot PR this is expected — see .github/dependabot.yml."
  exit 1
fi

npm_ci

echodate "Linting…"
npm run lint

echodate "Typechecking…"
npm run typecheck

echodate "Running unit tests…"
# The thresholds in vitest.config.ts are a ratchet; the coverage run is what
# enforces them. `|| true` would defeat the point, so a failure fails the job.
npm run test:coverage
collect_artifact coverage

# Separate from `typecheck`, which never invokes Vite — a failure in library
# mode or in the .d.ts emit is otherwise invisible until publish time.
# `check:dist` builds, lints the package manifests (publint) and checks the
# entry points resolve (attw).
echodate "Building and checking the published packages…"
npm run check:dist

echodate "Building the catalogue…"
npm run build-storybook
collect_artifact storybook-static

# Every story rendered in real Chromium and scanned, because `target-size` and
# `color-contrast` need layout geometry that jsdom cannot provide. Which is
# also why this needs a browser installed at job time: see playwright_chromium.
playwright_chromium

echodate "Running the accessibility suite…"
npm run test:a11y

echodate "Done."
