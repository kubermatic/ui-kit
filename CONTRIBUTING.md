# Contributing

## Getting set up

```bash
nvm use                           # Node 24, which is the floor
npm install
npx playwright install chromium   # for the accessibility suite
npm run storybook                 # http://localhost:6006
```

`engines` says `>=24` and CI runs 24, so `.nvmrc` is the version everything is
actually tested on. Older Node will not install.

## Before you open a PR

```bash
npm run verify
```

That is lint → typecheck → tests (unit + accessibility) → build → package and
consumer checks. CI runs the same stages through `./hack/ci/verify.sh`, which
is the single `pre-ui-kit-verify` presubmit and additionally builds the
catalogue; run that script directly to reproduce a CI failure exactly.
`npm run lint:fix` fixes most style complaints, including stamping licence
headers.

The slowest part is the browser suite. While iterating, `npm test` (unit only)
and `npm run test:a11y` are separate commands for that reason.

## Getting your PR merged

CI is [Prow](https://docs.prow.k8s.io/), not GitHub Actions, and merging works
differently to a normal GitHub repository:

- **Sign your commits off.** `git commit -s` writes the `Signed-off-by` line
  the DCO check wants; `git rebase --signoff main` fixes a branch that is
  missing it.
- **A green PR is not a merged PR.** Someone in [`OWNERS`](./OWNERS) has to
  comment `/lgtm` and `/approve`. Tide merges it when the labels are on and the
  presubmits are green — there is no merge button to press.
- Other comment commands worth knowing: `/retest` re-runs the failed jobs,
  `/hold` blocks the merge until you `/hold cancel`, `/wip` marks it not ready.
- Job logs, coverage and the built catalogue are in Prow, linked from the
  checks on the PR.

## Changesets

**Any change that affects a published package needs a changeset.** Releases are
automated from them, so a PR without one ships nothing.

```bash
npm run changeset
```

Pick the packages you touched, pick a bump, and describe the change **for
someone upgrading** — not for someone reading the diff. Say what they have to
do differently, and why. A changelog entry that reads "fix button" is worth
nothing to the person whose build just broke.

Skip it only for changes that cannot reach a consumer: CI config, tests,
Storybook-only edits, README wording.

### Choosing a bump

- **patch** — a fix that does not change the API or the rendered output.
- **minor** — a new component, prop, or variant. **Also a token value change**:
  the palette is part of the contract, and someone's screenshot tests will
  notice.
- **major** — a removed or renamed export, a changed default, a prop whose type
  narrowed.

Merging to `main` opens a "Version Packages" PR; merging _that_ publishes.

## Adding a component

Base UI first. If it has the primitive, style that rather than reimplementing
its keyboard and focus behaviour — the accessible name and ARIA wiring are the
part that is easy to get subtly wrong.

1. `packages/ui-kit/src/components/ui/<name>.tsx`. Start with `'use client'`;
   the lint rule will tell you if you forget.
   **Import siblings relatively, with an explicit `.js`** —
   `'../../lib/utils.js'`, not `'@/lib/utils'`. TypeScript does not rewrite the
   alias on emit, so it survives into the published `.d.ts` and consumers get
   `TS2307`. Lint is what rejects it, and nothing re-checks the emitted
   declarations afterwards. `@/` is fine in stories and tests.
2. Variants via `cva`, exported alongside the component. Merge the incoming
   `className` through `cn` so consumers can always override.
3. `data-slot="<name>"` on the rendered element.
4. **Semantic roles only.** `bg-primary`, never `bg-[#0081AE]` — the
   `no-color-literals` rule enforces this, because a hardcoded colour escapes
   both theming and the measured contrast guarantees.
5. `<name>.stories.tsx`. Use `variantKeys<T>` for any variant list so the
   matrix cannot silently go stale, and add a
   `globals: { theme: 'dark' }` counterpart — the a11y run renders each story
   once, at one theme.
6. `<name>.test.tsx` for behaviour styling cannot show.
7. Export it from `packages/ui-kit/src/index.ts`, with an explicit `.js`
   extension on the relative path.

### If it needs a new colour

That is the bigger half of the change, and three files have to agree or the
build fails:

1. `theme.css` — a value in **both** `:root` and `.dark`.
2. `tokens.ts` — the role name and what it is for.
3. `tokens.ts` again — every pair it takes part in, in `CONTRAST_PAIRS`, with
   4.5 if it can carry text and 3 if it is only a graphic.

`theme.test.ts` checks all three against each other and computes the ratios, so
you do not need a contrast checker open — but you do need to declare the pairs.
A pair nobody declares is a pair nobody measures.

## Dependency updates

Dependabot runs weekly. `.npmrc` sets `save-exact=true`, so nothing moves
without a PR.

Two things to know when reviewing one:

- **A bump to either package's `dependencies` needs a changeset**, because it
  reaches consumers. Dependabot cannot write one, so add it to the PR. The
  `published-runtime` group exists to make these obvious — it covers
  `@base-ui/react`, `clsx`, `class-variance-authority` and `tailwind-merge`.
  Bumps to `devDependencies` need nothing.

- **Dependabot PRs may arrive with an out-of-sync lockfile.** It has a known
  bug with npm lockfile v3 plus workspaces: the workspace `package.json` is
  updated but the root `package-lock.json` is not. CI catches this in its first
  step with an explicit message; the fix is `npm install` locally, then commit
  the lockfile.

Dependabot also applies a **cooldown**: 5 days for minors and patches, 14 for
majors. It is not about stability — `save-exact` already gives us that — it is
about not installing a release during the window in which a compromised publish
is typically discovered and pulled. Security updates ignore the cooldown.

Some majors are pinned shut in `.github/dependabot.yml` with the peer range
that blocks them — currently TypeScript (typescript-eslint caps at `<6.1.0`)
and Vitest (`@storybook/addon-vitest` caps at `^4`). Each is worth re-checking
when the blocker releases; the reason is recorded next to the `ignore` entry
rather than left to be rediscovered.

## Things that will bite you

- **`toBeVisible` is not a guard.** It passes on completely unstyled output. To
  prove styling resolved, assert on a computed value:
  `expect(getComputedStyle(el).backgroundColor).toBe('rgb(0, 125, 170)')`.
- **The a11y suite needs a real browser.** `target-size` and `color-contrast`
  need layout geometry, so they are skipped silently under jsdom — a green
  jsdom run proves nothing about either.
- **Changing a token means updating its comment.** `theme.test.ts` recomputes
  every pair for you, in both palettes — but it also checks the ratio written
  beside each value, so a colour edited without its annotation fails. Run
  `npm test` and it will tell you the number to write.
- **Opacity tints are not tokens.** `bg-destructive/10` composites to a colour
  outside the token set, and its contrast is not the token's contrast.
- **The `@/` alias does not survive the build.** It typechecks here and fails
  in every consumer. Relative specifiers with `.js` in anything under
  `packages/*/src` that is not a story or a test.
- **`storySort` must be an inline literal.** Storybook parses `preview.tsx`
  statically to find it, so a reference to a `const` declared above fails the
  build with an unhelpful "unsupported".
- **MDX is CommonMark plus whatever `main.ts` adds.** Tables, strikethrough and
  task lists need `remark-gfm`, which is wired into the `@storybook/addon-docs`
  options. Without it a pipe table renders as a paragraph of literal pipes —
  the build succeeds and says nothing, so it is only caught by looking at the
  page.
