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

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { alertVariants } from '@/components/ui/alert';
import { badgeVariants } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';

/*
 * Contrast audit for the token set.
 *
 * axe's own `color-contrast` rule is switched off in `.storybook/preview.tsx`,
 * because it is a property of the palette rather than of any one primitive:
 * leaving it on failed roughly 150 assertions across every story that renders
 * muted text, all of them restating the same handful of token facts.
 *
 * This story states those facts once, and turns them into a guard. It measures
 * what the browser actually paints — real utility classes, alpha composited
 * against the surface underneath — so it stays correct when a token moves, and
 * it fails if the set of failing pairs ever grows.
 *
 * It also covers something the axe rule never did: the dark theme. Story-level
 * a11y runs against the default globals only, so dark contrast was never
 * checked at all. The two stories below check both.
 */

interface Sample {
  /** Stable key used by the guard's expected-failure list. */
  readonly id: string;
  readonly label: string;
  /** The real utility combination, lifted from the component that uses it. */
  readonly className: string;
  readonly usage: string;
}

const SAMPLES = [
  {
    id: 'body',
    label: 'foreground / background',
    className: 'text-foreground bg-background',
    usage: 'Body copy',
  },
  {
    id: 'muted-on-background',
    label: 'muted-foreground / background',
    className: 'text-muted-foreground bg-background',
    usage: 'Descriptions, hints, table secondary cells',
  },
  {
    id: 'muted-on-card',
    label: 'muted-foreground / card',
    className: 'text-muted-foreground bg-card',
    usage: 'Card descriptions',
  },
  {
    id: 'muted-on-muted',
    label: 'muted-foreground / muted',
    className: 'text-muted-foreground bg-muted',
    usage: 'Chips, wells',
  },
  {
    id: 'primary',
    label: 'primary-foreground / primary',
    className: buttonVariants({ variant: 'default' }),
    usage: 'Default button',
  },
  {
    id: 'secondary',
    label: 'secondary-foreground / secondary',
    className: buttonVariants({ variant: 'secondary' }),
    usage: 'Secondary button',
  },
  {
    id: 'accent',
    label: 'accent-foreground / accent',
    className: 'text-accent-foreground bg-accent',
    usage: 'Menu and option hover',
  },
  {
    id: 'destructive-solid',
    label: 'destructive-foreground / destructive',
    className: buttonVariants({ variant: 'destructive' }),
    usage: 'Destructive button',
  },
  {
    id: 'destructive-text',
    label: 'error-foreground / background',
    className: buttonVariants({ variant: 'ghostDestructive' }),
    usage:
      'outlineDestructive, ghostDestructive, destructive menu item, FormMessage',
  },
  {
    id: 'popover',
    label: 'popover-foreground / popover',
    className: 'text-popover-foreground bg-popover',
    usage: 'Menus, popovers, combobox lists',
  },
  {
    id: 'tooltip',
    label: 'background / foreground',
    className: 'text-background bg-foreground',
    usage: 'Tooltip (inverted)',
  },
  {
    id: 'alert-info',
    label: 'info-soft / info@10%',
    className: alertVariants({ variant: 'info' }),
    usage: 'Alert variant info',
  },
  {
    id: 'alert-success',
    label: 'success-soft / success@10%',
    className: alertVariants({ variant: 'success' }),
    usage: 'Alert variant success',
  },
  {
    id: 'alert-warning',
    label: 'warning-soft / warning@10%',
    className: alertVariants({ variant: 'warning' }),
    usage: 'Alert variant warning',
  },
  {
    id: 'alert-error',
    label: 'error-foreground / destructive@10%',
    className: alertVariants({ variant: 'error' }),
    usage: 'Alert variant error',
  },
  {
    id: 'badge-success',
    label: 'success-foreground / success',
    className: badgeVariants({ variant: 'success' }),
    usage: 'Badge variant success',
  },
  {
    id: 'badge-warning',
    label: 'warning-foreground / warning',
    className: badgeVariants({ variant: 'warning' }),
    usage: 'Badge variant warning',
  },
  {
    id: 'badge-info',
    label: 'info-foreground / info',
    className: badgeVariants({ variant: 'info' }),
    usage: 'Badge variant info',
  },
  {
    id: 'sidebar',
    label: 'sidebar-foreground / sidebar',
    className: 'text-sidebar-foreground bg-sidebar',
    usage: 'Sidebar body',
  },
  {
    id: 'sidebar-accent',
    label: 'sidebar-accent-foreground / sidebar-accent',
    className: 'text-sidebar-accent-foreground bg-sidebar-accent',
    usage: 'Sidebar active and hover row',
  },
] satisfies readonly Sample[];

