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
 * WCAG contrast, computed rather than recorded.
 *
 * The built-in palette is measured in CI — `theme.test.ts` parses `theme.css`
 * and checks every pair in `CONTRAST_PAIRS`, in both palettes. A **custom**
 * palette leaves that guarantee behind: `ThemeProvider`'s `tokens` prop will
 * happily accept a primary that fails 4.5:1.
 *
 * `auditThemeContrast` closes that gap for consumers. Point it at the element
 * a theme is mounted on and it re-measures the same pairs against whatever is
 * actually computed there, so a product can assert on its own palette in its
 * own test suite:
 *
 * ```ts
 * const { failures } = auditThemeContrast(container);
 * expect(failures).toEqual([]);
 * ```
 */
import { CONTRAST_PAIRS, type ColorRole, type ContrastPair } from '../styles/tokens.js';

/* Regular expressions, not string comparisons: a string literal containing a
 * colour function would trip `kubermatic/no-color-literals`, which is doing
 * its job — this file is the one place that has to speak in raw values. */
const HEX = /^#([\da-f]{3,8})$/i;
const RGB = /^rgba?\(([^)]*)\)$/i;

/** sRGB channels, 0–255. */
type Channels = [number, number, number];

function expandShorthand(hex: string): string {
  if (hex.length !== 3 && hex.length !== 4) return hex;
  return hex
    .split('')
    .map((c) => c + c)
    .join('');
}

/**
 * Parse a solid colour into sRGB channels.
 *
 * Only the notations a browser hands back from `getComputedStyle`, plus the
 * hex that `theme.css` is written in. Anything else — a gradient, `oklch()`,
 * `color-mix()` — is not a token value and is rejected rather than guessed at.
 *
 * @throws if the value is not a solid colour this function understands.
 */
export function parseColor(value: string): Channels {
  const input = value.trim();

  const hexMatch = HEX.exec(input);
  if (hexMatch?.[1]) {
    const hex = expandShorthand(hexMatch[1]);
    if (hex.length !== 6 && hex.length !== 8) {
      throw new Error(`Not a solid colour: ${value}`);
    }
    if (hex.length === 8 && parseInt(hex.slice(6, 8), 16) !== 255) {
      throw new Error(`Translucent colours have no fixed contrast: ${value}`);
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  const rgbMatch = RGB.exec(input);
  if (rgbMatch?.[1]) {
    /*
     * Alpha arrives two ways and both are in circulation: the legacy form
     * puts it fourth in the comma list, the modern form after a slash. Which
     * one a browser hands back depends on the browser, so accept either — the
     * point is to notice the alpha, not to have an opinion about syntax.
     */
    const [channelPart = '', slashAlpha] = rgbMatch[1].split('/');
    const numbers = channelPart
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);

    const channels = numbers.slice(0, 3);
    const alpha = slashAlpha !== undefined ? Number(slashAlpha) : (numbers[3] ?? 1);

    if (numbers.length < 3 || numbers.length > 4 || channels.some(Number.isNaN)) {
      throw new Error(`Not a solid colour: ${value}`);
    }
    if (Number.isNaN(alpha) || alpha !== 1) {
      throw new Error(`Translucent colours have no fixed contrast: ${value}`);
    }
    return channels as Channels;
  }

  throw new Error(`Unsupported colour value: ${value}`);
}

/** WCAG 2.x relative luminance. */
function relativeLuminance([r, g, b]: Channels): number {
  const linear = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }) as Channels;

  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

/**
 * The WCAG contrast ratio between two solid colours, from 1 to 21.
 *
 * Order does not matter — the formula is symmetric.
 */
export function contrastRatio(a: string, b: string): number {
  const lighter = relativeLuminance(parseColor(a));
  const darker = relativeLuminance(parseColor(b));
  const [hi, lo] = lighter > darker ? [lighter, darker] : [darker, lighter];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Two decimals, rounded to nearest — the precision and the rounding WebAIM's
 * checker uses, so a ratio quoted here matches the one someone gets when they
 * verify it by hand. Presentation only: pass/fail is always decided on the
 * unrounded value.
 */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

export interface ContrastResult {
  pair: ContrastPair;
  /** Computed value of the surface role. */
  surfaceValue: string;
  /** Computed value of the foreground role. */
  foregroundValue: string;
  ratio: number;
  passes: boolean;
}

export interface ContrastReport {
  /** Every pair that could be computed, passing or not. */
  measured: ContrastResult[];
  /** The subset below its minimum. Empty means the palette is AA-clean. */
  failures: ContrastResult[];
  /** Pairs skipped, with why — an undefined role, or a non-solid value. */
  unmeasured: { pair: ContrastPair; reason: string }[];
}

/**
 * Re-measure the token contract against whatever is computed on `element`.
 *
 * Reads the roles as custom properties, so it sees the *effective* palette:
 * built-in values, CSS overrides and `ThemeProvider`'s runtime `tokens` alike,
 * for whichever of light or dark is currently applied.
 *
 * Browser-only — it needs a computed style, which is also the point: it
 * measures what the user will actually see.
 */
export function auditThemeContrast(
  element: HTMLElement = document.documentElement,
): ContrastReport {
  const styles = getComputedStyle(element);
  const read = (role: ColorRole) => styles.getPropertyValue(`--${role}`).trim();

  const measured: ContrastResult[] = [];
  const unmeasured: ContrastReport['unmeasured'] = [];

  for (const pair of CONTRAST_PAIRS) {
    const surfaceValue = read(pair.surface);
    const foregroundValue = read(pair.foreground);

    if (!surfaceValue || !foregroundValue) {
      unmeasured.push({ pair, reason: 'Role is not defined on this element.' });
      continue;
    }

    try {
      const ratio = contrastRatio(foregroundValue, surfaceValue);
      measured.push({
        pair,
        surfaceValue,
        foregroundValue,
        ratio,
        passes: ratio >= pair.minimumRatio,
      });
    } catch (error) {
      unmeasured.push({ pair, reason: (error as Error).message });
    }
  }

  return { measured, failures: measured.filter((result) => !result.passes), unmeasured };
}
