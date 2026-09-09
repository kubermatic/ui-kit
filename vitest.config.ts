/*
 * Copyright 2026 The Kubermatic Authors
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
import { resolve } from 'node:path';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const alias = { '@': resolve(import.meta.dirname, 'packages/ui-kit/src') };

export default defineConfig({
  test: {
    projects: [
      // Unit tests: fast, jsdom, no browser needed.
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: 'unit',
          /*
           * Above the 5s default. Nothing here is slow — the reason is that
           * `npm run test:all` runs this project *concurrently* with the
           * browser one, so on a busy machine a trivial render can sit
           * descheduled past 5s. That produced two failures in a full-suite
           * run that both passed in isolation, in different files each time,
           * which is contention rather than a slow test.
           */
          testTimeout: 20_000,
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./packages/ui-kit/src/test/setup.ts'],
          include: ['packages/*/src/**/*.test.{ts,tsx}'],
          css: false,
        },
      },

      // Accessibility: every story rendered in real Chromium and scanned by
      // axe. A browser is not optional here — `target-size` and
      // `color-contrast` need real layout geometry, which jsdom cannot give.
      {
        plugins: [storybookTest({ configDir: resolve(import.meta.dirname, '.storybook') })],
        resolve: { alias },
        test: {
          name: 'a11y',
          /*
           * Well above the 15s Storybook's runner defaults to. A case here is
           * a Storybook story mounted in a real browser plus a full axe scan,
           * and `npm run verify` runs this project alongside the jsdom one —
           * so on a busy machine a case that needs two seconds of work can sit
           * descheduled for far longer than that. The failures it produced
           * were a different story every run, at 40s of wall clock for a 15s
           * limit, which is the signature of contention rather than of a slow
           * component.
           */
          testTimeout: 60_000,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: ['**/*.stories.tsx', '**/test/**', '**/index.ts'],
      /*
       * A floor just under today's numbers, so it catches a regression without
       * failing on rounding. Raise it when coverage rises — the point is a
       * ratchet, not a target.
       */
      thresholds: {
        statements: 96,
        branches: 96,
        functions: 93,
        lines: 97,
      },
    },
  },
});
