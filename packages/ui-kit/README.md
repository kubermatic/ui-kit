# @kubermatic/ui-kit

React primitives, design tokens and theming for Kubermatic products. Built on
[Base UI](https://base-ui.com) with shadcn-style styling, and shipped with a
brand palette measured against WCAG 2.2 AA.

**📖 The catalogue** — every component and token, with live examples — is not
hosted yet. Clone [kubermatic/ui-kit](https://github.com/kubermatic/ui-kit) and
run `npm run storybook`.

## Install

```bash
npm install @kubermatic/ui-kit
```

Published to npm, so nothing to configure beyond the install.

Peers: `react` and `react-dom` (^19), `tailwindcss` (^4.3).

## Wiring

Two imports, in this order:

```css
@import 'tailwindcss';
@import '@kubermatic/ui-kit/theme.css';
```

`theme.css` carries the tokens **and** an `@source` directive pointing Tailwind
at this package's compiled components. Tailwind skips `node_modules` otherwise
and everything renders unstyled, so do not strip it. If your setup resolves the
package unusually, add the scan path yourself:

```css
@source '../node_modules/@kubermatic/ui-kit/dist';
```

To also let the kit own your `body` background, text colour and typeface:

```css
@import '@kubermatic/ui-kit/preflight.css';
```

## Use

```tsx
import { Badge, Button, Text, ThemeProvider } from '@kubermatic/ui-kit';

<ThemeProvider defaultTheme="system">
  <Text variant="h1">Manage Kubernetes At Scale</Text>
  <Button>Create Cluster</Button>
  <Badge variant="accent">Running</Badge>
</ThemeProvider>;
```

Every component and hook module carries `'use client'` and the build preserves
modules rather than bundling, so you can import from a Server Component and the
parts needing a client boundary declare their own. `themeScript`, `cn` and the
contrast helpers have no directive and run anywhere.

### Server rendering

`ThemeProvider` can only apply the theme class in an effect, so a
server-rendered page paints light and then corrects itself. Inline the shipped
script in `<head>`, above your stylesheets:

```tsx
import { themeScript } from '@kubermatic/ui-kit';

<head>
  <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
</head>;
```

## Theming

Components reference semantic roles (`--primary`, `--heading`, `--accent`),
never raw colours, and `@theme inline` compiles each utility straight to
`var(--primary)` — so re-pointing a role on any ancestor restyles everything
beneath it. Override in CSS for a fixed palette, or pass `tokens` for a runtime
one:

```tsx
<ThemeProvider tokens={{ light: { primary: '#6d28d9' } }}>
```

A custom palette leaves the verified set: the built-in tokens are measured
against AA on every CI run, yours are not. The same check is exported, and
reads the roles as computed custom properties, so it measures the palette
actually applied:

```tsx
import { auditThemeContrast } from '@kubermatic/ui-kit';

expect(auditThemeContrast(document.documentElement).failures).toEqual([]);
```

Full documentation is in the catalogue under **Guides** — Installation,
Theming and Accessibility.

## Licence

Apache-2.0
