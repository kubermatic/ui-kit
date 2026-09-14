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

/**
 * The icon set, re-exported.
 *
 * `lucide-react` is a direct dependency of this package rather than a peer,
 * because there is no cross-boundary identity requirement — an icon is a leaf
 * SVG component, not a context. Products get it transitively and never pin it
 * themselves, which is what closed the three-major version split between the
 * consuming products.
 *
 * "Products never install it" only holds if they never *need* to, so the whole
 * surface is re-exported here rather than a curated subset. A curated list
 * becomes a queue of PRs asking for one more icon.
 *
 *   import { Server, KeyRound } from '@kubermatic/ui-kit/icons';
 *
 * A separate entry point, not part of the root export, so `import { Button }`
 * does not pull an icon barrel into the module graph.
 */
export * from 'lucide-react';
