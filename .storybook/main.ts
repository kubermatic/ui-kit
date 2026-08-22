import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/react-vite',
  /*
   * Storybook merges the root vite.config.ts, which is a *library* build:
   * lib mode plus vite-plugin-dts. Neither belongs in a Storybook build — dts
   * alone was over half the build time — so both are stripped here and only
   * Tailwind is added back.
   */
  viteFinal: async (config) => {
    config.plugins = (config.plugins ?? [])
      .flat(Infinity)
      .filter(
        (plugin) =>
          !(
            plugin &&
            typeof plugin === 'object' &&
            'name' in plugin &&
            String((plugin as { name: string }).name).startsWith('vite:dts')
          ),
      );
    config.plugins.push(tailwindcss());
    if (config.build) delete config.build.lib;
    return config;
  },
};
export default config;
