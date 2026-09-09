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
import { ArrowRight, Check, TriangleAlert } from 'lucide-react';
import { useCallback, useRef, type ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ThemeProvider, useTheme, type ThemeOverrides } from '@/hooks/use-theme';

/**
 * A tenant palette supplied from outside the library. Every pair was measured
 * against WCAG AA before being written down — the axe run scans this story
 * like any other, so an inaccessible example would fail the build.
 */
const VIOLET_TENANT: ThemeOverrides = {
  light: {
    background: '#ffffff',
    foreground: '#1e1b2e',
    heading: '#5b21b6', //  8.98:1 on background
    primary: '#6d28d9', //  7.10:1 under white text
    'primary-foreground': '#ffffff',
    secondary: '#f5f3ff',
    'secondary-foreground': '#1e1b2e', // 15.30:1
    accent: '#ddd6fe',
    'accent-foreground': '#1e1b2e', // 12.09:1
    muted: '#f5f3ff',
    'muted-foreground': '#686f7d', //  4.60:1 on muted
    border: '#948faf', //  3.08:1 on background
    ring: '#6d28d9',
    destructive: '#9f1239', //  8.02:1 under white text
    'destructive-foreground': '#ffffff',
    radius: '1rem',
  },
  dark: {
    background: '#17132a',
    foreground: '#ffffff',
    heading: '#c4b5fd', //  9.78:1 on background
    primary: '#a78bfa', //  6.63:1 under dark text
    'primary-foreground': '#17132a',
    secondary: '#2a2342',
    'secondary-foreground': '#ffffff', // 14.81:1
    accent: '#a78bfa',
    'accent-foreground': '#17132a', //  6.63:1
    muted: '#2a2342',
    'muted-foreground': '#918cab', //  4.62:1 on muted
    border: '#66617f', //  3.08:1 on background
    ring: '#a78bfa',
    destructive: '#fda4af',
    'destructive-foreground': '#17132a', //  9.55:1
    radius: '1rem',
  },
};

/**
 * Scopes a palette to a subtree.
 *
 * The provider writes the overrides as inline custom properties on this
 * wrapper, and inherits its light/dark state from the surrounding provider so
 * the Storybook toolbar still drives both panels at once.
 */
function ThemeScope({ tokens, children }: { tokens?: ThemeOverrides; children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const getThemeRoot = useCallback(() => ref.current, []);

  return (
    <div ref={ref} className="h-full">
      <ThemeProvider
        key={resolvedTheme}
        defaultTheme={resolvedTheme}
        storageKey={null}
        getThemeRoot={getThemeRoot}
        tokens={tokens}
      >
        <div className="bg-background text-foreground h-full rounded-lg border p-5">{children}</div>
      </ThemeProvider>
    </div>
  );
}

/** One page of UI, rendered identically under whichever palette is in scope. */
function DemoPage({ label }: { label: string }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <Text variant="small" tone="muted" className="font-mono text-xs">
          {label}
        </Text>
        <Text variant="h2">Manage Kubernetes At Scale</Text>
        <Text variant="subline">One Control Plane, Every Cloud</Text>
      </div>

      <Text variant="body" tone="muted">
        Not one component below knows which palette it is in. They read semantic roles, and the
        roles are re-pointed above them.
      </Text>

      <div className="flex flex-wrap gap-2">
        <Button>
          Create Cluster
          <ArrowRight />
        </Button>
        <Button variant="outline">View Docs</Button>
        <Button variant="ghost">Cancel</Button>
      </div>

      <div className="bg-muted space-y-3 rounded-lg p-4">
        <div className="flex items-center justify-between gap-3">
          <Text variant="h3" as="h3">
            production-eu-01
          </Text>
          <Badge variant="accent">
            <Check />
            Running
          </Badge>
        </div>
        <Text variant="small" tone="muted">
          v1.31.2 · 6 nodes · Frankfurt
        </Text>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">openstack</Badge>
          <Badge variant="primary">Managed</Badge>
        </div>
      </div>

      <div className="border-destructive space-y-1 rounded-lg border p-4">
        <Text variant="subline" tone="destructive" className="text-base">
          <TriangleAlert className="mr-1 inline size-4" aria-hidden />
          Quota Exceeded
        </Text>
        <Text variant="small">The destructive role is re-pointed too.</Text>
      </div>
    </div>
  );
}

const meta = {
  title: 'Foundations/Custom Theme',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Components read **semantic roles**, never raw colours, and `@theme ' +
          'inline` compiles each utility straight to `var(--primary)` with no ' +
          'intermediate variable. So re-pointing a role on any ancestor ' +
          'restyles everything beneath it — which is the whole theming ' +
          'mechanism. Pass `tokens` to `ThemeProvider` to do that at runtime, ' +
          'or override the same properties in CSS to do it at build time.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Same markup, two palettes, side by side. Toggle the toolbar theme too. */
export const SideBySide: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          "import { ThemeProvider, type ThemeOverrides } from '@kubermatic/ui-kit';",
          '',
          'const tenant: ThemeOverrides = {',
          "  light: { primary: '#6d28d9', heading: '#5b21b6', radius: '1rem' },",
          "  dark: { primary: '#a78bfa', 'primary-foreground': '#17132a' },",
          '};',
          '',
          '<ThemeProvider tokens={tenant}>',
          '  <App />',
          '</ThemeProvider>',
        ].join('\n'),
      },
    },
  },
  render: () => (
    <div className="grid items-start gap-6 p-2 lg:grid-cols-2">
      <ThemeScope>
        <DemoPage label="default — Kubermatic brand tokens" />
      </ThemeScope>
      <ThemeScope tokens={VIOLET_TENANT}>
        <DemoPage label="tokens={VIOLET_TENANT} — supplied at runtime" />
      </ThemeScope>
    </div>
  ),
};

export const SideBySideDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: SideBySide.render,
};

/**
 * A partial override. Only `primary` and `radius` are supplied; every other
 * role falls through to the brand palette, so the Teal accent badge survives.
 */
export const PartialOverride: Story = {
  parameters: {
    docs: {
      source: {
        code: [
          '// Unspecified roles keep their brand values — this is a patch, not a replacement.',
          "<ThemeProvider tokens={{ light: { primary: '#b45309', radius: '0rem' } }}>",
          '  <App />',
          '</ThemeProvider>',
        ].join('\n'),
      },
    },
  },
  render: () => (
    <div className="grid items-start gap-6 p-2 lg:grid-cols-2">
      <ThemeScope>
        <DemoPage label="default" />
      </ThemeScope>
      <ThemeScope
        tokens={{
          // 5.02:1 under white text; `accent` is untouched, so Teal remains.
          light: { primary: '#b45309', ring: '#b45309', radius: '0rem' },
          dark: { primary: '#fdba74', 'primary-foreground': '#001128', radius: '0rem' },
        }}
      >
        <DemoPage label="only primary + radius overridden" />
      </ThemeScope>
    </div>
  ),
};
