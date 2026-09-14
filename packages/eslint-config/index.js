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
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import kubermatic from './rules/index.js';

/**
 * The shared Kubermatic ESLint config.
 *
 * Consumers spread it into their own flat config and append overrides:
 *
 *   import kubermatic from '@kubermatic/eslint-config';
 *   export default [...kubermatic, { rules: { 'no-console': 'off' } }];
 *
 * `tsconfigRootDir` should be the consuming project's root so that
 * type-aware rules can resolve each file to a tsconfig.
 */
export function kubermaticConfig({ tsconfigRootDir = process.cwd() } = {}) {
  return tseslint.config(
    { ignores: ['**/dist/**', '**/storybook-static/**', '**/coverage/**', '**/node_modules/**'] },

    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,

    {
      languageOptions: {
        parserOptions: { projectService: true, tsconfigRootDir },
        globals: { ...globals.browser, ...globals.es2023 },
      },
    },

    // The `flat.` namespace is the flat-config variant; the top-level
    // `configs['recommended-latest']` is still eslintrc-shaped.
    reactHooks.configs.flat['recommended-latest'],

    {
      rules: {
        // Allow deliberate `_`-prefixed throwaways.
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        // Type-only imports must be explicit; `verbatimModuleSyntax` relies on it.
        '@typescript-eslint/consistent-type-imports': 'error',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        eqeqeq: ['error', 'always'],
      },
    },

    // Config and build files run in Node and are not covered by a tsconfig.
    // Build scripts are CLIs: printing what they did is the point.
    {
      files: ['**/*.config.{js,ts}', '**/.storybook/**', '**/scripts/**'],
      languageOptions: { globals: { ...globals.node } },
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        'no-console': 'off',
      },
    },

    // Stories and tests are allowed to be loose about non-null assertions.
    {
      files: ['**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },

    ...storybook.configs['flat/recommended'],

    // The kit's own conventions, enforced rather than documented.
    {
      plugins: { kubermatic },
      rules: {
        'kubermatic/license-header': ['error', { owner: 'The Kubermatic Authors' }],
      },
    },

    // Colour belongs in theme.css. A component that hardcodes one routes
    // around both the theming mechanism and the measured WCAG guarantees.
    {
      files: ['**/src/**/*.{ts,tsx}'],
      ignores: ['**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}'],
      rules: { 'kubermatic/no-color-literals': 'error' },
    },

    // Components and hooks must declare their client boundary; see the rule
    // for why this is blanket rather than conditional.
    {
      files: ['**/src/components/**/*.tsx', '**/src/hooks/**/*.{ts,tsx}'],
      ignores: ['**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}'],
      rules: { 'kubermatic/require-use-client': 'error' },
    },

    // Stories and tests assert on real colour values — there the literal is
    // the expected value, not a styling decision.
    {
      files: ['**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}'],
      rules: { 'kubermatic/no-color-literals': 'off' },
    },

    // Plain JS and hand-written declaration files are not part of a tsconfig,
    // so the type-aware rules cannot resolve them. Lint them syntactically.
    {
      files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.d.ts'],
      ...tseslint.configs.disableTypeChecked,
      languageOptions: {
        ...tseslint.configs.disableTypeChecked.languageOptions,
        globals: { ...globals.node },
      },
    },

    // Must stay last: switches off everything Prettier owns.
    prettier,
  );
}

export default kubermaticConfig();
