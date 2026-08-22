# Coverage map

Every primitive in `src/components/ui` has a story. This file records **where**
each one lives, the gaps that remain, and the traps the sweep turned up — the
things that cost time once and should not cost it twice.

---

## Where the coverage lives

32 primitives, 28 story files, plus three non-component entries:
`Welcome/Getting started` (`src/welcome.mdx`), `Foundations/Design Tokens` and
`Foundations/Contrast`.

- **Own story file (27)** — `alert-dialog`, `alert`, `avatar`, `badge`,
  `breadcrumb`, `button`, `card`, `collapsible`, `combobox`, `dialog`,
  `dropdown-menu`, `form-combobox`, `form-multi-combobox`, `form`,
  `input-group`, `popover`, `radio-circle`, `radio-group`, `select`,
  `separator`, `sheet`, `sidebar`, `skeleton`, `sonner`, `table`, `tabs`,
  `tooltip`
- **Covered inside `form-controls.stories.tsx` (5)** — `checkbox`, `input`,
  `label`, `switch`, `textarea`

Those five are grouped **on purpose**. They are meaningless in isolation and
only read as a form; splitting them into five files of one control each would
lose the composition and gain nothing. Leave them where they are — and extend
that file when one of them grows a variant.

Autodocs is on globally (`tags: ['autodocs']` in `.storybook/preview.tsx`), so
every meta also gets a generated Docs page — the JSDoc above each story is what
renders there. Opt a meta out with `tags: ['!autodocs']`.

## The load-bearing stories

Most stories document. These four are the ones that would let a real regression
through if deleted:

| Story                               | Guards                                                                                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button → CssCheck`                 | The Tailwind `@source` scan and the `theme.css` import, via a resolved `getComputedStyle` value                                                                                |
| `Design Tokens → Coverage`          | That the catalogue and the stylesheet's `.dark` block still agree, in both directions                                                                                          |
| `Sidebar → TokenScale`              | The eight `--sidebar-*` tokens. They are consumed by `sidebar.tsx` and nothing else, so this is their only proof                                                               |
| `Form → Invalid`                    | That `FormControl` forwards `id`, `aria-describedby` and `aria-invalid` onto the real input — invisible wiring that fails silently                                             |
| `Separator → DecorativeVsSemantic`  | The `role="none"` / `role="separator"` split, which is the only non-trivial thing the component does                                                                           |
| `Contrast → Light` / `→ Dark`       | Every token pair's WCAG ratio, in both themes. Replaces the one axe rule that is switched off, with a measurement that cannot silently grow                                    |
| `Sidebar → Mobile`                  | That the sub-768px branch really is the one rendering — it asserts the desktop panel is absent before opening the mobile Sheet                                                 |
| `Avatar → Loaded`                   | That the fallback _unmounts_ when the image resolves. A failed load looks almost identical, so asserting presence alone passes either way                                      |
| `variantKeys` (every variant story) | That the rendered matrix still matches the `cva` config. Not a story but a type: `Record<T, true>` fails typecheck when a variant is added to a component and not to its story |

---

## Known gaps

Honest list. None of these are hard blockers; all of them are things a reader
might otherwise assume are covered.

| Gap                           | Why                                                                                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No visual regression baseline | `@chromatic-com/storybook` is installed but no project is wired up, so a purely visual regression (spacing, alignment) is caught only by a human at review time. |

### Contrast

The palette clears WCAG AA on every pair the kit renders, in both themes, and
`color-contrast` is enforced by axe on every story. `Foundations/Contrast`
measures the same 20 pairs and asserts none of them fail — it is not redundant
with the axe rule, because story-level a11y only ever runs against the default
globals, so axe never sees the dark theme.

It took four changes to get there, three of which were token-level rather than
cosmetic:

| Fix                                       | Why                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--muted-foreground` 0.5547 → 0.54        | One token, **146 of the 169** violations. Carries every description, hint and secondary table cell, and missed on `--background` (4.47) and `--muted` (4.34). Hue and chroma untouched.                                                                                                                                                                                                              |
| Destructive _text_ → `--error-foreground` | `--destructive` is a **fill** — tuned to carry white on top of it. As text on the page it measured 4.47 light and 3.63 dark. `--error-foreground` is the token for that job (9.37 / 9.86) and the error Alert already used it. Applied to `outlineDestructive`, `ghostDestructive`, the destructive menu item, `FormLabel` in error and `FormMessage`. Borders and hover fills keep `--destructive`. |
| Added `--info-soft`, `--success-soft`     | `--warning-soft` already existed for "status colour used as text on the page". Info and success had no equivalent, so `alert.tsx` hard-coded `dark:text-[oklch(0.75_0.16_255)]` and its success twin — literals in a component, invisible to a re-brand. The new tokens hold those exact dark values and a darker light value.                                                                       |
| `--warning-soft` 0.55 → 0.52              | Missed at 4.10 on its own 10% tint.                                                                                                                                                                                                                                                                                                                                                                  |

