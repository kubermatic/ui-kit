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

# Static checks: types, lint and formatting. Deliberately separate from
# test.sh, which has to download a browser — these fail in seconds and are
# what a contributor wants to hear about first.

set -euo pipefail

cd $(dirname $0)/../..

echo "--- npm ci"
npm ci

echo "--- typecheck"
npm run typecheck

echo "--- lint"
npm run lint
