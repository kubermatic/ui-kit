/*
Copyright 2026 The Kubermatic Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Turns Storybook's generated snippet into something copy-pasteable.
 *
 * Split out of `preview.tsx` because it is the one piece of preview config
 * with real logic in it, and it deserves to be readable on its own.
 */
import * as uiKit from '../packages/ui-kit/src/index';

/**
 * The package's runtime exports, read from the package itself.
 *
 * This used to be a hand-written array, which is a list that only ever gets
 * *more* wrong: a new export silently stops appearing in import lines, and
 * nothing fails. Sorted so a snippet is stable across builds rather than
 * dependent on declaration order.
 */
const PACKAGE_EXPORTS = Object.keys(uiKit).sort();

const IMPORT_MARKER = "from '@kubermatic/ui-kit'";

/** Strip the common indentation from every line after the first. */
export function dedent(code: string): string {
  const lines = code.replace(/\t/g, '  ').split('\n');
  const widths = lines
    .slice(1)
    .filter((line) => line.trim() !== '')
    .map((line) => /^ */.exec(line)![0].length);
  const shift = widths.length > 0 ? Math.min(...widths) : 0;
  return [lines[0], ...lines.slice(1).map((line) => line.slice(shift))].join('\n').trim();
}

/**
 * Storybook serialises a story written with `render` as the whole story
 * object — the `parameters` block and all — which is configuration rather than
 * usage. This keeps just the JSX, repairs the `React.Fragment` artefact that
 * leaks out of args-based stories, and prepends the import so the snippet
 * stands on its own.
 *
 * Must stay **idempotent**: it runs once for the Canvas source and again for
 * the Code panel, so it checks for the import line before adding one.
 */
export function transformSource(code: string): string {
  let out = code;

  const render = /render:\s*\(\)\s*=>\s*\(?([\s\S]*?)\)?\n\}\s*$/.exec(out);
  if (out.trimStart().startsWith('{') && render?.[1]) {
    out = dedent(render[1]);
  }

  out = out.replace(/<React\.Fragment key="[^"]*">/g, '<>').replace(/<\/React\.Fragment>/g, '</>');

  const used = PACKAGE_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(out));
  if (used.length > 0 && !out.includes(IMPORT_MARKER)) {
    out = `import { ${used.join(', ')} } from '@kubermatic/ui-kit';\n\n${out}`;
  }

  return out;
}
