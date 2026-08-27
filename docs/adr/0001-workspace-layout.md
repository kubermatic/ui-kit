# 1. One repo, three packages

Date: 2026-08-27

## Status

Accepted.

## Context

The kit shipped as a single package, `@kubermatic/ui-kit`, holding Tier 0 tokens
and Tier 1 primitives. Two more things need a home:

- **Tier 2**, the Kubernetes-shaped patterns — status badges, conditions tables,
  the DataTable family, the YAML editor. These are not primitives: they carry
  domain vocabulary and they pull heavy dependencies (TanStack Table, Monaco)
  that a consumer who only wants a `<Button>` should not have to download.
- **The toolchain and the version manifest.** Across the three products only
  6 of 28 shared-stack packages are pinned identically. React and Tailwind —
  the two most consequential — both drift, and `js-yaml` differs by a major.

The options were three repos, one repo with one package, or one repo with
several.

Three repos was rejected on cost: three Storybooks, three CI pipelines, three
release processes, and a cross-repo version dance every time a Tier 2 pattern
needs a Tier 1 primitive that does not exist yet — which, during the build-out,
is most changes.

One package was rejected because it forces every consumer to take Monaco. The
tiers have genuinely different dependency weights, and that is exactly what
package boundaries are for.

## Decision

One repo, three packages, one Storybook, one release pipeline.

```
packages/config/      → @kubermatic/config       toolchain + version manifest
packages/ui-kit/      → @kubermatic/ui-kit       Tier 0 tokens + Tier 1 primitives
packages/ui-patterns/ → @kubermatic/ui-patterns  Tier 2 Kubernetes patterns
.storybook/           → one catalogue over both component packages
docs/adr/             → this log
```

Packages version independently. `hack/ci/publish.sh` considers each on its own
and publishes only the ones whose version the registry has not seen, so a
patch to `config` does not force a `ui-kit` release.

Done now rather than later. The repo has 13 commits, has never been published
from this layout, and has no remote — the move costs one commit and a
`git mv`. The same move after three products depend on published artifacts
costs a coordinated migration. The published name and export paths do not
change, so nothing downstream can observe it.

## Consequences

- The workspace root is `private: true` and publishes nothing. `npm publish` at
  the root is an error rather than an accident waiting to happen.
- Every devDependency lives at the root. Packages declare only `dependencies`
  and `peerDependencies` — which is also what makes `kubermatic-config check`
  able to reason about a package's manifest without filtering out build tools.
- Storybook's story glob is `packages/*/src/**`, so adding `ui-patterns` does
  not require editing Storybook's config.
- The `@` path alias resolves into `ui-kit` only. `ui-patterns` uses relative
  imports; one alias cannot point at two packages, and giving the same prefix a
  second meaning per package is worse than typing `../`.
- Each package carries its own `tsconfig.json`. That is what lets ESLint's
  `projectService` resolve every file to a project without a solution file
  enumerating them.
