# Kubermatic UI Kit

A React component library and Storybook catalogue, shared across Kubermatic
products and published to npm. It carries the brand palette and
type hierarchy over a semantic token layer, and a component set sized to
rebuild the consuming product dashboards on one library: primitives, forms,
data display, overlays, an application frame and two page templates.

**The catalogue is the documentation.** This file is only a map of the
repository — read it at [ui-kit-kubermatic.netlify.app](https://ui-kit-kubermatic.netlify.app/),
or run `npm run storybook`, and start with the **Guides** section.

## Quick start

```bash
npm install
npm run storybook     # http://localhost:6006
```

## Layout

A monorepo on plain npm workspaces — no pnpm, Turborepo or Nx. Two packages,
because they have different consumers:

```
packages/ui-kit/         → @kubermatic/ui-kit         tokens, theming, components
packages/eslint-config/  → @kubermatic/eslint-config  shared ESLint flat config
.storybook/              → one catalogue over every package
hack/ci/                 → what Prow runs
.prow/                   → the presubmit definition
```

`@kubermatic/eslint-config` is separate so a product that only wants the lint
rules does not pull React, Tailwind and Base UI along with them. The story glob
is `packages/*/src/**`, so adding a third package needs no Storybook change.

The workspace root is `private: true` and publishes nothing. All devDependencies
live at the root; the packages declare only what they genuinely ship.

## Commands

| Command                   | What it does                                     |
| ------------------------- | ------------------------------------------------ |
| `npm run storybook`       | Storybook dev server on :6006                    |
| `npm run build-storybook` | Static Storybook into `storybook-static/`        |
| `npm run build`           | Bundle each package into `dist/` with `.d.ts`    |
| `npm run typecheck`       | `tsc --noEmit` over sources, stories and configs |
| `npm test`                | Vitest + Testing Library (jsdom)                 |
| `npm run lint`            | ESLint, then a Prettier format check             |
| `npm run lint:fix`        | ESLint `--fix`, then Prettier `--write`          |
| `npm run test:coverage`   | Unit tests with the coverage ratchet enforced    |
| `npm run test:a11y`       | Every story, in Chromium, scanned by axe         |
| `npm run check:dist`      | Build, then `publint` and `attw`                 |
| `npm run verify`          | Everything above, i.e. what CI runs              |

## Stack

TypeScript (strict, pinned to 5.9 — `typescript-eslint` does not yet support
TypeScript 7), [Base UI](https://base-ui.com) for behaviour and accessibility
with shadcn-style styling written into our own source, Tailwind CSS v4
configured in CSS, TanStack Table for `DataTable`, lucide-react for icons, Vite
for the library build, Vitest for tests and Storybook 10 for the catalogue.

## Where to read on

Most of what used to be in this file now lives next to the thing it describes.

| Topic                                          | Where                                                                         |
| ---------------------------------------------- | ----------------------------------------------------------------------------- |
| Installation, theming, accessibility, tokens   | The catalogue, **Guides** (`.storybook/docs/*.mdx`)                           |
| Every component, with live examples            | The catalogue                                                                 |
| Consuming either package                       | [`packages/*/README.md`](./packages)                                          |
| Adding a component, review process, changesets | [CONTRIBUTING.md](./CONTRIBUTING.md)                                          |
| What CI runs, and why it is one job            | [`hack/ci/verify.sh`](./hack/ci/verify.sh)                                    |
| How releases and versioning work               | [`hack/ci/release.sh`](./hack/ci/release.sh)                                  |
| How the catalogue is published                 | [`netlify.toml`](./netlify.toml)                                              |
| Weekly dependency audit                        | [`hack/ci/audit.sh`](./hack/ci/audit.sh)                                      |
| Job definitions                                | [`.prow/`](./.prow), and `kubermatic/infra` for anything holding a credential |
| Reporting a vulnerability                      | [SECURITY.md](./SECURITY.md)                                                  |

The `hack/ci/*.sh` scripts carry their rationale in their header comments, as
does `eslint.config.js` for the lint rules that are not obvious.

## Licence

Apache-2.0. Every source file carries the header; `packages/*/LICENSE` ships in
both tarballs.
