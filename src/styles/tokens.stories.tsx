import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

/*
 * Catalogue for the token set in `theme.css`.
 *
 * Values are read back with `getComputedStyle` rather than duplicated from the
 * stylesheet, so what renders here is what the browser actually resolved —
 * including any override a consuming app layers on top of `:root`. The
 * `Coverage` story closes the loop in the other direction and fails when a
 * token is added to `theme.css` without being catalogued here.
 */

interface TokenGroup {
  readonly title: string;
  readonly description: string;
  readonly tokens: readonly string[];
}

const COLOR_GROUPS = [
  {
    title: 'Surface',
    description: 'Page, card and popover backgrounds with their text colours.',
    tokens: [
      'background',
      'foreground',
      'body',
      'card',
      'card-foreground',
      'popover',
      'popover-foreground',
    ],
  },
  {
    title: 'Brand',
    description: 'Primary and secondary actions.',
    tokens: [
      'primary',
      'primary-foreground',
      'secondary',
      'secondary-foreground',
    ],
  },
  {
    title: 'Neutral',
    description: 'Low-emphasis surfaces — hover states, disabled text, wells.',
    tokens: ['muted', 'muted-foreground', 'accent', 'accent-foreground'],
  },
  {
    title: 'Status',
    description:
      'The `-soft` variants are drawn as text on the page background rather than on their solid counterpart, so they carry their own contrast and are lightened in dark.',
    tokens: [
      'destructive',
      'destructive-foreground',
      'success',
      'success-foreground',
      'success-soft',
      'warning',
      'warning-foreground',
      'warning-soft',
      'info',
      'info-foreground',
      'info-soft',
      'error-foreground',
    ],
  },
  {
    title: 'Form and focus',
    description: 'Borders, input chrome and the focus ring.',
    tokens: ['border', 'input', 'ring'],
  },
  {
    title: 'Sidebar',
    description:
      'The sidebar carries its own scale so it can diverge from the page surface without re-theming every primitive.',
    tokens: [
      'sidebar',
      'sidebar-foreground',
      'sidebar-primary',
      'sidebar-primary-foreground',
      'sidebar-accent',
      'sidebar-accent-foreground',
      'sidebar-border',
      'sidebar-ring',
    ],
  },
  {
    title: 'Chart',
    description: 'Categorical series colours, ordered for adjacent contrast.',
    tokens: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'],
  },
] as const satisfies readonly TokenGroup[];

/** Every themeable colour token, in catalogue order. */
const COLOR_TOKENS: readonly string[] = COLOR_GROUPS.flatMap(
  (group) => group.tokens,
);

/*
 * The radius scale lives in `@theme inline`, which substitutes the values
 * straight into the utilities instead of emitting `--radius-*` custom
 * properties. Reading the property back would return nothing, so each step is
 * measured from an element carrying the real utility class.
 */
const RADIUS_STEPS = [
  'rounded-sm',
  'rounded-md',
  'rounded-lg',
  'rounded-xl',
  'rounded-2xl',
  'rounded-3xl',
  'rounded-4xl',
] as const;

/** Read on its own so the derived steps can be shown against their source. */
const BASE_RADIUS_TOKEN = ['radius'] as const;

const LAYOUT_TOKENS = ['header-height', 'footer-height'] as const;

/**
 * Resolves custom properties against a real element in the story tree.
 *
 * Reading from the element rather than `documentElement` keeps the values
 * correct for the nested `.dark` wrapper the preview decorator renders, and the
 * observer re-reads them when the theme toolbar toggles the class.
 */
function useResolvedTokens(names: readonly string[]) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [values, setValues] = React.useState<Record<string, string>>({});

  /*
   * Keyed on the contents rather than the array identity. A caller passing an
   * inline literal would otherwise re-run the effect on every render, and the
   * `setValues` inside it makes that an infinite loop.
   */
  const key = names.join(',');

  React.useEffect(() => {
    const tokens = key.split(',');

    const read = () => {
      const element = ref.current;
      if (!element) {
        return;
      }

      const styles = getComputedStyle(element);
      setValues(
        Object.fromEntries(
          tokens.map((name) => [
            name,
            styles.getPropertyValue(`--${name}`).trim(),
          ]),
        ),
      );
    };

    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [key]);

  return [ref, values] as const;
}

/** The `-foreground` counterpart a token pairs with, when one exists. */
function pairedForeground(name: string): string | null {
  if (name.endsWith('-foreground')) {
    return null;
  }

  const candidate = name === 'background' ? 'foreground' : `${name}-foreground`;
  return COLOR_TOKENS.includes(candidate) ? candidate : null;
}

function ColorSwatch({ name, value }: { name: string; value: string }) {
  const foreground = pairedForeground(name);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="ring-border flex size-12 shrink-0 items-center justify-center rounded-md ring-1"
        style={{ background: `var(--${name})` }}
      >
        {foreground && (
          <span
            className="text-sm font-medium"
            style={{ color: `var(--${foreground})` }}
          >
            Aa
          </span>
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate font-mono text-xs">--{name}</div>
        <div className="text-muted-foreground truncate font-mono text-xs">
          {value || '—'}
        </div>
      </div>
    </div>
  );
}

function ColorGroup({ group }: { group: TokenGroup }) {
  const [ref, values] = useResolvedTokens(group.tokens);

  return (
    <section ref={ref} className="space-y-3">
      <header>
        <h3 className="text-sm font-semibold">{group.title}</h3>
        <p className="text-muted-foreground text-xs">{group.description}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.tokens.map((token) => (
          <ColorSwatch key={token} name={token} value={values[token] ?? ''} />
        ))}
      </div>
    </section>
  );
}

