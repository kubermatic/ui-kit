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

import licenseHeader from './license-header.js';
import noColorLiterals from './no-color-literals.js';

/**
 * The rules that have no upstream home.
 *
 * Kept as a plugin object rather than loose files so a consuming flat config
 * can register them in one line: `plugins: { kubermatic }`.
 *
 * @type {import('eslint').ESLint.Plugin}
 */
export const plugin = {
  meta: { name: '@kubermatic/config', version: '0.1.0' },
  rules: {
    'license-header': licenseHeader,
    'no-color-literals': noColorLiterals,
  },
};

export default plugin;
