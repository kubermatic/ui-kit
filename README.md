# Kubermatic UI Kit

The design system behind the Kubermatic dashboards: design tokens, React
component primitives, and the toolchain the frontend stack agrees on.

32 primitives (button, dialog, table, form controls, sidebar, …) built on
Base UI and Tailwind 4, plus the OKLch light/dark token set they render
against. Storybook is the workbench.

## Repository layout

A workspace. One Storybook, one decision log, one release pipeline; packages
version independently.

| Package              | Tier                       | Contents                                                                                      |
| -------------------- | -------------------------- | --------------------------------------------------------------------------------------------- |
| `@kubermatic/ui-kit` | 0 — tokens, 1 — primitives | `theme.css` and the 32 primitives                                                             |
| `@kubermatic/config` | toolchain                  | Tailwind preset, tsconfig bases, ESLint, Prettier, Vitest, Renovate, and the version manifest |

```
packages/config/     packages/ui-kit/     .storybook/     docs/adr/
```

Design decisions and their reasoning live in [`docs/adr/`](docs/adr/).

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

## `@kubermatic/config` — the toolchain and the dependency contract

Across the three products only 6 of 28 shared-stack packages are pinned
identically. `react` and `tailwindcss` both drift; `js-yaml` differs by a major.
This package is where that stops.

| Export                              | Purpose                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `@kubermatic/config/tailwind`       | Tailwind v4 preset — the four-import setup as one line                                                      |
| `@kubermatic/config/tsconfig`       | tsconfig base                                                                                               |
| `@kubermatic/config/tsconfig-react` | tsconfig base plus the JSX transform                                                                        |
| `@kubermatic/config/eslint`         | flat config — bans engine imports, local `components/ui/` copies, colour literals; requires licence headers |
| `@kubermatic/config/prettier`       | one format                                                                                                  |
| `@kubermatic/config/vitest`         | base test settings                                                                                          |
| `@kubermatic/config/renovate`       | Renovate preset                                                                                             |
| `@kubermatic/config/versions.json`  | the version manifest                                                                                        |

Consume the ESLint config as `product` (the default export, strict) or
`library` — ui-kit and ui-patterns are the packages allowed to import the
engine directly:

```js
import product from '@kubermatic/config/eslint'; // products
import { library } from '@kubermatic/config/eslint'; // ui-kit, ui-patterns
```

### Applying the contract

```bash
npx kubermatic-config check        # report drift, exit 1 if any
npx kubermatic-config check --fix  # write the manifest in, then report
```

**npm and pnpm cannot inherit `overrides` from a dependency.** A published
package cannot transitively pin its consumers' React, so the manifest has to be
written into each product's `package.json` and a CI check is what keeps the copy
honest. That is the honest mechanism; anything promising transitive singleton
pinning from a package is either wrong or is shipping a second copy of React.

`--fix` applies the mechanical drift. It deliberately will not delete
`components.json` or `src/components/ui/` — removing a directory of components
someone still imports is not a fix, it is an outage.

The three categories and why they differ are in
[ADR 2](docs/adr/0002-dependency-contract.md).

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

Storybook resolves its Vite config from the repo root, where there is none —
the only `vite.config.ts` lives in `packages/ui-kit` and is a _library_ build.
So `.storybook/main.ts` supplies the two things that config used to provide:
Tailwind, and the `@` alias the components import `@/lib/utils` through. The
`vite-plugin-dts` strip is kept there as a guard, since dts alone was over half
the build time.

Conventions for writing and reviewing stories — title taxonomy, the four story
skeletons, token discipline, the design-review checklist — live in
[`.agents/skills/maintain-ui-kit-storybook/`](.agents/skills/maintain-ui-kit-storybook/SKILL.md),
alongside a [coverage map](.agents/skills/maintain-ui-kit-storybook/reference/coverage-map.md)
recording where each primitive's coverage lives, the gaps that remain, and the
traps worth not rediscovering. Coding agents load it automatically; it reads as
plain documentation otherwise.

## Scripts

Run from the repo root; the build and typecheck fan out across workspaces.

| Script                  | Purpose                                                  |
| ----------------------- | -------------------------------------------------------- |
| `npm run build`         | Typecheck, then emit each package's `dist/` with `.d.ts` |
| `npm run typecheck`     | `tsc --noEmit` across every package, story and config    |
| `npm test`              | Unit tests, plus every story as a browser + axe test     |
| `npm run test:coverage` | `npm test` with a V8 coverage report                     |
| `npm run storybook`     | Storybook dev server                                     |
| `npm run lint:fix`      | ESLint autofix, then Prettier                            |
| `npm run check:deps`    | Enforce the dependency contract (see below)              |

## CI

Prow runs three presubmits on every pull request, defined in `.prow.yaml` and
implemented as scripts under `hack/ci/` so they can be run locally unchanged:

| Job                 | Script              | Covers                                     |
| ------------------- | ------------------- | ------------------------------------------ |
| `pre-ui-kit-verify` | `hack/ci/verify.sh` | `typecheck` and `lint`                     |
| `pre-ui-kit-test`   | `hack/ci/test.sh`   | Unit tests and every story, in Chromium    |
| `pre-ui-kit-build`  | `hack/ci/build.sh`  | The library build and the static Storybook |

`test.sh` installs Chromium explicitly: `.npmrc` sets `ignore-scripts=true`, so
Playwright's postinstall never runs and the browser is not downloaded by
`npm ci`.

Publishing is written (`hack/ci/publish.sh`) but the postsubmit is left
commented out in `.prow.yaml` until infra provisions a GitHub Packages token. No
other Kubermatic repository publishes an npm package, so no preset for one
exists yet.

The script is idempotent and workspace-aware: it enumerates the publishable
workspaces, and publishes each only when the registry has not seen its version.
That is what lets `config` ship a patch without forcing a `ui-kit` release, and
it is why the postsubmit is safe to run on every merge rather than only on
tagged releases.

That script also builds explicitly rather than relying on `prepublishOnly`:
`ignore-scripts=true` suppresses the package's own lifecycle scripts too, so a
`prepublishOnly` guard would silently never run here.

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