/** WCAG 2.2 AA for normal-size text. Every sample below renders at 14px. */
const AA_NORMAL = 4.5;

/*
 * Known failures. Both empty: every pair below currently clears WCAG AA in both
 * themes.
 *
 * Kept as named constants rather than folded into the guard, because the point
 * is that they are a ratchet. A regression fails the build; so does an
 * improvement, which is the prompt to keep this list honest instead of letting
 * it drift into a list of excuses.
 */
const KNOWN_FAILING_LIGHT: readonly string[] = [];

const KNOWN_FAILING_DARK: readonly string[] = [];

interface Measurement {
  readonly id: string;
  readonly label: string;
  readonly usage: string;
  readonly ratio: number;
}

/** Paints `overlay` over `base` and reads back the flattened sRGB triplet. */
function flatten(
  context: CanvasRenderingContext2D,
  base: string,
  overlay: string,
): [number, number, number] {
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = base;
  context.fillRect(0, 0, 1, 1);
  context.fillStyle = overlay;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

function relativeLuminance([r, g, b]: [number, number, number]) {
  const [rl, gl, bl] = [r, g, b].map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.03928
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(
  foreground: [number, number, number],
  background: [number, number, number],
) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

/**
 * Measures each sample from the DOM rather than from the stylesheet.
 *
 * Going through `getComputedStyle` and a canvas means alpha is handled by the
 * browser: the alert variants paint their text on a 10% tint of a status colour
 * over the page background, and hard-coding that composite would be a second
 * implementation of it that could drift from the first.
 */
function useContrastAudit() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [rows, setRows] = React.useState<Measurement[]>([]);

  React.useEffect(() => {
    const measure = () => {
      const root = ref.current;
      if (!root) {
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        return;
      }

      const surface = getComputedStyle(root).backgroundColor;

      setRows(
        SAMPLES.map((sample) => {
          const element = root.querySelector<HTMLElement>(
            `[data-sample="${sample.id}"]`,
          );
          if (!element) {
            return { ...sample, ratio: 0 };
          }

          const styles = getComputedStyle(element);
          const background = flatten(context, surface, styles.backgroundColor);
          const foreground = flatten(
            context,
            `rgb(${background.join(',')})`,
            styles.color,
          );

          return {
            id: sample.id,
            label: sample.label,
            usage: sample.usage,
            ratio: contrastRatio(foreground, background),
          };
        }),
      );
    };

    measure();

    const observer = new MutationObserver(measure);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return [ref, rows] as const;
}

function ContrastTable() {
  const [ref, rows] = useContrastAudit();
  const failing = rows.filter((row) => row.ratio < AA_NORMAL);

  return (
    <div ref={ref} className="bg-background space-y-6">
      <dl className="flex gap-8 text-sm">
        <div>
          <dt className="text-muted-foreground text-xs">Pairs measured</dt>
          <dd data-testid="measured" className="font-mono">
            {rows.length}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">
            Below AA ({AA_NORMAL}:1)
          </dt>
          <dd data-testid="failing" className="font-mono">
            {failing.length ? failing.map((row) => row.id).join(', ') : 'none'}
          </dd>
        </div>
      </dl>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground border-b text-left text-xs">
            <th className="py-2 font-medium">Sample</th>
            <th className="py-2 font-medium">Pair</th>
            <th className="py-2 font-medium">Used by</th>
            <th className="py-2 text-right font-medium">Ratio</th>
            <th className="py-2 text-right font-medium">AA</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLES.map((sample) => {
            const row = rows.find((entry) => entry.id === sample.id);
            const ratio = row?.ratio ?? 0;
            const passes = ratio >= AA_NORMAL;

            return (
              <tr key={sample.id} className="border-b">
                <td className="py-2 pr-4">
                  <div
                    data-sample={sample.id}
                    className={`w-56 rounded px-2 py-1 text-sm ${sample.className}`}
                  >
                    web-frontend-01
                  </div>
                </td>
                <td className="text-muted-foreground py-2 pr-4 font-mono text-xs">
                  {sample.label}
                </td>
                <td className="text-muted-foreground py-2 pr-4 text-xs">
                  {sample.usage}
                </td>
                <td className="py-2 text-right font-mono tabular-nums">
                  {row ? ratio.toFixed(2) : '—'}
                </td>
                <td className="py-2 text-right font-mono text-xs">
                  {row ? (passes ? 'pass' : 'FAIL') : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const meta = {
  title: 'Foundations/Contrast',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Asserts the measured failures are exactly the documented set. */
function guard(expected: readonly string[]) {
  return async ({
    canvas,
  }: {
    canvas: ReturnType<typeof import('storybook/test').within>;
  }) => {
    /*
     * Anti-vacuity. If the measurement broke — no stylesheet, no canvas — every
     * ratio would be 0, every pair would "fail", and comparing two derived
     * strings could still agree. A non-zero count plus at least one *passing*
     * pair proves the measurement is live before its result is trusted.
     */
    await expect(canvas.getByTestId('measured')).toHaveTextContent(
      String(SAMPLES.length),
    );
    await expect(canvas.getByTestId('failing')).not.toHaveTextContent(
      SAMPLES.map((sample) => sample.id).join(', '),
    );

    await expect(canvas.getByTestId('failing')).toHaveTextContent(
      expected.length ? expected.join(', ') : 'none',
    );
  };
}

/**
 * Light theme — every pair clears AA.
 *
 * Six did not, before. Two were `muted-foreground`, which carries every
 * description, hint and secondary table cell in the kit and so accounted for
 * 146 of the 169 violations axe reported on its own; its lightness moved
 * 0.5547 → 0.54. The other four were status colours used as *text*, fixed by
 * routing them through tokens meant for that rather than by restyling anything:
 * destructive text now uses `--error-foreground`, and the info and success
 * alerts use new `--info-soft` / `--success-soft` tokens beside the
 * `--warning-soft` that already existed.
 *
 * Note `muted-foreground` on `--card` never failed, even at the old value,
 * though a reading of the stylesheet would suggest it should have: `--card` is
 * a shade lighter than `--background`, so the same text cleared AA there at
 * 4.51. Measure the palette; do not reason about it.
 */
export const Light: Story = {
  globals: { theme: 'light' },
  render: () => <ContrastTable />,
  play: guard(KNOWN_FAILING_LIGHT),
};

/**
 * Dark theme, which the axe rule never checked — story-level a11y runs against
 * the default globals only, so every dark surface in the kit was unverified
 * until this story. It had one failure, `destructive-text` at 3.63:1, that
 * nothing would otherwise have caught.
 *
 * The dark alert variants passed even before the fix, because `alertVariants`
 * lightened info and success text with a hard-coded `dark:` override. Those
 * literals are now `--info-soft` / `--success-soft`, so the same values live in
 * the palette where a re-brand can reach them.
 */
export const Dark: Story = {
  globals: { theme: 'dark' },
  render: () => <ContrastTable />,
  play: guard(KNOWN_FAILING_DARK),
};
