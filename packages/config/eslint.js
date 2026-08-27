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
 * Shared ESLint flat config for Kubermatic frontend repos.
 *
 *   import config from '@kubermatic/config/eslint';   // products — strict
 *   import { library } from '@kubermatic/config/eslint'; // ui-kit / ui-patterns
 *
 * The default export is the strict one on purpose. A product that forgets to
 * pick a preset gets the import bans; a library that legitimately needs to
 * import the engine has to say so. The opposite default would make the ban
 * opt-in, which is the same as not having it.
 */

import { createRequire } from 'node:module';

import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';

import { plugin as kubermatic } from './rules/index.js';

/*
 * versions.json is the single source of truth for what ui-kit owns, so the
 * import ban below cannot drift from the manifest the check script enforces.
 *
 * createRequire rather than an import attribute: `with { type: 'json' }` is
 * still gated behind a Node version floor, and an ESLint config that fails to
 * load is a worse failure mode than a two-line require.
 */
const require = createRequire(import.meta.url);
/** @type {{ owned: string[], bannedPaths: string[] }} */
const versions = require('./versions.json');

const OWNED_MESSAGE =
  'Owned by @kubermatic/ui-kit / @kubermatic/ui-patterns. Import it from there — a second copy re-opens the version split this package exists to close.';

/** Language, type and hook rules. Everything here applies everywhere. */
export const base = defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/storybook-static/**',
    '**/coverage/**',
    '**/*.tsbuildinfo',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      eslint.configs.recommended,
      typescriptEslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    plugins: { kubermatic },
    languageOptions: {
      parser: typescriptEslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { projectService: true },
    },
    rules: {
      /*
       * `any` is allowed. Base UI's render-prop types and TanStack's column
       * generics both bottom out in it, and the alternative is a file of
       * suppressions that reads worse than the `any` did.
       */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'react-hooks/set-state-in-effect': 'off',

      'kubermatic/license-header': [
        'error',
        { owner: 'The Kubermatic ui-kit Authors' },
      ],
      'kubermatic/no-color-literals': 'error',
    },
  },
  {
    /*
     * Stories and tests read colour rather than author it: they assert that
     * `getComputedStyle(...).backgroundColor` resolved to a real value, which
     * is how the kit proves its Tailwind classes were not purged and how the
     * contrast story measures AA ratios. Those assertions have to name a
     * concrete `oklch(...)` or `rgba(0, 0, 0, 0)` — the literal *is* the
     * expected value.
     *
     * The ban stays on for component source, which is the only place a colour
     * can escape the token system and ship.
     */
    files: ['**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}'],
    rules: {
      'kubermatic/no-color-literals': 'off',
    },
  },
  eslintConfigPrettier,
  ...storybook.configs['flat/recommended'],
]);

/**
 * For the packages that own the engine — ui-kit and ui-patterns.
 *
 * Skips the import bans, since these are the packages allowed to import the
 * engine directly. Adds the `'use client'` requirement, because everything they
 * publish is consumed by apps that may render it inside a React Server
 * Component tree — KDP is on Next 16 — and a primitive without the directive
 * fails in that consumer's build rather than here.
 */
export const library = defineConfig([
  ...base,
  {
    files: ['**/src/components/**/*.tsx', '**/src/hooks/**/*.{ts,tsx}'],
    ignores: ['**/*.stories.tsx', '**/*.test.{ts,tsx}'],
    rules: {
      'kubermatic/require-use-client': 'error',
    },
  },
]);

/**
 * For product repos.
 *
 * Adds the bans that make the tier boundary real: no reaching past ui-kit to
 * the engine underneath, and no local `src/components/ui/` shadow copy of the
 * kit — which is what `shadcn add` produces and what this whole package exists
 * to make unnecessary.
 */
export const product = defineConfig([
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: versions.owned.map((name) => ({
            name,
            message: OWNED_MESSAGE,
          })),
          patterns: [
            {
              group: versions.owned.map((name) => `${name}/*`),
              message: OWNED_MESSAGE,
            },
            {
              group: ['**/components/ui/*', '**/components/ui'],
              message:
                'Local copy of a kit primitive. Import from @kubermatic/ui-kit instead; if the primitive is missing, add it to the kit.',
            },
          ],
        },
      ],
    },
  },
]);

export default product;
