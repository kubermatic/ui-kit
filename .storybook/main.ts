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
    // Cast before flattening: Vite's recursive plugin type makes `flat()`
    // blow TypeScript's instantiation depth limit (TS2589).
    const plugins = ((config.plugins ?? []) as unknown[]).flat(
      Infinity,
    ) as Array<{ name?: string } | null | undefined>;

    const kept = plugins.filter(
      (plugin) => !plugin?.name?.startsWith('vite:dts'),
    );

    config.plugins = [...kept, tailwindcss()] as typeof config.plugins;
    if (config.build) delete config.build.lib;
    return config;
  },
};
export default config;
