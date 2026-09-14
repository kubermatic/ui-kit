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
 * `theme.css`, checked against the contract in `tokens.ts`.
 *
 * The accessibility suite scans stories, so it can only see the pairs a story
 * happens to render, on the palette that story happens to select. This test
 * reads the stylesheet directly and covers the whole contract in both
 * palettes, in milliseconds, with no browser — which also means a token
 * change produces an error naming the token rather than an axe violation
 * naming a DOM node.
 *
 * Three classes of drift it exists to catch:
 *
 *  1. A role added to `tokens.ts` but not defined in the sheet, or defined in
 *     `:root` and forgotten under `.dark`.
 *  2. A colour edited without re-measuring the pairs it takes part in.
 *  3. A recorded ratio in a comment that no longer matches the value beside
 *     it — documentation that has quietly become fiction.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { contrastRatio, formatRatio } from '../lib/contrast.js';

import {
  BRAND_ROLE_NAMES,
  COLOR_ROLE_NAMES,
  CONTRAST_PAIRS,
  FONT_ROLES,
  SHAPE_ROLES,
} from './tokens.js';

// `import.meta.url` is an http URL under the jsdom environment, so the
// stylesheet is located from the module's directory instead.
const source = readFileSync(resolve(import.meta.dirname, 'theme.css'), 'utf8');

const COMMENTS = /\/\*[\s\S]*?\*\//g;
const DECLARATION = /--([\w-]+)\s*:\s*([^;]+);/g;
const VAR_REFERENCE = /^var\(--([\w-]+)\)$/;

/** The declarations inside a single top-level block, in source order. */
function block(name: string): Map<string, string> {
  const pattern = new RegExp(`${name}\\s*\\{([^}]*)\\}`);
  const body = pattern.exec(source.replace(COMMENTS, ''))?.[1];
  if (body === undefined) throw new Error(`theme.css has no ${name} block.`);

  const declarations = new Map<string, string>();
  for (const [, property, value] of body.matchAll(DECLARATION)) {
    if (property && value) declarations.set(property, value.trim());
  }
  return declarations;
}

const root = block(':root');
const dark = block('\\.dark');
const themeInline = block('@theme inline');

/**
 * A palette as the browser would compute it: `.dark` layered over `:root`,
 * with `var()` references followed to a literal.
 *
 * The indirection is the whole design — `--accent: var(--brand-teal)` — so a
 * check that stopped at the first value would be checking almost nothing.
 */
function palette(theme: 'light' | 'dark'): Map<string, string> {
  const declared = theme === 'dark' ? new Map([...root, ...dark]) : new Map(root);

  const resolve = (name: string, seen = new Set<string>()): string => {
    if (seen.has(name)) throw new Error(`Circular custom property: --${name}`);
    const value = declared.get(name);
    if (value === undefined) throw new Error(`--${name} is not defined in the ${theme} palette.`);

    const reference = VAR_REFERENCE.exec(value)?.[1];
    return reference ? resolve(reference, new Set(seen).add(name)) : value;
  };

  return new Map([...declared.keys()].map((name) => [name, resolve(name)]));
}

const PALETTES = { light: palette('light'), dark: palette('dark') } as const;