One exemption remains, scoped to `Input group → States`: a disabled group dims
its addon to 50% opacity, which WCAG 1.4.3 exempts as an inactive control but
axe cannot recognise, because the group is marked with `data-disabled` rather
than a `disabled` attribute.

Two things worth knowing before touching the palette again:

- **`muted-foreground` / `card` never failed**, even at the old value, though a
  reading of the stylesheet would suggest it should have: `--card` is a shade
  lighter than `--background`, so the same text cleared AA there at 4.51.
  Measure; do not infer.
- **Approximating a component's classes gives false results.** An early version
  of the audit wrote `text-info bg-info/10` by hand instead of calling
  `alertVariants({ variant: 'info' })`, and reported two dark failures that did
  not exist — it had missed the `dark:` override. The audit calls the real `cva`
  for exactly this reason.

------------------------------ | ----- | ----- | ------------------------------------------------- |
| `destructive` / `background` | 4.47 | fails | outlineDestructive, ghostDestructive, FormMessage |
| `info` / `info@10%` | 3.37 | pass | Alert variant info |
| `success` / `success@10%` | 4.18 | pass | Alert variant success |
| `warning-soft` / `warning@10%` | 4.10 | pass | Alert variant warning |

All four are status colours: the hue is doing semantic work, so darkening one to
reach AA is a brand decision rather than a mechanical fix. `info` at 3.37 is the
only one that is not marginal.

#### Fixed: `muted-foreground`

This token was the whole problem. It carries every description, hint and
secondary table cell in the kit, and at `oklch(0.5547 …)` it measured 4.47:1 on
`--background` and 4.34:1 on `--muted` — so one token accounted for **146 of the
169** contrast violations axe reported. Dropping its lightness to `0.54`, hue and
chroma untouched, clears all three surfaces it renders on (4.74 / 4.60 / 4.78)
and is imperceptible as a design change. Re-enabling the axe rule now reports 23.

Two things worth knowing before touching the rest:

- **`muted-foreground` / `card` never failed**, even at the old value, though a
  reading of the stylesheet would suggest it should have: `--card` is a shade
  lighter than `--background`, so the same text cleared AA there at 4.51.
  Measure; do not infer.
- **Dark comes out better than light**, because `alertVariants` lightens its
  info and success text with a `dark:` override. An audit that approximated the
  alert classes instead of calling the real `cva` reported two dark failures
  that do not exist.

--------------------------------- | ----- | ----- | ------------------------------------------------- |
| `muted-foreground` / `background` | 4.47 | pass | Descriptions, hints, secondary table cells |
| `muted-foreground` / `muted` | 4.34 | pass | Chips, wells |
| `destructive` / `background` | 4.47 | fails | outlineDestructive, ghostDestructive, FormMessage |
| `info` / `info@10%` | 3.37 | pass | Alert variant info |
| `success` / `success@10%` | 4.18 | pass | Alert variant success |
| `warning-soft` / `warning@10%` | 4.10 | pass | Alert variant warning |

Two things worth knowing before acting on this:

- **`muted-foreground` / `card` passes at 4.51** while the same text on
  `background` fails at 4.47 — `--card` is a shade lighter. Reasoning about the
  palette would have got that wrong in both directions, which is why the audit
  measures rather than infers.
- **Dark comes out better than light**, because `alertVariants` lightens its
  info and success text with a `dark:` override. An audit that approximated the
  alert classes instead of calling the real `cva` reported two dark failures
  that do not exist.

---

## Traps

Each of these cost a debugging cycle. They are not obvious from the component
source.

### `DropdownMenuLabel` throws outside a group

It maps to Base UI's `Menu.GroupLabel`, which requires `Menu.Group` or
`Menu.RadioGroup` context — it labels a group, it is not a free-standing
heading. Wrap it in `DropdownMenuGroup`, or place it inside
`DropdownMenuRadioGroup`, which supplies the context itself.

A menu that starts closed hides this completely: the popup never mounts, so the
story passes and the error only reaches a user who clicks the trigger. Any
menu story carrying a label needs an open-by-default variant.

### `toBeVisible` races the entry animation

Overlay popups mount a frame before `data-open:animate-in` / `fade-in-0` has
moved them off opacity 0. `findByText` retries until the element exists, then
the chained `toBeVisible` runs once — against an element that is present and
still transparent.

Wrap the assertion, not the query:

