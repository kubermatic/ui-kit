/*
 * Copyright 2026 The Kubermatic ui-kit Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Base Vitest settings for a React package.
 *
 * Exported as a plain object rather than a `defineConfig` call so a consumer
 * can spread it into a project entry — Vitest's workspace/projects shape wants
 * objects, and a pre-wrapped config cannot be composed.
 *
 *   import { unitTest } from '@kubermatic/config/vitest';
 *   export default defineConfig({ test: { projects: [{ extends: true, test: unitTest }] } });
 */

/** jsdom unit tests. Point `setupFiles` at your own setup module. */
export const unitTest = {
  environment: 'jsdom',
  globals: true,
};

/**
 * Dependencies that have to be pre-bundled for Vitest browser mode.
 *
 * Two distinct reasons, both of which surface only on a cold cache and so tend
 * to pass locally and fail in CI:
 *
 *   - aria-query and friends are CommonJS with no ESM entry, so browser mode
 *     cannot resolve their named exports without the optimizer synthesising them.
 *   - react-hook-form is imported by a handful of stories only, so Vite
 *     discovers it mid-run, re-optimizes and reloads the page underneath the
 *     test: 'Failed to fetch dynamically imported module', once.
 */
export const browserOptimizeDeps = [
  'aria-query',
  'lz-string',
  'dom-accessibility-api',
  'pretty-format',
  'react-hook-form',
  '@testing-library/dom',
  '@testing-library/user-event',
];

export default { unitTest, browserOptimizeDeps };
