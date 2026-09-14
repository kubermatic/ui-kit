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
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';

import { Text } from '@/components/ui/text';
import { auditThemeContrast, formatRatio, type ContrastReport } from '@/lib/contrast';
import { AA_TEXT, BRAND_ROLES, type BrandRole } from '@/styles/tokens';

/*
 * Nothing on this page is written down twice.
 *
 * The roles come from `tokens.ts`, the values are read back off the DOM, and
 * the ratios are computed from those values by the same function the unit
 * tests use. An earlier version of this story listed the hexes and the ratios
 * as literals, which meant the catalogue could disagree with the stylesheet
 * and look completely convincing while doing it.
 */

/** Read a set of custom properties as the browser has computed them. */
function useComputedTokens(ref: RefObject<HTMLElement | null>, names: readonly string[]) {
  const [values, setValues] = useState<Record<string, string>>({});

  useLayoutEffect(() => {
    if (!ref.current) return;
    const styles = getComputedStyle(ref.current);
    setValues(
      Object.fromEntries(names.map((name) => [name, styles.getPropertyValue(`--${name}`).trim()])),
    );
    // `names` is a module-level constant in both call sites.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return values;
}

function Swatch({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-lg border">{children}</div>;
}

function Caption({ title, detail }: { title: string; detail?: ReactNode }) {
  return (
    <div className="bg-background space-y-0.5 px-3 py-2">
      <Text variant="small" weight="bold">
        {title}
      </Text>
      {detail}
    </div>
  );
}

const BRAND_NAMES = Object.keys(BRAND_ROLES) as BrandRole[];

/** The three colours the `Text` component deliberately offers no tone for. */
const HIGHLIGHTS = ['brand-teal', 'brand-rose', 'brand-honey'] as const;

const meta = {
  title: 'Foundations/Colors',
  parameters: {
    docs: {
      description: {
        component:
          'The brand palette is exposed as `--brand-*` reference tokens, and ' +
          'separately as semantic roles that components actually use. The ' +
          'indirection matters: it lets a role carry an accessibility-corrected ' +
          'value while `--brand-*` stays exactly as the marketing document ' +
          'specifies. Every value and ratio below is read from the live ' +
          'stylesheet, so this page cannot disagree with `theme.css`.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The marketing palette, verbatim, with its documented role. */
export const BrandPalette: Story = {
  render: function BrandPaletteStory() {
    const ref = useRef<HTMLDivElement>(null);
    const values = useComputedTokens(ref, BRAND_NAMES);

    return (
      <div ref={ref} className="space-y-4">
        <Text variant="h2">Brand Palette</Text>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BRAND_NAMES.map((name) => (
            <Swatch key={name}>
              <div className="h-20" style={{ backgroundColor: `var(--${name})` }} />
              <Caption
                title={name}
                detail={
                  <>
                    <Text variant="small" tone="muted" className="font-mono text-xs">
                      {(values[name] ?? '').toUpperCase()}
                    </Text>
                    <Text variant="small" tone="muted">
                      {BRAND_ROLES[name]}
                    </Text>
                  </>
                }
              />
            </Swatch>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Every pair in the contract, measured against the palette that is actually
 * applied. Text pairs are shown carrying text; the 3:1 pairs are shown as the
 * graphics they are, because rendering a 3.09:1 border colour *as text* would
 * be a genuine violation — and axe would rightly fail this story for it.
 */
export const SemanticPairs: Story = {
  render: function SemanticPairsStory() {
    const ref = useRef<HTMLDivElement>(null);
    const [report, setReport] = useState<ContrastReport | null>(null);

    useLayoutEffect(() => {
      if (ref.current) setReport(auditThemeContrast(ref.current));
    }, []);

    return (
      <div ref={ref} className="space-y-4">
        <Text variant="h2">Semantic Pairs</Text>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {report?.measured.map(({ pair, ratio, passes }) => {
            const isText = pair.minimumRatio >= AA_TEXT;
            const key = `${pair.foreground}-on-${pair.surface}`;

            return (
              <Swatch key={key}>
                <div
                  className="flex h-20 items-center justify-center"
                  style={{
                    backgroundColor: `var(--${pair.surface})`,
                    color: `var(--${pair.foreground})`,
                  }}
                >
                  {isText ? (
                    <span className="font-sans text-sm font-bold">Aa</span>
                  ) : (
                    <span
                      aria-hidden
                      className="h-10 w-24 rounded-md border-2"
                      style={{ borderColor: `var(--${pair.foreground})` }}
                    />
                  )}
                </div>
                <Caption
                  title={key}
                  detail={
                    <>
                      <Text
                        variant="small"
                        tone={passes ? 'muted' : 'destructive'}
                        className="font-mono text-xs"
                      >
                        {formatRatio(ratio)} · needs {pair.minimumRatio}:1
                        {passes ? '' : ' · FAILS'}
                      </Text>
                      <Text variant="small" tone="muted">
                        {pair.because}
                      </Text>
                    </>
                  }
                />
              </Swatch>
            );
          })}
        </div>
      </div>
    );
  },
};

/**
 * Why the highlight trio is never text on a light background. Both columns
 * hold the same three colours; only the left one is legible.
 */
export const WhyHighlightsAreSurfaces: Story = {
  render: function WhyHighlightsAreSurfacesStory() {
    const ref = useRef<HTMLDivElement>(null);
    const values = useComputedTokens(ref, HIGHLIGHTS);

    return (
      <div ref={ref} className="space-y-4">
        <Text variant="h2">Highlights Are Surfaces</Text>
        <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Text variant="subline">As a surface</Text>
            <div className="bg-accent text-accent-foreground rounded-md px-3 py-2">
              <Text variant="small" as="span" weight="bold">
                Teal
              </Text>
            </div>
            <div className="bg-highlight-rose text-highlight-rose-foreground rounded-md px-3 py-2">
              <Text variant="small" as="span" weight="bold">
                Rosé
              </Text>
            </div>
            <div className="bg-highlight-honey text-highlight-honey-foreground rounded-md px-3 py-2">
              <Text variant="small" as="span" weight="bold">
                Honey
              </Text>
            </div>
          </div>
          <div className="space-y-2">
            <Text variant="subline">As text on white</Text>
            <Text variant="small" tone="muted">
              Each measures below the 4.5:1 minimum against white, which is why no
              <code className="font-mono"> tone </code>
              exposes them. Shown here as swatches rather than coloured text so this story does not
              itself ship a violation.
            </Text>
            <div className="flex gap-2">
              {HIGHLIGHTS.map((name) => (
                <div
                  key={name}
                  className="size-10 rounded-md border"
                  style={{ backgroundColor: `var(--${name})` }}
                  title={values[name]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * The same pairs under the dark palette. Present as a separate story because
 * the a11y run renders each story once, at whatever the `theme` global says —
 * without this, the dark tokens would never be scanned.
 */
export const SemanticPairsDark: Story = {
  globals: { theme: 'dark' },
  // Exists for axe coverage of the dark palette, not for the docs page.
  tags: ['!autodocs'],
  render: SemanticPairs.render,
};
