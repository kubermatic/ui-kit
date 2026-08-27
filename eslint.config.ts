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

import { defineConfig } from 'eslint/config';
import { library } from '@kubermatic/config/eslint';
import kubermatic from '@kubermatic/config/rules';

/**
 * The repo lints itself with the config it publishes.
 *
 * `library` rather than the default export: ui-kit and ui-patterns are the
 * packages that legitimately import the engine, so the direct-import ban that
 * products get would fire on every file here.
 */
export default defineConfig([
  ...library,

  /*
   * The config package is plain ESM JavaScript — a shareable config that needed
   * building before it could configure a build would be a bootstrap knot. It
   * gets the custom rules without the TypeScript machinery.
   */
  {
    files: ['packages/config/**/*.js'],
    plugins: { kubermatic },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { console: 'readonly', process: 'readonly' },
    },
    rules: {
      'kubermatic/license-header': [
        'error',
        { owner: 'The Kubermatic ui-kit Authors' },
      ],
      'kubermatic/no-color-literals': 'error',
    },
  },
]);
