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

export default [
  ...kubermatic,

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
   *
   * Stories and tests are exempt — they never reach a tarball, and `@/` reads
   * better in a story than four levels of `../`.
   */
  {
    files: ['packages/*/src/**/*.{ts,tsx}'],
    ignores: [
      'packages/*/src/**/*.stories.{ts,tsx}',
      'packages/*/src/**/*.test.{ts,tsx}',
      'packages/*/src/test/**',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/*'],
              message:
                'Published sources must use a relative specifier with an explicit .js extension — the `@/` alias is not rewritten on emit and breaks consumers’ type resolution.',
            },
          ],
        },
      ],
    },
  },
];