```tsx
await waitFor(async () => {
  await expect(screen.getByText('…')).toBeVisible();
});
```

This bites hardest where the popup opens in response to an interaction
(`Tooltip → KeyboardFocus`), and is merely latent where it opens on mount — a
`defaultOpen` story usually wins the race by accident, which makes it a flake
waiting to happen rather than a passing test.

### Controlled components cannot satisfy `Meta<typeof X>`

`FormCombobox` and `FormMultiCombobox` require `value` and `onValueChange`. With
`component` named in the meta, Storybook infers args from it and type-checks
every story for a complete `args` object — which no story can supply, because
each one has to own the state in a wrapper component.

Drop **both** the generic and `component`:

```tsx
const meta = {
  title: 'Primitives/Form combobox',
  parameters: { layout: 'padded' },
} satisfies Meta;
```

Dropping only the generic is not enough; `component` alone re-introduces the
inference. The cost is the autodocs props table, which is why this is reserved
for genuinely controlled components rather than used as a shortcut.

### `react-hook-form` needs pre-declaring in `optimizeDeps`

Already fixed in `vitest.config.ts`, documented here so it is not undone.

It is imported only by story files, so Vite's optimizer discovers it mid-run,
re-optimizes, and reloads the page underneath the test — `Failed to fetch
dynamically imported module`, exactly once, on a cold cache. A second run passes
against the warm cache, which makes it look flaky rather than configured. The
same will happen to the next dependency that only stories import.

### Accessible names are the kit's most common defect

Enabling `a11y.test: 'error'` surfaced five missing accessible names, all in
shipped components rather than in stories, and all invisible on screen:

| Component             | Defect                                                                                                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `combobox`            | The trigger chevron, the clear X, and each chip's remove X were icon-only buttons with no name                                                                                   |
| `form-multi-combobox` | The chips input is named by its placeholder, which is hidden as soon as a chip exists — so it was anonymous in its normal state                                                  |
| `popover`             | `PopoverTitle`/`PopoverDescription` were a plain `div` and `p`. Base UI wires the popup's `aria-labelledby` to its _own_ `Title` part, so the `role="dialog"` had no name at all |

The popover one is the pattern to watch for: re-implementing a Base UI part as a
styled element looks identical and silently drops the ARIA wiring that part
existed to provide. Prefer the primitive; style it.

### `SelectSeparator` inside a listbox is invalid ARIA

A `role="listbox"` may contain only options and groups, so a `role="separator"`
child fails `aria-required-children` and invalidates the whole listbox.
`SelectLabel` already separates groups visually. The component is fine in
menus — it is the combination that is wrong.

### One `<main>` per document

`SidebarInset` renders a `<main>` and the shell renders a breadcrumb `<nav>`, so
a story rendering two app shells side by side trips
`landmark-no-duplicate-main` and `landmark-unique`. Split the variants into one
story each rather than exempting the rule; the rule is right.

### An exhaustiveness check cannot be an unused const

The obvious way to prove a variant list is complete is a throwaway binding:

```ts
type Missing = Exclude<Variant, (typeof VARIANTS)[number]>;
const _exhaustive: [Missing] extends [never] ? true : Missing = true;
```

It works — and `tsconfig.json` sets `noUnusedLocals`, which rejects it with
TS6133 before the interesting error is ever reached. Unused _type aliases_ are
flagged the same way, so hiding the check in a type does not help either.

The guard therefore has to be something the story genuinely consumes.
`variantKeys<T>({ … })` returns the array that `argTypes` and the render both
read, and gets its completeness from the parameter type `Record<T, true>`.

### Base UI warns when a `render` target is not a real button

`DropdownMenuTrigger` defaults to `nativeButton`, so
`render={<SomePresentationalSpan />}` strips button semantics. It is a console
warning, not a failure, so it passes CI silently — worth grepping the test
output for `Base UI:` after adding overlay stories.

Put the presentational element _inside_ the trigger instead, and name the
trigger with `aria-label` if the child is `aria-hidden` (as `BreadcrumbEllipsis`
is — its sr-only "More" cannot name anything).

---

## Extending

Read `story-patterns.md` for the matching skeleton before starting. When adding
a primitive to `src/components/ui`:

1. Give it a story file beside it, unless it is meaningless alone — in which
   case extend `form-controls.stories.tsx` rather than creating a file of one.
2. If it introduces a token, add it to `COLOR_GROUPS` in
   `src/styles/tokens.stories.tsx` in the same change, or
   `Design Tokens → Coverage` fails.
3. If it is the sole consumer of a token scale, give it a resolution guard the
   way `Sidebar → TokenScale` does. Nothing else will prove those tokens render.
