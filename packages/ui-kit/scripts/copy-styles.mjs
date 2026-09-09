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
/*
 * Copies the stylesheets into dist/ and injects the `@source` directive that
 * the published package needs.
 *
 * Why this is not simply a `cp`:
 *
 * 1. Tailwind v4 does not scan node_modules. Without an explicit `@source`,
 *    a consumer importing `theme.css` receives the custom properties but none
 *    of the utility classes the components reference — `bg-primary`, `h-9`,
 *    `inline-flex` — and every component renders unstyled. Storybook hides
 *    this locally because `.storybook/preview.css` supplies its own `@source`
 *    pointing at src/.
 * 2. The directive cannot live in the source file, because `@source` resolves
 *    relative to the stylesheet and the source and published locations differ:
 *    src/styles/theme.css sits two levels above the components, dist/theme.css
 *    sits beside them.
 * 3. `cp` is not available on Windows cmd, and this was the only
 *    non-portable line in the build.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(pkgRoot, 'dist');

/*
 * An explicit glob rather than a bare directory: Tailwind applies ignore
 * heuristics to a directory `@source`, and being precise about the emitted
 * files removes any doubt about whether dist/ gets scanned.
 */
const SOURCE_DIRECTIVE = `
/* Emitted by scripts/copy-styles.mjs — tells the consuming app's Tailwind to
 * scan this package's compiled components, which it would otherwise skip
 * because Tailwind v4 does not look inside node_modules. */
@source './**/*.js';
`;

mkdirSync(dist, { recursive: true });

const theme = readFileSync(resolve(pkgRoot, 'src/styles/theme.css'), 'utf8');
writeFileSync(resolve(dist, 'theme.css'), theme.trimEnd() + '\n' + SOURCE_DIRECTIVE);

const preflight = readFileSync(resolve(pkgRoot, 'src/styles/preflight.css'), 'utf8');
writeFileSync(resolve(dist, 'preflight.css'), preflight);

console.log('styles -> dist/theme.css (with @source), dist/preflight.css');
