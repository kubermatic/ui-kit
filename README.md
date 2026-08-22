# @kubermatic/ui-kit

Shared React component primitives and design tokens for Kubermatic dashboards.

32 primitives (button, dialog, table, form controls, sidebar, …) built on
Base UI and Tailwind 4, plus the OKLch light/dark token set they render
against. Storybook is the workbench.

---

## Requirements

React 19, Tailwind CSS 4. Angular apps (`dashboard-v2`) cannot consume this.

## Install

```bash
npm install @kubermatic/ui-kit
```

The package is published to GitHub Packages, so consuming repos need an
`.npmrc` line pointing the scope at that registry:

```
@kubermatic:registry=https://npm.pkg.github.com
```

### Peer dependencies

Everything that owns React state or context is a **peer** dependency, not a
bundled one — a second copy of `react`, `react-hook-form` or `sonner` silently
breaks context across the boundary (a `toast()` in the app would never reach a
`<Toaster />` from the kit).

`react` · `react-dom` · `react-hook-form` · `@base-ui/react` ·
`lucide-react` · `sonner` · `next-themes` (optional) · `tailwindcss`

Only `clsx`, `class-variance-authority` and `tailwind-merge` are bundled.

## Wiring it up

Two steps. Both are load-bearing — skipping either produces an app that builds
and then renders unstyled.

### 1. CSS

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';

/* Tailwind ignores node_modules when scanning for classes. Without this the
   kit's utilities are purged: in kubevirt-manager the stylesheet dropped from
   118 KB to 51 KB and the components rendered unstyled. */
@source '../node_modules/@kubermatic/ui-kit/dist';

@import '@kubermatic/ui-kit/theme.css';
```

Adjust the `@source` path so it resolves from the CSS file's own location.

Re-brand by redefining any custom property _after_ the `theme.css` import — no
need to fork the components.

### 2. Import

```tsx
import { Button, Badge, Table } from '@kubermatic/ui-kit';
```

The build emits one module per component with `preserveModules`, so unused
primitives tree-shake away.

## Local development against a consuming app

```bash
npm install file:../ui-kit
```

A linked checkout resolves the kit's _own_ `node_modules` copies of React and
friends, which produces `Cannot read properties of null (reading 'useContext')`
at runtime. Dedupe in both `vite.config.ts` and `vitest.config.ts`:

```ts
resolve: {
  dedupe: [
    'react', 'react-dom', 'react-hook-form',
    '@base-ui/react', 'lucide-react', 'sonner', 'next-themes',
  ],
}
```

Keep this list in sync with `peerDependencies`. It is harmless once the package
is installed from the registry, where npm hoists a single copy.

## Storybook

```bash
npm run storybook        # dev server on :6006
npm run build-storybook  # static build
```

Start at **Welcome → Getting started**, the docs front door. Below it,
**Foundations** holds the token catalogue and the contrast audit, and
**Primitives** has one entry per component — all 32 are covered.

Every story is also a test. Under `npm test` each one renders in Playwright
Chromium and is run through axe at `test: 'error'`, so an accessibility
regression fails CI rather than sitting unread in a panel. The palette clears
WCAG AA on every pair it renders, in both themes.

Story-level a11y only ever runs against the default globals, so axe never sees
the dark theme — **Foundations → Contrast** measures all 20 pairs in both and
asserts none fail. Autodocs is on, so each component also has a generated Docs
page with a props table.

The toolbar theme switch toggles a `.dark` class on the wrapper — the same
mechanism consuming apps use, so both token sets get exercised. Section order
is pinned by `options.storySort` in `.storybook/preview.tsx`.

Storybook merges the root `vite.config.ts`, which is a _library_ build. The
lib-mode config and `vite-plugin-dts` are stripped in `.storybook/main.ts`
(dts alone was over half the build time) and Tailwind is added back there.

Conventions for writing and reviewing stories — title taxonomy, the four story
skeletons, token discipline, the design-review checklist — live in
[`.agents/skills/maintain-ui-kit-storybook/`](.agents/skills/maintain-ui-kit-storybook/SKILL.md),
alongside a [coverage map](.agents/skills/maintain-ui-kit-storybook/reference/coverage-map.md)
recording where each primitive's coverage lives, the gaps that remain, and the
traps worth not rediscovering. Coding agents load it automatically; it reads as
plain documentation otherwise.

## Scripts

| Script              | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `npm run build`     | Typecheck, then emit `dist/` with `.d.ts`      |
| `npm run typecheck` | `tsc --noEmit` across src, stories and configs |
| `npm test`          | Vitest unit tests                              |
| `npm run storybook` | Storybook dev server                           |
| `npm run lint:fix`  | ESLint autofix, then Prettier                  |

## Known constraints

- **`min-release-age`** — `kubermatic-virtualization` pins `min-release-age=7`
  in `.npmrc` as supply-chain hardening. A freshly published version will be
  refused for seven days. Plan releases ahead of the consuming app's needs, or
  have that repo waive the setting for the `@kubermatic` scope.
- **`kubelb-dashboard` has diverged.** It carries its own copies of 19 of these
  primitives, and `button`, `badge`, `dialog`, `card` and `table` differ on
  essentially every line. The token names already agree, so reconciliation is
  tractable — but it is a design decision, not a mechanical merge, and needs
  that team's sign-off before they adopt the kit.
- **`kdp-dashboard` is Next 16.** Components are unmarked client components;
  consuming them from a server component needs a `"use client"` boundary.
