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
import licenseHeader from './license-header.js';
import noColorLiterals from './no-color-literals.js';
import requireUseClient from './require-use-client.js';

/**
 * The Kubermatic ESLint plugin.
 *
 * Packaged as a plugin object rather than loose rules so a consumer writes
 * `plugins: { kubermatic }` once and refers to `kubermatic/<rule>` thereafter.
 */
const plugin = {
  meta: { name: '@kubermatic/eslint-config', version: '0.1.0' },
  rules: {
    'license-header': licenseHeader,
    'no-color-literals': noColorLiterals,
    'require-use-client': requireUseClient,
  },
};

export default plugin;
