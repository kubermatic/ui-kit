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

/**
 * Storybook's own chrome, in Kubermatic colours.
 *
 * This is the catalogue several products read to decide what the design system
 * *is*; stock Storybook branding makes it look like a scratch project rather
 * than the shared source of truth. It also removes a real ambiguity — with the
 * sidebar in default blue-grey it is not obvious which colours on screen are
 * ours and which are Storybook's.
 *
 * Values are duplicated from `theme.css` rather than imported, and that is not
 * an oversight. The manager bundle is built separately from the preview
 * iframe: it has no Tailwind, no `@theme`, and no access to the CSS custom
 * properties, so it needs literals. Keep the list short for that reason —
 * every entry here is a copy that can drift.
 */
import { create } from 'storybook/theming/create';

const BRAND = {
  teal: '#00d9d2',
  cerulean: '#0081ae',
  aegean: '#00517d',
  darkAzure: '#001128',
  white: '#ffffff',
  paleBlue: '#eef4fc',
  slate: '#232f3d',
} as const;

const shared = {
  brandTitle: 'Kubermatic UI Kit',
  brandUrl: 'https://github.com/kubermatic/ui-kit',
  brandTarget: '_self',
  fontBase: '"Roboto", ui-sans-serif, system-ui, sans-serif',
  fontCode: 'ui-monospace, "Cascadia Code", "Source Code Pro", monospace',
} as const;

export const light = create({
  ...shared,
  base: 'light',
  colorPrimary: BRAND.aegean,
  colorSecondary: BRAND.cerulean,
  appBg: BRAND.paleBlue,
  appContentBg: BRAND.white,
  appBorderColor: '#d3deeb',
  textColor: BRAND.darkAzure,
  barSelectedColor: BRAND.cerulean,
});

export const dark = create({
  ...shared,
  base: 'dark',
  colorPrimary: BRAND.teal,
  colorSecondary: BRAND.teal,
  appBg: BRAND.darkAzure,
  appContentBg: '#0a1a33',
  appBorderColor: BRAND.slate,
  textColor: BRAND.white,
  barSelectedColor: BRAND.teal,
});
