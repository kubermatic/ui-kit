import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'node:path';

/**
 * Library build.
 *
 * `preserveModules` keeps one output file per source module so consuming apps
 * can tree-shake unused primitives instead of pulling the whole kit. Every
 * peer dependency is externalised — bundling React, Base UI, react-hook-form or
 * sonner would give the app a second copy and silently break their context
 * (a `toast()` in the app would not reach a `<Toaster />` from the kit).
 */
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
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^react$/,
        /^react\//,
        /^react-dom$/,
        /^react-dom\//,
        /^react-hook-form$/,
        /^@base-ui\/react/,
        /^lucide-react$/,
        /^sonner$/,
        /^next-themes$/,
        /^tailwindcss$/,
      ],
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
