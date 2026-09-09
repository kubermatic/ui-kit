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
 * The token contract, as data.
 *
 * `theme.css` holds the *values*; this file holds the *names* and what each
 * one is for. Everything that needs to know the set of roles reads it from
 * here: the `ThemeTokens` type a consumer overrides, the Foundations/Colors
 * story, and `theme.test.ts`, which asserts the stylesheet defines exactly
 * these roles in both palettes.
 *
 * Deliberately value-free. A hex here would be a second copy of the palette
 * and the two would drift; anything that needs a value reads the computed
 * custom property (in the browser) or parses `theme.css` (in the test).
 */

/**
 * Colour roles. A component may only reference these — never `--brand-*`, and
 * never a literal, which `kubermatic/no-color-literals` enforces.
 */
export const COLOR_ROLES = {
  background: 'Page surface.',
  foreground: 'Default text on `background`.',
  heading: 'Headline text. Aegean on light, lightened on dark.',
  muted: 'Recessed surface — cards, wells, table stripes.',
  'muted-foreground': 'Secondary text. Measured on `muted` *and* on `background`.',
  border: 'Hairlines and dividers. Non-text, so the threshold is 3:1.',
  input: 'Form control borders. Non-text.',
  ring: 'Focus ring. Non-text.',
  primary: 'The call-to-action surface, and the `primary` text tone.',
  'primary-foreground': 'Text on `primary`.',
  secondary: 'The quieter action surface.',
  'secondary-foreground': 'Text on `secondary`.',
  accent: 'Brand Teal as a surface.',
  'accent-foreground': 'Text on `accent`.',
  'highlight-rose': 'Brand Rosé as a surface.',
  'highlight-rose-foreground': 'Text on `highlight-rose`.',
  'highlight-honey': 'Brand Honey as a surface.',
  'highlight-honey-foreground': 'Text on `highlight-honey`.',
  destructive: 'Negatives and warnings, as a surface and as a text tone.',
  'destructive-foreground': 'Text on `destructive`.',
  success: 'Reconciled / healthy, as a surface and as a text tone. Teal-family, darkened on light.',
  'success-foreground': 'Text on `success`.',
  warning: 'Degraded / needs attention. Honey, darkened on light so it can carry text.',
  'warning-foreground': 'Text on `warning`.',
} as const satisfies Record<string, string>;

/** Non-colour roles. Overridable for the same reason the colours are. */
export const SHAPE_ROLES = {
  radius: 'Corner radius. `radius-sm/md/lg` are computed from it.',
} as const satisfies Record<string, string>;

export const FONT_ROLES = {
  'font-display': 'Headlines. Ubuntu Bold.',
  'font-sans': 'Sublines and general text. Roboto.',
  'font-mono': 'Code.',
} as const satisfies Record<string, string>;

/** The reference palette. Documented, but deliberately **not** overridable. */
export const BRAND_ROLES = {
  'brand-teal': 'Highlights, graphic elements.',
  'brand-rose': 'Highlights.',
  'brand-honey': 'Highlights.',
  'brand-cerulean': 'Buttons, links, in-text highlights.',
  'brand-aegean': 'Headlines.',
  'brand-dark-azure': 'Background.',
  'brand-maroon': 'Negatives, warnings.',
} as const satisfies Record<string, string>;

export type ColorRole = keyof typeof COLOR_ROLES;
export type ShapeRole = keyof typeof SHAPE_ROLES;
export type FontRole = keyof typeof FONT_ROLES;
export type BrandRole = keyof typeof BRAND_ROLES;

/**
 * The semantic roles a consumer may override. Excludes `--brand-*`, which is
 * the source document's palette and is not meant to move.
 */
export type ThemeTokenName = ColorRole | ShapeRole | FontRole;

export const COLOR_ROLE_NAMES = Object.keys(COLOR_ROLES) as ColorRole[];
export const BRAND_ROLE_NAMES = Object.keys(BRAND_ROLES) as BrandRole[];

/** WCAG 2.2 AA minima. Text is 4.5:1; graphic and UI components are 3:1. */
export const AA_TEXT = 4.5;
export const AA_NON_TEXT = 3;

