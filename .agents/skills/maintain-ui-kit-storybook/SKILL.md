---
name: maintain-ui-kit-storybook
description: Use when adding, extending or reviewing a Storybook story in @kubermatic/ui-kit — covers the title taxonomy, story file skeleton, Kubermatic domain data, design-token discipline, both-theme and a11y review, play-function guards, and the verification commands.
---

# Maintaining the ui-kit Storybook

Storybook is this package's workbench, not a demo site. A story is the only
place a primitive is seen against both token sets, and — through
`@storybook/addon-vitest` — it is also a browser test. Write it as both.

**Reference files** (read the one that matches the task, not all of them):

| File                          | When                                                                     |
| ----------------------------- | ------------------------------------------------------------------------ |
| `reference/story-patterns.md` | Writing a new story — four proven skeletons plus the two guards          |
| `reference/coverage-map.md`   | Where each primitive's coverage lives, the remaining gaps, and the traps |

---

## Before you write

1. **Read the component's `cva` config first.** Variants and sizes come from
   there, never from invention. A story that omits a variant hides it from
   every future token review.
2. **Decide whether it needs its own file.** `checkbox`, `input`, `label`,
   `switch` and `textarea` are deliberately covered together in
   `form-controls.stories.tsx` — they are meaningless alone and only read as a
   form. Splitting them out would be a regression, not progress. Ask whether
   the primitive tells a story by itself; if it only appears alongside others,
   extend the composite.
3. **Check `src/index.ts`.** If the primitive is not exported, a consuming app
   cannot use it and a story is premature.

## File and title taxonomy

Story files sit beside their component: `src/components/ui/<name>.stories.tsx`.
Docs-only pages are MDX and live at the `src/` root — currently just
`src/welcome.mdx`.

> **MDX and Prettier.** Do not put a `{/* … */}` JSX comment in an MDX file.
> Prettier formats MDX as markdown and escapes the asterisks to `{/\* … \*/}`,
> which stops being valid JS — the story then fails to index with
> `Could not parse expression with acorn`, and only `build-storybook` catches
> it. Put the explanation in prose instead.

| Title prefix   | Contents                                           | Example                     |
| -------------- | -------------------------------------------------- | --------------------------- |
| `Welcome/`     | Docs-only MDX pages — the front door               | `Welcome/Getting started`   |
| `Foundations/` | Token sets, scales, anything not a React component | `Foundations/Design Tokens` |
| `Primitives/`  | Components                                         | `Primitives/Button`         |

Sidebar order is pinned by `options.storySort` in `.storybook/preview.tsx`
(`Welcome`, `Foundations`, `Primitives`) — without it the sections sort
alphabetically and Storybook opens on the token catalogue instead of the
install instructions. A new top-level section has to be added to that array or
it sorts to the bottom.

Multi-word titles are **sentence case**, not title case:
`Primitives/Form controls`, not `Primitives/Form Controls`.

## The skeleton

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Thing } from './thing';

const VARIANTS = ['default', 'secondary'] as const;