describe('theme.css defines the token contract', () => {
  it.each(COLOR_ROLE_NAMES)('declares --%s in both palettes', (role) => {
    expect(root.has(role), `--${role} missing from :root`).toBe(true);
    expect(dark.has(role), `--${role} missing from .dark`).toBe(true);
  });

  it.each([...Object.keys(SHAPE_ROLES), ...Object.keys(FONT_ROLES)])(
    'declares --%s on :root',
    (role) => {
      expect(root.has(role)).toBe(true);
    },
  );

  it.each(BRAND_ROLE_NAMES)('declares the reference colour --%s', (role) => {
    expect(root.has(role)).toBe(true);
  });

  /*
   * A role that never reaches `@theme inline` has no Tailwind utility, so
   * `bg-<role>` silently does nothing — the kind of failure that looks like a
   * styling mistake rather than a missing token.
   */
  it.each(COLOR_ROLE_NAMES)('maps --%s to a Tailwind colour utility', (role) => {
    expect(themeInline.get(`color-${role}`)).toBe(`var(--${role})`);
  });

  /*
   * The reverse direction. An extra role in the sheet is a token nobody can
   * discover: it is absent from `ThemeTokens`, so `tokens={{ light: { … } }}`
   * will not accept it, and absent from the Colors story, so nothing renders
   * or measures it.
   */
  it('has no colour role the contract does not know about', () => {
    const known = new Set<string>([
      ...COLOR_ROLE_NAMES,
      ...BRAND_ROLE_NAMES,
      ...Object.keys(SHAPE_ROLES),
      ...Object.keys(FONT_ROLES),
    ]);
    expect([...root.keys()].filter((role) => !known.has(role))).toEqual([]);
  });

  it('re-points every colour role under .dark, and nothing else', () => {
    const colours = new Set<string>(COLOR_ROLE_NAMES);
    expect([...dark.keys()].filter((role) => !colours.has(role))).toEqual([]);
  });
});

describe.each(['light', 'dark'] as const)('%s palette meets WCAG 2.2 AA', (theme) => {
  const values = PALETTES[theme];

  it.each(CONTRAST_PAIRS)(
    '$foreground on $surface clears $minimumRatio:1 — $because',
    ({ surface, foreground, minimumRatio }) => {
      const ratio = contrastRatio(values.get(foreground)!, values.get(surface)!);

      /*
       * Reported rather than silently asserted: when this fails, the message
       * that matters is "4.38:1, needs 4.5:1", not "expected false to be
       * true".
       */
      expect(
        ratio >= minimumRatio,
        `--${foreground} on --${surface} is ${formatRatio(ratio)}, below ${minimumRatio}:1`,
      ).toBe(true);
    },
  );
});

/**
 * The ratios written beside the tokens are documentation, and documentation
 * that cannot be checked is documentation that goes stale. Every ratio
 * annotated on a declaration line must be one this file actually computes for
 * that palette — so editing a colour without editing its comment fails here.
 *
 * Only trailing comments count. The prose blocks explaining *why* Cerulean was
 * corrected quote ratios for values that are deliberately not in the palette
 * (`#0081AE` at 4.42:1), and those are not claims about the current tokens.
 */
describe('the recorded ratios are true', () => {
  const ANNOTATED_DECLARATION = /^[ \t]*--([\w-]+)\s*:[^;]+;[ \t]*\/\*([^*]*)\*\//gm;
  const RATIO = /(\d+\.\d{2}):1/g;

  const computed = (theme: 'light' | 'dark') =>
    new Set(
      CONTRAST_PAIRS.map(({ surface, foreground }) =>
        formatRatio(contrastRatio(PALETTES[theme].get(foreground)!, PALETTES[theme].get(surface)!)),
      ),
    );

  const annotations: { role: string; ratio: string; theme: 'light' | 'dark' }[] = [];
  const darkBlockStart = source.indexOf('.dark {');

  for (const match of source.matchAll(ANNOTATED_DECLARATION)) {
    const [, role, comment] = match;
    for (const [, value] of (comment ?? '').matchAll(RATIO)) {
      annotations.push({
        role: role!,
        ratio: `${value!}:1`,
        theme: match.index >= darkBlockStart ? 'dark' : 'light',
      });
    }
  }

  it('finds annotations in both palettes', () => {
    // Guards the parser itself: a regex that matched nothing would make every
    // case below vacuously pass.
    expect(annotations.filter((a) => a.theme === 'light').length).toBeGreaterThan(5);
    expect(annotations.filter((a) => a.theme === 'dark').length).toBeGreaterThan(5);
  });

  it.each(annotations)('--$role is annotated $ratio in the $theme palette', ({ ratio, theme }) => {
    expect([...computed(theme)]).toContain(ratio);
  });
});
