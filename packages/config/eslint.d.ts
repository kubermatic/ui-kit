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

import type { Linter } from 'eslint';

/** Language, type and hook rules. Applies everywhere. */
export declare const base: Linter.Config[];

/** For packages that own the engine — ui-kit and ui-patterns. */
export declare const library: Linter.Config[];

/** For product repos. Adds the direct-import and local-copy bans. */
export declare const product: Linter.Config[];

declare const _default: Linter.Config[];
export default _default;
