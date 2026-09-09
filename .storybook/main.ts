/*
Copyright 2026 The Kubermatic Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { resolve } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: [
    // Prose pages. First in the list so they are first in the sidebar before
    // `storySort` even runs.
    './docs/**/*.mdx',
    // Every package, so adding one needs no change here.
    '../packages/*/src/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        /*
         * Storybook's MDX pipeline is CommonMark, not GitHub-flavoured
         * Markdown. Without this, a pipe table renders as a paragraph of
         * literal pipes — no error, no warning, just prose that looks like
         * someone pasted a table into a chat window. Same for strikethrough,
         * task lists and bare-URL autolinks.
         *
         * It matters here because the prose pages lean on tables: the failure
         * modes in Installation, the WCAG 2.2 criteria in Accessibility, the
         * enforced-rules list in Contributing.
         */
        mdxPluginOptions: {
          mdxCompileOptions: { remarkPlugins: [remarkGfm] },
        },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    // This catalogue is built in CI on every push. Nothing about it needs
    // reporting to a third party, and a build should not make network calls
    // it does not need.
    disableTelemetry: true,
  },
  typescript: {
    // Generate prop tables from the TS types rather than PropTypes.
    reactDocgen: 'react-docgen-typescript',
  },
  /*
   * A deployed catalogue is not always at the root of its origin — a static
   * host may serve it from `/<something>/`. Storybook reads this at build time
   * to write correct asset URLs; without a matching base every asset URL is
   * absolute-from-root and the page loads blank.
   *
   * hack/ci/publish-catalogue.sh sets it to `/ui-kit/`, which is where Pages
   * serves a project site from. Local and CI builds leave it unset and are
   * served from an origin root.
   */
  viteFinal: async (viteConfig) => {
    const { default: tailwindcss } = await import('@tailwindcss/vite');
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(tailwindcss());
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@': resolve(import.meta.dirname, '../packages/ui-kit/src'),
    };
    if (process.env.STORYBOOK_BASE_PATH) {
      viteConfig.base = process.env.STORYBOOK_BASE_PATH;
    }
    return viteConfig;
  },
};

export default config;