export interface ContrastPair {
  /** The role painted underneath. */
  readonly surface: ColorRole;
  /** The role painted on top. */
  readonly foreground: ColorRole;
  /** 4.5 where the pair can carry text, 3 where it is only a graphic. */
  readonly minimumRatio: number;
  /** Why this pair is reachable — i.e. what actually renders it. */
  readonly because: string;
}

/**
 * Every foreground/surface combination the components can actually produce.
 *
 * This is the accessibility contract, and it is checked twice over: once
 * statically, by `theme.test.ts` computing each ratio from `theme.css` in both
 * palettes, and once end-to-end, by axe scanning the Foundations/Colors story
 * in a real browser. The static check is the one that pins down *which* pairs
 * matter — axe can only see the pairs a story happens to render.
 */
export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  {
    surface: 'background',
    foreground: 'foreground',
    minimumRatio: AA_TEXT,
    because: 'Body copy.',
  },
  {
    surface: 'background',
    foreground: 'heading',
    minimumRatio: AA_TEXT,
    because: '`Text variant="h1|h2|h3"`.',
  },
  {
    surface: 'background',
    foreground: 'muted-foreground',
    minimumRatio: AA_TEXT,
    because: '`Text tone="muted"` directly on the page.',
  },
  {
    surface: 'muted',
    foreground: 'muted-foreground',
    minimumRatio: AA_TEXT,
    because: 'The same tone inside a recessed card — the tighter of the two.',
  },
  {
    surface: 'background',
    foreground: 'primary',
    minimumRatio: AA_TEXT,
    because: '`Text tone="primary"` and `Button variant="link"`.',
  },
  {
    surface: 'background',
    foreground: 'destructive',
    minimumRatio: AA_TEXT,
    because: '`Text tone="destructive"`.',
  },
  {
    surface: 'primary',
    foreground: 'primary-foreground',
    minimumRatio: AA_TEXT,
    because: '`Button` default variant.',
  },
  {
    surface: 'secondary',
    foreground: 'secondary-foreground',
    minimumRatio: AA_TEXT,
    because: '`Button variant="secondary"`, `Badge variant="secondary"`.',
  },
  {
    surface: 'destructive',
    foreground: 'destructive-foreground',
    minimumRatio: AA_TEXT,
    because: '`Button variant="destructive"`.',
  },
  {
    surface: 'accent',
    foreground: 'accent-foreground',
    minimumRatio: AA_TEXT,
    because: '`Badge variant="accent"` — Teal is legible only this way round.',
  },
  {
    surface: 'highlight-rose',
    foreground: 'highlight-rose-foreground',
    minimumRatio: AA_TEXT,
    because: '`Badge variant="rose"`.',
  },
  {
    surface: 'highlight-honey',
    foreground: 'highlight-honey-foreground',
    minimumRatio: AA_TEXT,
    because: '`Badge variant="honey"`.',
  },
  {
    surface: 'background',
    foreground: 'success',
    minimumRatio: AA_TEXT,
    because: '`StatusBadge variant="outline"` and a bare `StatusDot tone="success"`.',
  },
  {
    surface: 'background',
    foreground: 'warning',
    minimumRatio: AA_TEXT,
    because: '`StatusBadge variant="outline"` and a bare `StatusDot tone="warning"`.',
  },
  {
    surface: 'success',
    foreground: 'success-foreground',
    minimumRatio: AA_TEXT,
    because: '`StatusBadge tone="success"` — the filled chip.',
  },
  {
    surface: 'warning',
    foreground: 'warning-foreground',
    minimumRatio: AA_TEXT,
    because: '`StatusBadge tone="warning"`.',
  },
  {
    surface: 'background',
    foreground: 'border',
    minimumRatio: AA_NON_TEXT,
    because: 'SC 1.4.11 — `Button variant="outline"`, card hairlines.',
  },
  {
    surface: 'background',
    foreground: 'input',
    minimumRatio: AA_NON_TEXT,
    because: 'SC 1.4.11 — form control boundaries.',
  },
  {
    surface: 'background',
    foreground: 'ring',
    minimumRatio: AA_NON_TEXT,
    because: 'SC 1.4.11 — the focus indicator must be visible.',
  },
];
