# Coverage backlog

32 primitives ship in `src/components/ui`. Ten are covered:

- **Own story file (5)** — `alert`, `badge`, `button`, `card`, `table`
- **Covered inside `form-controls.stories.tsx` (5)** — `checkbox`, `input`,
  `label`, `switch`, `textarea`

Those five are grouped **on purpose**. They are meaningless in isolation and
only read as a form; splitting them into five files of one control each would
lose the composition and gain nothing. Leave them where they are — and extend
that file when one of them grows a variant.

That leaves **22 uncovered**, grouped below by the problem each poses rather
than alphabetically, because the hard part is shared within a group. Read
`story-patterns.md` for the matching skeleton before starting one.

---

## Overlays (8) — pattern 3

`alert-dialog` · `combobox` · `dialog` · `dropdown-menu` · `popover` ·
`select` · `sheet` · `tooltip`

Shared traps:

- **Portals to `document.body`.** The theme decorator handles this — it
  toggles `.dark` on `documentElement` too — but only for content that is
  actually mounted. Every one of these needs an open-by-default story or the
  surface is never reviewed in dark.
- **`side` is under-tested by default.** Popover, dropdown-menu, select and
  combobox all take `side` and carry four `data-[side=*]` slide-in variants
  plus a `origin-(--transform-origin)` transform origin. A story that only
  shows the default leaves three of four animation paths unexercised. One
  story rendering all four sides is worth more than four state stories.
- **`canvas` will not find the popup** in a play function. Use `screen`.

Per-component:

| Component       | Specific trap                                                                                                                                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tooltip`       | Needs `TooltipProvider`; its `delay` defaults to `0` here, unlike Base UI's default. Show hover _and_ keyboard focus.                                                                                                                               |
| `sheet`         | Has a side axis of its own (which edge it slides from) — cover all edges.                                                                                                                                                                           |
| `alert-dialog`  | Differs from `dialog` by being dismissal-resistant. The story should show the destructive confirmation it exists for.                                                                                                                               |
| `select`        | Overlaps `combobox` visually but is not filterable — the story should make the distinction obvious.                                                                                                                                                 |
| `combobox`      | Richest of the group: grouped options, hints, filtering. `form-combobox.test.tsx` has realistic props to lift — `csi-rbd`/`csi-cephfs`/`local-path`, `centos.stream9`/`windows.11`. Note the popup opens on a pointer _sequence_, not a bare click. |
| `dropdown-menu` | Has submenu and separator sub-parts most stories forget; also the widest keyboard surface.                                                                                                                                                          |

---

## Form layer (6) — pattern 4

`form` · `form-combobox` · `form-multi-combobox` · `input-group` ·
`radio-group` · `radio-circle`

All except `radio-circle` need a live `useForm` in scope, so the story body
must be a named function component.

**Known trap, verified — read before you debug.** The first story to import
`react-hook-form` fails its first `npm test` run with:

```
Failed to fetch dynamically imported module: .../sb-vitest/deps/...
[vitest] Vite unexpectedly reloaded a test.
```

The story is fine. Vite's dependency optimizer discovers `react-hook-form`
mid-run, re-optimizes, and reloads the page underneath the test. A second run
passes against the warm cache, which makes it look flaky rather than
configured. The durable fix is one line — add `'react-hook-form'` to the
`optimizeDeps.include` array in the storybook project of `vitest.config.ts`,
where `aria-query` and friends are already listed for exactly this reason.
Do it in the same change as the first form story, otherwise CI's cold cache
fails on a green local run.

| Component             | Specific trap                                                                                                                                                                                                                                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `form`                | The highest-value story in the whole backlog: `FormControl` wires `id`, `aria-describedby` and `aria-invalid` through a Base UI `render` prop, and nothing currently proves it. An invalid-state story is the a11y contract.                                                                                                 |
| `form-combobox`       | Already has `form-combobox.test.tsx` — mine it for realistic groups and options rather than inventing any.                                                                                                                                                                                                                   |
| `form-multi-combobox` | Passes `multiple` through to combobox and renders chips. Needs an overflow story: what happens at ten selections is the actual design question.                                                                                                                                                                              |
| `input-group`         | Its variants live in `data-align` attributes on _children_, not in props, and the styling is almost entirely `has-[]` selectors. A story must exercise every alignment (`inline-start`, `inline-end`, `block-start`, `block-end`) or that CSS is untested. Also composes `Textarea`, which changes the group's height rules. |
| `radio-group`         | Standard, but cover the keyboard arrow behaviour — it is the one control where that is the whole point.                                                                                                                                                                                                                      |
| `radio-circle`        | Purely presentational: a `checked` boolean, no role, no label, no input. Show it **inside** a labelled control. A story presenting it as a standalone radio would document an accessibility bug that does not exist.                                                                                                         |

---

## Layout and navigation (5)

`breadcrumb` · `collapsible` · `separator` · `sidebar` · `tabs`

| Component     | Specific trap                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sidebar`     | The largest component in the kit (~700 lines) and the highest-value story. It needs `SidebarProvider`; it persists state to a cookie; it branches on `useIsMobile`, rendering inside a `Sheet` below the breakpoint; and it composes Sheet, Tooltip, Skeleton, Separator, Input and Button. It also owns the entire `--sidebar-*` token scale, so **its story is the only proof those eight tokens work** — the token catalogue lists them but nothing renders them. Cover expanded, collapsed-to-icon, and mobile. Use pattern 2 plus an explicit viewport parameter for the mobile story. |
| `tabs`        | Has an `orientation` prop; the vertical path is entirely unexercised today. Cover both.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `separator`   | Also has `orientation`, plus a `decorative` prop that swaps the role to `none`. The semantic-vs-decorative distinction is the only reason this component is non-trivial — show both.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `collapsible` | Animated height. Show it open and closed; the closed state is what the animation has to reach.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `breadcrumb`  | Needs a truncation story — Kubernetes paths (`cluster / namespace / workload / pod`) overflow long before a generic three-crumb example would.                                                                                                                                                                                                                                                                                                                                                                                                                                              |

---

## Display and feedback (3)

`avatar` · `skeleton` · `sonner`

| Component  | Specific trap                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sonner`   | **Known Storybook gap.** `Toaster` reads `useTheme()` from `next-themes`, but the preview has no `ThemeProvider` — it toggles a class directly. So the theme resolves to `'system'` and the toaster will _not_ follow the toolbar. Either wrap the story in a provider driven by the toolbar global, or pass `theme` explicitly and document why. Do not leave it silently wrong. Also needs a mounted `<Toaster />` plus trigger buttons for each level. |
| `avatar`   | The fallback path is the interesting one and needs a deliberately unresolvable `src`. Also cover the group/stack layout if dashboards use it.                                                                                                                                                                                                                                                                                                             |
| `skeleton` | Trivial alone (`animate-pulse` on a rounded box) and near-worthless as a lone box. The story worth writing is skeleton **layouts** that match real content shapes — a loading table row, a loading card — so a reviewer can see whether the placeholder matches what replaces it.                                                                                                                                                                         |

---

## Suggested order

1. **`form`** — proves the a11y wiring nothing currently covers, and unblocks
   the other five form stories.
2. **`sidebar`** — largest surface, and the only thing that can prove the
   `--sidebar-*` token scale renders.
3. **`dialog`** — establishes the overlay pattern the other seven copy.
4. Everything else, cheapest first.
