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

# Unit tests plus every Storybook story, run as a real browser test through
# @storybook/addon-vitest. Each story is also an axe pass, so an accessibility
# regression fails here rather than going unnoticed in a panel.

set -euo pipefail

cd $(dirname $0)/../..

echo "--- npm ci"
npm ci

# The repo's .npmrc sets ignore-scripts=true as supply-chain hardening, which
# also suppresses Playwright's own postinstall — so the browser is never
# downloaded by `npm ci` and has to be fetched explicitly. --with-deps pulls the
# system libraries headless Chromium needs, which the build image does not ship.
echo "--- install chromium"
npx playwright install --with-deps chromium

echo "--- test"
npm test
