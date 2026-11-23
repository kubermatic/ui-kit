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
import kubermatic from '@kubermatic/eslint-config';

/*
 * Shipped source may not use the `@/` alias.
 *
 * TypeScript resolves `paths` when it typechecks but does NOT rewrite them
 * when it emits, so `import type { PolymorphicProps } from '@/lib/...'`
 * survives verbatim into the emitted `.d.ts` files — where a consumer has no
 * alias and gets `TS2307: Cannot find module '@/lib/polymorphic'`. Nothing
 * in this repo notices, because everything here *does* define the alias.
 *
 * This rule is the only thing that catches it. Nothing re-checks the
 * emitted declarations after a build, so keep it enabled.
 */
const noAliasImport = {
  group: ['@/*'],
  message:
    'Published sources must use a relative specifier with an explicit .js extension — the `@/` alias is not rewritten on emit and breaks consumers’ type resolution.',
};

/*
 * TanStack Table v9 still ships the v8 API under `/legacy`. It is a migration
 * aid that upstream has scheduled for removal, so code written against it is
 * a second migration waiting to happen.
 */
const noTableLegacyImport = {
  group: ['@tanstack/react-table/legacy', '@tanstack/react-table/legacy/*'],
  message:
    '`@tanstack/react-table/legacy` is the deprecated v8 compatibility layer and is scheduled for removal — use the kit’s v9 seam in data-table-types.ts.',
};

const publishedSources = ['packages/*/src/**/*.{ts,tsx}'];

// Stories and tests are exempt — they never reach a tarball, and `@/` reads
// better in a story than four levels of `../`.
const nonPublishedSources = [
  'packages/*/src/**/*.stories.{ts,tsx}',
  'packages/*/src/**/*.test.{ts,tsx}',
  'packages/*/src/test/**',
];

/*
 * The only files allowed to import `@tanstack/react-table` directly.
 *
 * Every TanStack type the kit exposes is re-exported (or aliased) from
 * data-table-types.ts, and the feature set is assembled once in
 * data-table-features.ts. Keeping the import to these files means the next
 * TanStack major is a change to the seam, not a hunt through every component.
 */
const tableSeam = [
  'packages/ui-kit/src/components/ui/data-table-types.ts',
  'packages/ui-kit/src/components/ui/data-table-features.ts',
  'packages/ui-kit/src/components/ui/data-table.tsx',
];

export default [
  ...kubermatic,

  {
    files: publishedSources,
    ignores: nonPublishedSources,
    rules: {
      'no-restricted-imports': ['error', { patterns: [noAliasImport, noTableLegacyImport] }],
      // A deprecated API is one upstream intends to remove. Using it in
      // shipped code turns their next major into ours, as the TanStack v8
      // compat layer would have.
      '@typescript-eslint/no-deprecated': 'error',
    },
  },

  /*
   * Outside the seam, `@tanstack/react-table` itself is off limits too.
   *
   * A later `no-restricted-imports` entry replaces the earlier one for the
   * files it matches rather than merging with it, so the patterns above are
   * repeated here; dropping them would silently lift the `@/` ban everywhere
   * except the seam.
   */
  {
    files: publishedSources,
    ignores: [...nonPublishedSources, ...tableSeam],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@tanstack/react-table',
              message:
                'Import TanStack Table types from ./data-table-types.js — only the data-table seam may depend on `@tanstack/react-table` directly.',
            },
          ],
          patterns: [noAliasImport, noTableLegacyImport],
        },
      ],
    },
  },
];