function RadiusSample({ utility }: { utility: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = React.useState('');

  React.useEffect(() => {
    if (ref.current) {
      setResolved(getComputedStyle(ref.current).borderRadius);
    }
  }, []);

  return (
    <div className="space-y-2">
      <div
        ref={ref}
        className={`bg-muted ring-border size-20 ring-1 ${utility}`}
      />
      <div className="font-mono text-xs">.{utility}</div>
      <div
        data-testid={utility}
        className="text-muted-foreground font-mono text-xs"
      >
        {resolved || '—'}
      </div>
    </div>
  );
}

const meta = {
  title: 'Foundations/Design Tokens',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Flip the theme toolbar to see both token sets — the values below are read
 * live, so they change with it.
 */
export const Colors: Story = {
  render: () => (
    <div className="space-y-10">
      {COLOR_GROUPS.map((group) => (
        <ColorGroup key={group.title} group={group} />
      ))}
    </div>
  ),
};

/**
 * Every step is derived from the single `--radius` token, so re-branding the
 * corner rounding is a one-line override.
 */
export const Radius: Story = {
  render: function RadiusScale() {
    const [ref, values] = useResolvedTokens(BASE_RADIUS_TOKEN);

    return (
      <div ref={ref} className="space-y-6">
        <p className="text-muted-foreground text-xs">
          Base <code className="font-mono">--radius</code> is{' '}
          <code className="font-mono">{values.radius || '\u2014'}</code>. Every
          step below is a <code className="font-mono">calc()</code> against it,
          so re-branding the corner rounding is a one-line override.
        </p>
        <div className="flex flex-wrap gap-6">
          {RADIUS_STEPS.map((step) => (
            <RadiusSample key={step} utility={step} />
          ))}
        </div>
      </div>
    );
  },
  play: async ({ canvas }) => {
    // Guards the measurement itself: if the utility stopped resolving, every
    // sample would quietly render an em dash instead of a length.
    await expect(canvas.getByTestId('rounded-sm')).toHaveTextContent('px');
  },
};

/** Fixed chrome heights the app shell and `--height-content` are built from. */
export const Layout: Story = {
  render: function LayoutTokens() {
    const [ref, values] = useResolvedTokens(LAYOUT_TOKENS);

    return (
      <div ref={ref} className="space-y-4">
        {LAYOUT_TOKENS.map((token) => (
          <div key={token} className="space-y-1">
            <div className="font-mono text-xs">
              --{token}{' '}
              <span className="text-muted-foreground">
                {values[token] || '—'}
              </span>
            </div>
            <div
              className="bg-muted ring-border w-full max-w-md rounded-md ring-1"
              style={{ height: `var(--${token})` }}
            />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Lists the themeable tokens `theme.css` declares in its `.dark` block against
 * the catalogue above.
 *
 * `.dark` is the kit's own override block — Tailwind never emits that selector —
 * so it is an unambiguous inventory of what is themeable. Without this check a
 * token added to `theme.css` would simply never appear on this page, and the
 * omission would be invisible. The assertion turns that into a test failure.
 */
export const Coverage: Story = {
  render: function CoverageReport() {
    const declared = React.useMemo(declaredThemeTokens, []);
    const catalogued = new Set<string>(COLOR_TOKENS);

    const missing = declared.filter((token) => !catalogued.has(token));
    const stale = COLOR_TOKENS.filter((token) => !declared.includes(token));

    return (
      <dl className="space-y-4 text-sm">
        <div>
          <dt className="text-muted-foreground text-xs">Declared in .dark</dt>
          <dd data-testid="declared-count" className="font-mono">
            {declared.length}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">
            Declared but not catalogued
          </dt>
          <dd data-testid="missing" className="font-mono">
            {missing.length ? missing.join(', ') : 'none'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">
            Catalogued but no longer declared
          </dt>
          <dd data-testid="stale" className="font-mono">
            {stale.length ? stale.join(', ') : 'none'}
          </dd>
        </div>
      </dl>
    );
  },
  play: async ({ canvas }) => {
    // A zero here would mean the stylesheet never loaded, which would make the
    // two assertions below pass vacuously.
    await expect(canvas.getByTestId('declared-count')).not.toHaveTextContent(
      '0',
    );
    await expect(canvas.getByTestId('missing')).toHaveTextContent('none');
    await expect(canvas.getByTestId('stale')).toHaveTextContent('none');
  },
};

/** Token names declared in the stylesheet's `.dark` rule. */
function declaredThemeTokens(): string[] {
  const found = new Set<string>();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // Cross-origin stylesheet; nothing of ours lives there.
    }

    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule) || rule.selectorText !== '.dark') {
        continue;
      }

      for (const property of Array.from(rule.style)) {
        if (property.startsWith('--')) {
          found.add(property.slice(2));
        }
      }
    }
  }

  return Array.from(found).sort();
}
