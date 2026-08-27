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

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

/**
 * Library build.
 *
 * `preserveModules` keeps one output file per source module so consuming apps
 * can tree-shake unused primitives instead of pulling the whole kit.
 *
 * Externals are derived from the manifest rather than listed by hand. The hand
 * list had already gone stale twice over — it still named `sonner` and
 * `next-themes` after both left the package — and a stale external list fails
 * in the least obvious way available: the dependency is silently bundled, the
 * app ends up with two copies, and the symptom is a context that mysteriously
 * does not reach across the boundary.
 *
 * Both dependency kinds are externalised, for different reasons:
 *
 *   - peerDependencies are the singletons. Two copies of React or
 *     react-hook-form in one app is an invalid-hook-call, or a form that cannot
 *     see its own provider.
 *   - dependencies are the packages the kit owns outright. They carry no
 *     cross-boundary identity requirement, but bundling them would still be
 *     wrong: `@base-ui/react` is the engine every primitive is built on and has
 *     internal context of its own, and inlining `lucide-react` would defeat the
 *     per-icon tree-shaking that makes it cheap. Consumers resolve them from
 *     node_modules, transitively, which is the point of owning them.
 */
const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
].map(
  (name) => new RegExp(`^${name.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')}(/|$)`),
);

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      include: ['src'],
      exclude: [
        'src/**/*.test.tsx',
        'src/**/*.test.ts',
        'src/**/*.stories.tsx',
      ],
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(import.meta.dirname, 'src/index.ts'),
        /*
         * Tokens ship as their own entry point. Four rendering boundaries across
         * the products cannot take a class name — Chart.js datasets, React Flow
         * `style`, Recharts `fill`, CodeMirror's `EditorView.theme()` — so the
         * values have to be importable, and a consumer reaching for them should
         * not have to pull the component graph in to get them.
         */
        /*
         * Keyed 'tokens/index', not 'tokens'. `entryFileNames: '[name].js'`
         * writes the key verbatim, so the shorter name emits dist/tokens.js
         * while vite-plugin-dts mirrors the source tree and emits
         * dist/tokens/index.d.ts — types and implementation land in different
         * places and the subpath fails to resolve for consumers only.
         */
        'tokens/index': path.resolve(
          import.meta.dirname,
          'src/tokens/index.ts',
        ),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    sourcemap: true,
    minify: false,
  },
});
