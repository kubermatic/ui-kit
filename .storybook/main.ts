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

import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

const config: StorybookConfig = {
  /*
   * Both packages, one catalogue. The glob is package-agnostic on purpose:
   * adding packages/ui-patterns should not also require editing this file.
   */
  stories: [
    '../packages/*/src/**/*.mdx',
    '../packages/*/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/react-vite',
  /*
   * There is no vite.config.ts at the workspace root — the only one lives in
   * packages/ui-kit and is a *library* build (lib mode plus vite-plugin-dts),
   * neither of which belongs in a Storybook build. Storybook resolves its config
   * from the root, so it never picks that up.
   *
   * What it does mean is that the two things the library config used to supply
   * have to be supplied here: Tailwind, and the `@` alias the components import
   * `@/lib/utils` through.
   */
  viteFinal: async (config) => {
    // Cast before flattening: Vite's recursive plugin type makes `flat()`
    // blow TypeScript's instantiation depth limit (TS2589).
    const plugins = ((config.plugins ?? []) as unknown[]).flat(
      Infinity,
    ) as Array<{ name?: string } | null | undefined>;

    const kept = plugins.filter(
      (plugin) => !plugin?.name?.startsWith('vite:dts'),
    );

    config.plugins = [...kept, tailwindcss()] as typeof config.plugins;

    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': path.resolve(import.meta.dirname, '../packages/ui-kit/src'),
      },
    };

    if (config.build) delete config.build.lib;
    return config;
  },
};
export default config;