const meta = {
  title: 'Primitives/Thing',
  component: Thing,
  parameters: { layout: 'centered' },
  argTypes: { variant: { control: 'select', options: VARIANTS } },
  args: { children: 'Create cluster' },
} satisfies Meta<typeof Thing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
```

Non-negotiables, each of which the existing files rely on:

- Types come from **`@storybook/react-vite`**, not `@storybook/react`.
- `satisfies Meta<typeof X>` on the meta, then `StoryObj<typeof meta>` — this
  is what makes `args` type-check against the component's props. Drop the
  generic (`satisfies Meta`) only for stories with no single root component,
  as `form-controls` and `tokens` do.
- Variant lists come from `variantKeys<T>({ … })` (`src/test/variant-matrix.ts`)
  and are reused by **both** `argTypes` and the render. Its parameter type is
  `Record<T, true>`, so a variant added to the `cva` config and not to the story
  fails `npm run typecheck` — an `as const` array cannot be checked that way, and
  `badge` had shipped `ghost` and `link` with no story rendering them. Pass the
  union explicitly; inference proves nothing. Where a story needs per-variant
  content rather than a bare list, `satisfies Record<T, …>` on that content gets
  the same guarantee — see `alert`.
- `Playground` is always the first export.

### Choosing `layout`

| Value        | Use for                                      | Precedent                   |
| ------------ | -------------------------------------------- | --------------------------- |
| `centered`   | Small primitives sized by their content      | button, card, badge         |
| `padded`     | Anything full-width — tables, alerts, forms  | table, alert, form-controls |
| `fullscreen` | Catalogues that manage their own page rhythm | tokens                      |

## The story set

Write these in order. Not every primitive needs all of them; every primitive
needs the first two.

1. **`Playground`** — driven by `argTypes`, so a reviewer can poke at it.
2. **`Variants`** — the complete matrix in one frame. This is the story a
   token change gets reviewed against, so a missing variant is a real gap.
3. **`Sizes`** — if the `cva` config has a size axis.
4. **States** — `Disabled`, `Empty`, `Loading`, `Invalid`: whichever the
   component actually models. `table` has `Empty` because an empty resource
   list is the state these dashboards spend the most time in.
5. **One realistic composition** — the primitive doing its real job, e.g.
   `card`'s VM detail panel or `badge`'s `ResourceStatus`.

## Domain data

Stories are read by people who work on Kubernetes dashboards. Generic filler
makes a component look plausible while hiding real problems — a name like
`Item 1` never reveals that the column is too narrow for
`batch-worker-07.cluster.local`.

Use the vocabulary already established across the existing stories and tests:

| Kind            | Use                                                               |
| --------------- | ----------------------------------------------------------------- |
| Workloads       | `web-frontend-01`, `db-primary`, `batch-worker-07`, `cache-redis` |
| Nodes           | `worker-01` … `worker-05`                                         |
| Namespaces      | `default`, `kube-system`                                          |
| Addresses       | `10.244.2.17` — pod-CIDR shaped, monospace                        |
| Storage classes | `csi-rbd`, `csi-cephfs`, `local-path`, `ceph-rbd`                 |
| Images          | `centos.stream9`, `windows.11`, `Ubuntu 24.04`                    |
| Statuses        | Running · Provisioning · Stopped · Failed · Unknown               |
| Errors          | Real ones: `Failed to attach data volume: quota exceeded`         |

Banned: `Lorem ipsum`, `Foo` / `Bar`, `example.com`, `John Doe`, `Item 1`.

## Design-token discipline

Stories use utility classes bound to tokens, never literal colours:

```tsx
<div className="bg-muted text-muted-foreground ring-border ring-1" />
```

No `#hex`, `rgb()` or `oklch()` literal may appear in a story — the sole
exception is a play-function assertion checking that a token _resolved_
(see `button`'s `CssCheck`).

If no token fits what you are building, that is a `theme.css` conversation,
not a story workaround. Adding one has a hard consequence: a token declared in
the `.dark` block but absent from the catalogue in `src/styles/tokens.stories.tsx`
makes the `Coverage` story **fail**. That is deliberate — it is the mechanism
that stops the token set from drifting away from its documentation. Add the
token to the right `COLOR_GROUPS` entry in the same change.

## Design review pass

Run this before calling a story done. Items 2 and 6 are now mostly automated —
the a11y addon runs axe over every story at `test: 'error'`, so a violation
fails `npm test` rather than sitting unread in a panel. What is left for a human
is the part axe cannot see.

1. **Both themes.** Toggle the toolbar. Portalled content (dialogs, dropdowns,
   tooltips) is covered because the decorator toggles `.dark` on
   `documentElement` as well as its own wrapper — but only if the content is
   actually open in the story. See the overlay note below.
2. **a11y is green.** Enforced, so this fails the build rather than the review.
   The usual cause is an icon-only control with no `aria-label` — `button`'s
   `WithIcon` story shows the pattern. Decorative icons inside a labelled
   control need nothing. Judgement still required on _which_ name is right: axe
   accepts "Remove", a user is better served by "Remove web-frontend-01".
3. **Variant matrix is complete** against the `cva` config — enforced by
   `variantKeys`, so this is a typecheck failure rather than a review comment.
   It only holds for axes the story actually routes through it: check that a
   second axis (`size` beside `variant`) is covered too.
4. **Spacing matches its siblings.** `gap-3` for button rows, `gap-2` for badge
   rows, `gap-4`/`flex-col` for stacked alerts. Consistency across stories is
   what makes a token change reviewable at a glance.
5. **Focus ring is visible** on every interactive state, in both themes. Tab
   through rather than trusting the screenshot.
6. **Contrast.** Enforced by axe like the rest, and the palette currently clears
   AA on every pair. Two things still need a human: axe only ever runs against
   the _default_ globals, so dark contrast is covered by
   `Foundations/Contrast` instead — add any new token pairing there. And the
   `-soft` tokens remain the trap: `--warning-soft`, `--info-soft`,
   `--success-soft` and `--error-foreground` are drawn as text on the page
   background rather than on their solid counterpart, so they carry their own
   contrast and are lightened in dark. A status colour used as _text_ wants one
   of those, never the solid token — `--destructive` as text misses AA in both
   themes.
7. **Docs prose earns its place.** The JSDoc above a story renders on its
   autodocs page. Write it only when there is a decision to explain — why
   `warning` uses `--warning-soft`, why icons are auto-sized. A comment
   restating the story name is noise.

## Play-function guards

Not every story needs one. Add a guard when a story can protect _wiring_ that
nothing else covers.

```tsx
import { expect } from 'storybook/test'; // NOT '@storybook/test'
```

`toBeVisible` is not a guard — it passes on completely unstyled output, so it
cannot detect a broken stylesheet. The two archetypes that do work, both with
working implementations in `reference/story-patterns.md`:

- **Resolution guard** — assert a computed value, not presence. `button`'s
  `CssCheck` asserts `getComputedStyle(...).backgroundColor` equals the
  resolved `--primary` oklch. If the Tailwind `@source` scan or the token
  import regresses, it fails. This is the automated form of the manual check
  that caught a 51 KB-vs-118 KB stylesheet during the extraction.
- **Inventory guard** — assert that two lists agree. `tokens`' `Coverage`
  diffs the stylesheet's `.dark` declarations against the catalogue, so an
  undocumented token becomes a test failure instead of a silent omission.
  Note how it also asserts the declared count is non-zero first: without that,
  a stylesheet that never loaded would make both real assertions pass
  vacuously. Any inventory guard needs the same anti-vacuity check.

## Overlays and portals

Base UI portals overlay content to `document.body`, outside the story canvas.
Three consequences:

- **Give the story an open state** (`defaultOpen`, or `open` on the root).
  A story showing only a closed trigger screenshots nothing and reviews
  nothing. It also hides context errors — a `DropdownMenuLabel` outside a
  group throws, but only once the popup mounts.
- **Query with `screen`, not `canvas`,** inside a play function — `canvas` is
  scoped to the story root, which the popup is not inside. `screen` and
  `within` are both re-exported from `storybook/test`.
- **Wrap visibility assertions in `waitFor`.** The popup mounts a frame before
  `data-open:animate-in` / `fade-in-0` has taken it off opacity 0, so a
  chained `toBeVisible` races the entry animation. `findByText` retries the
  _query_, not the assertion, so it does not help:

  ```tsx
  await waitFor(async () => {
    await expect(screen.getByText('…')).toBeVisible();
  });
  ```

## Verify

Run in this order; each catches something the next cannot.

```bash
npm run typecheck   # tsc across src, stories and configs — stories are type-checked
npm test            # jsdom unit tests + stories as browser tests (Playwright chromium)
npm run lint:fix    # ESLint autofix, then Prettier
```

`npm run storybook` for the visual pass — the automated run cannot tell you
whether the dark theme looks right.
