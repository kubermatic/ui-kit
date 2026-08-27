# 2. The dependency contract

Date: 2026-08-27

## Status

Accepted. Applied to `@kubermatic/ui-kit`'s own manifest in Phase 2.

## Context

Across KubeV, KubeLB and KDP, only 6 of 28 shared-stack packages are pinned
identically. `react` is `19.2.7` / `^19.2.7` / `19.2.4`. `tailwindcss` is
`4.3.1` / `^4.3.2` / `^4.2.1`. `monaco-editor` splits 0.52 against 0.55,
`lucide-react` spans three majors, and `js-yaml` differs by a major version.

The tempting fix — "publish a package that pins everything" — does not work,
and fails differently depending on the dependency. Treating the stack as one
uniform problem produces a solution that is harmful for one third of it.

## Decision

Three categories, because they behave differently.

### A — Singletons: centralise the version, never the copy

`react`, `react-dom`, `react-hook-form`, `next-themes`, `@tanstack/react-query`,
`@tanstack/react-router`, `zustand`.

These carry React context or hook identity. Two copies in one app is an
invalid-hook-call, or a form that cannot see its own provider. **Bundling them
into a package is actively harmful** — the one place where "vendor it centrally"
is the wrong answer. They stay `peerDependencies` everywhere.

What is centralised is the version, via `@kubermatic/config/versions.json`,
applied by each product as `overrides`.

The limitation has to be stated plainly rather than designed around: **npm and
pnpm cannot inherit `overrides` from a dependency.** A published package cannot
transitively pin its consumers' React. So the manifest is copied into each
product's `package.json`, and `kubermatic-config check` — plus a CI job that
runs it — is what keeps the copy honest. Anything claiming to pin singletons
transitively from a published package is either wrong or is quietly shipping a
second copy of React.

### B — Owned outright: direct dependencies, products never install them

`@base-ui/react`, `@tanstack/react-table`, `@tanstack/react-virtual`,
`monaco-editor`, `@monaco-editor/react`, `monaco-yaml`,
`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `js-yaml`.

No cross-boundary identity requirement: table instances are created per call,
Monaco is a global the wrapper owns. So they become direct dependencies of
`ui-kit` / `ui-patterns`, products get them transitively, and nobody pins them
again. This is where the real consolidation happens — it closes the
`monaco-editor` 0.52-vs-0.55 split, the three `lucide-react` majors and the
`js-yaml` major split in one move.

`@base-ui/react` is the important one. Moving it from peer to direct dependency
means the engine choice stops being something a product can get wrong.

"Products never install them" is only enforceable if products never _need_ to.
So the packages re-export the surface consumers require — `ColumnDef`,
`flexRender`, `createColumnHelper`, `SortingState` from `ui-patterns`; the icon
set from `ui-kit` — and `@kubermatic/config/eslint` bans the direct import.
Between the two, a product has no reason and no permission to add its own copy.

### C — Build-time toolchain: shareable configs

`tailwindcss`, `typescript`, `vite`, `vitest`, `eslint`, `prettier`.

Never runtime imports, so they cannot be vendored through a runtime package.
`@kubermatic/config` ships them as configs plus pinned versions.

## Version selection

Every version in the manifest is one this repo installs and its CI verifies.
A version that cannot be grounded that way goes in `pending` and makes `check`
report an unresolved decision rather than silently bless a guess.

This is why `typescript` is pinned at `5.9.3` and not `6.0.3`. The products
split `~5.9.3` against `~6.0.3`, and the manifest could assert either — but 6.x
is a major with real breakage, and picking it here would be a migration
disguised as a config edit. `@tanstack/react-query`, `@tanstack/react-router`
and `zustand` are `pending` for the same reason: they drift, but nothing in
this repo installs them, so there is no verified version to point at.

## Consequences

- `kubermatic-config check` infers a repo's role: a package declaring a
  singleton as a peer is a library, everything else is a product. The checks
  differ — a library must not take React as a direct dependency; a product must
  carry the overrides.
- `--fix` writes the mechanical drift and deliberately refuses to delete
  `components.json` or `src/components/ui/`. Removing a directory of components
  someone still imports is not a fix, it is an outage.
- Renovate is configured _not_ to bump singletons or owned packages. Their
  versions come from the manifest; a Renovate PR moving them would be reverted
  by the next CI run. The manifest is the thing to bump.
- The check currently fails against `@kubermatic/ui-kit` itself, reporting
  `@base-ui/react` and `lucide-react` as peers that should be direct
  dependencies. That is Phase 2's work, and the failure is the specification
  for it. `check:deps` joins `hack/ci/verify.sh` once it passes.
