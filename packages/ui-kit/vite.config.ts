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
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

/**
 * Everything declared as a dependency stays external. Bundling them would
 * ship a second copy of Base UI to any consumer that already uses it, which
 * breaks provider identity the same way a duplicate React does.
 */
const externalPackages = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

const isExternal = (id: string) =>
  externalPackages.some((dep) => id === dep || id.startsWith(`${dep}/`));

// Library build: ESM only. Declarations are emitted separately by
// `tsc -p tsconfig.build.json`.
//
// `theme.css` is deliberately NOT bundled — it carries Tailwind v4 at-rules
// (`@theme inline`, `@custom-variant`) that must reach the consumer's Tailwind
// compiler verbatim, so the build copies it instead.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
  build: {
    lib: {
      entry: [
        resolve(import.meta.dirname, 'src/index.ts'),
        // A second entry so `@kubermatic/ui-kit/icons` is emitted. With
        // `preserveModules`, a module no other module imports is not reached
        // from the root entry and would simply not appear in dist/.
        resolve(import.meta.dirname, 'src/icons.ts'),
      ],
      formats: ['es'],
    },
    rollupOptions: {
      external: isExternal,
      output: {
        /*
         * One output file per source file, rather than a single bundle.
         *
         * Rollup drops module-level directives when it merges modules, which
         * silently strips every `'use client'` — and a React Server Component
         * importing the bundle then fails on the first hook it sees. Preserving
         * modules keeps each directive attached to its own file, and leaves
         * server-safe modules like `lib/utils` free of a client boundary.
         */
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    sourcemap: true,
  },
});
