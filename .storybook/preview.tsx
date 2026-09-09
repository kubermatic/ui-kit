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
import type { Preview } from '@storybook/react-vite';

import { transformSource } from './source-transform';
import { dark, light } from './theme';
import { withBrand } from './with-brand';
import { withTheme } from './with-theme';

import './preview.css';

const preview: Preview = {
  /*
   * `withBrand` is inside `withTheme`, which only matters for reading order:
   * the theme decorator owns the canvas element, so the brand provider sits
   * within it and any story can nest its own provider to override.
   */
  decorators: [withTheme, withBrand],
  // Gives every component an auto-generated Docs page: description, prop
  // table, and each story with its source.
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Design system theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  /*
   * Light, deliberately, rather than following the OS preference. The
   * accessibility suite renders each story once at whatever this resolves to,
   * so a machine-dependent default would mean CI and a laptop scanning
   * different palettes — and the dark palette has its own stories precisely so
   * that it is covered explicitly rather than by chance.
   */
  initialGlobals: { theme: 'light' },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    /*
     * Reading order for the sidebar. Alphabetical is the default, and it puts
     * the API reference above the page explaining what any of this is. Someone
     * arriving from another product needs Introduction, then how to install
     * it, then the tokens, then the components. Anything unlisted sorts at `*`.
     *
     * Written inline because Storybook extracts `storySort` by parsing this
     * file statically — a reference to a `const` declared above fails the
     * build with "unsupported".
     */
    options: {
      storySort: {
        order: [
          'Introduction',
          'Guides',
          ['Installation', 'Theming', 'Accessibility', 'Contributing'],
          'Foundations',
          ['Colors', 'Typography', 'Theming', 'Custom Theme', 'Showcase'],
          'Primitives',
          'Forms',
          'Data',
          'Feedback',
          'Overlays',
          'Navigation',
          'App Frame',
          'Templates',
          '*',
        ],
      },
    },
    docs: {
      /*
       * Docs pages render inside the preview iframe, so they do not inherit
       * the manager's theme and would sit at default light beside a dark
       * sidebar. Same OS-preference read as `manager.ts`, for the same reason.
       *
       * Unrelated to the `theme` toolbar global: that themes the *stories*.
       */
      theme:
        typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? dark
          : light,
      // Adds a "Code" tab beside Controls and Accessibility, so the usage
      // snippet is visible while browsing stories in Canvas — not only on the
      // Docs page.
      codePanel: true,
      // Snippets are expanded on the Docs page rather than hidden behind a
      // "Show code" click — the usage example is the point of the page.
      canvas: { sourceState: 'shown' },
      source: {
        language: 'tsx',
        transform: transformSource,
        // The theme decorator wraps every story in two divs and a provider.
        // Without this they show up in every snippet.
        excludeDecorators: true,
      },
    },
    a11y: {
      // Any violation fails `npm run test:a11y`.
      test: 'error',
      options: {
        // WCAG 2.2 Level AA = the 2.0 and 2.1 A/AA rulesets plus whatever 2.2
        // added that is machine-checkable. In axe-core 4.13 the `wcag22aa` tag
        // resolves to exactly one rule, `target-size` (SC 2.5.8); the other new
        // 2.2 criteria are page-flow concerns no scanner can decide.
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        },
      },
    },
  },
};

export default preview;
