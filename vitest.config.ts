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

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { unitTest, browserOptimizeDeps } from '@kubermatic/config/vitest';

/*
 * One test run for the whole workspace: unit tests in jsdom, and every story as
 * a real browser test through @storybook/addon-vitest. Each story is also an axe
 * pass, so an accessibility regression fails here rather than going unnoticed in
 * a panel.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      /*
       * `@` is ui-kit's own convention and resolves into that package only.
       * ui-patterns should use relative imports rather than claim a second
       * meaning for the same prefix — one alias cannot point at two packages.
       */
      '@': path.resolve(import.meta.dirname, './packages/ui-kit/src'),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          ...unitTest,
          setupFiles: ['./packages/ui-kit/src/test/setup.ts'],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(import.meta.dirname, '.storybook'),
          }),
        ],
        optimizeDeps: {
          include: browserOptimizeDeps,
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});
