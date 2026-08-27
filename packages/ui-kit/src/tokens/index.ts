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

/**
 * Design tokens as importable values.
 *
 * Most of the time a token is best reached through a Tailwind class —
 * `bg-primary` resolves through `--primary` and follows the theme for free.
 * But four rendering boundaries across the dashboards cannot take a class name
 * at all:
 *
 *   - Chart.js dataset colours, which are painted to a canvas
 *   - React Flow node/edge `style` objects
 *   - Recharts `fill` and `stroke` props
 *   - CodeMirror's `EditorView.theme()`
 *
 * Those need a value, and without one somebody hardcodes `#0f766e` and the
 * token system quietly stops being the source of truth for a third of what
 * renders. This module is the supported way to get one.
 *
 * Published as its own entry point (`@kubermatic/ui-kit/tokens`) so reaching
 * for a colour does not pull the component graph into the bundle.
 */

/**
 * Every themeable colour token, in `theme.css` order.
 *
 * This list is asserted against the stylesheet itself by the
 * `Foundations/Tokens → Coverage` story: a token added to `theme.css` without
 * being added here fails the test run, and so does one removed from the
 * stylesheet but left behind here. The two cannot drift apart silently.
 */
export const COLOR_TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
  'body',
  'warning',
  'warning-foreground',
  'warning-soft',
  'success',
  'success-soft',
  'success-foreground',
  'info',
  'info-soft',
  'info-foreground',
  'error-foreground',
] as const;

/** The name of any themeable colour token, without the `--` prefix. */
export type ColorToken = (typeof COLOR_TOKENS)[number];

/**
 * A CSS `var()` reference to a token.
 *
 * Prefer this wherever the value is handed to something that resolves CSS —
 * inline styles, SVG attributes, generated stylesheets. It follows the `.dark`
 * class automatically, so a chart themed this way switches with the rest of the
 * page and nothing has to subscribe to a theme change.
 *
 * ```ts
 * <Bar fill={cssVar('chart-1')} />                  // Recharts
 * <div style={{ background: cssVar('card') }} />    // React Flow
 * ```
 */
export function cssVar(token: ColorToken): string {
  return `var(--${token})`;
}

/** Every token as a `var()` reference, keyed by name. */
export const tokens: Readonly<Record<ColorToken, string>> = Object.freeze(
  Object.fromEntries(COLOR_TOKENS.map((name) => [name, cssVar(name)])),
) as Readonly<Record<ColorToken, string>>;

/**
 * Resolves a token to the colour the browser actually computed.
 *
 * Needed for canvas, which is the one boundary of the four that `var()` does
 * not survive: Chart.js paints through `fillStyle`, and assigning it
 * `var(--chart-1)` yields transparent black rather than a colour. Everything
 * that resolves CSS should use {@link cssVar} instead — this reads the DOM, and
 * the value it returns is a snapshot that will not follow a later theme change.
 *
 * Pass the element the chart lives in rather than relying on the default. Token
 * values are inherited from whichever ancestor carries `.dark`, so resolving
 * against `document.documentElement` returns the light value for a chart inside
 * a dark-classed subtree.
 *
 * Returns an empty string during SSR, where there is nothing to compute against.
 */
export function resolveToken(token: ColorToken, element?: Element): string {
  if (typeof window === 'undefined') return '';

  const target = element ?? document.documentElement;
  return getComputedStyle(target).getPropertyValue(`--${token}`).trim();
}

/**
 * Resolves several tokens in one pass.
 *
 * A chart usually wants the whole `chart-1..5` ramp at once, and doing that
 * through repeated {@link resolveToken} calls means one `getComputedStyle` per
 * colour.
 */
export function resolveTokens<T extends ColorToken>(
  names: readonly T[],
  element?: Element,
): Record<T, string> {
  if (typeof window === 'undefined') {
    return Object.fromEntries(names.map((name) => [name, ''])) as Record<
      T,
      string
    >;
  }

  const styles = getComputedStyle(element ?? document.documentElement);
  return Object.fromEntries(
    names.map((name) => [name, styles.getPropertyValue(`--${name}`).trim()]),
  ) as Record<T, string>;
}

/** The five-colour categorical ramp, in order. */
export const CHART_TOKENS = [
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
] as const satisfies readonly ColorToken[];
