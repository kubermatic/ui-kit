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

# Both build outputs: the library that consumers install, and the static
# Storybook.
#
# The library build is the one that matters here. `npm run typecheck` uses the
# root tsconfig and covers stories and configs, but it never runs Vite, so a
# failure in lib mode or in the .d.ts emit is invisible until someone publishes.

set -euo pipefail

cd $(dirname $0)/../..

echo "--- npm ci"
npm ci

echo "--- build library"
npm run build

echo "--- build storybook"
npm run build-storybook
