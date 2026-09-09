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

### Weekly periodic. Dependabot opens PRs for *version* drift; it does not tell
### you that a version you are already pinned to has since had an advisory
### published against it. GitHub's Dependabot alerts do that, but they need the
### dependency graph, which on a private repository means Advanced Security.
### Until this repo is public, this job is the substitute.
###
### Deliberately not a presubmit. Advisories appear on someone else's schedule,
### and a transitive one landing overnight should not block an unrelated PR
### from merging. It should page the team, which a failed periodic does via the
### Slack reporter configured on the job.

set -euo pipefail

cd $(dirname "$0")/../..
source hack/lib.sh

npm_ci

failed=0

# `high` rather than `moderate`: at `moderate` this fails most weeks on
# something in the build toolchain that no consumer of the published package
# can reach, and a check that is red by default is a check nobody reads.
#
# devDependencies are included on purpose. They do not ship, but they run in a
# cluster next to a token that can publish under our scope — build-time supply
# chain is the more plausible attack surface here, not the runtime one.
echodate "Auditing the full dependency tree at 'high'…"
npm audit --audit-level=high || failed=1

# The published surface, on its own. Anything here reaches every consuming
# product directly, so it is worth seeing separately even when the combined
# result is green.
echodate "Auditing what actually ships at 'moderate'…"
npm audit --audit-level=moderate --omit=dev || failed=1

if [ "$failed" -ne 0 ]; then
  echodate "ERROR: advisories were found, see the two reports above."
  exit 1
fi

echodate "Done."
