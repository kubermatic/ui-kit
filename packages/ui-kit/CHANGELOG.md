# @kubermatic/ui-kit

## 0.4.0

### Minor Changes

- [#19](https://github.com/kubermatic/ui-kit/pull/19) [`e41197a`](https://github.com/kubermatic/ui-kit/commit/e41197a113b411ca57fd07f63db95aa4581ade94) Thanks [@mstruebing](https://github.com/mstruebing)! - Split `primary` and `destructive` into a surface role and a text tone, and
  re-tune both for the dark palette.
  
  On a dark page the two jobs pull in opposite directions. As text on
  `background`, a hue wants to be **light** — the lighter it goes, the better it
  reads. As a surface carrying its own label, it wants to be **dark** — the
  lighter it goes, the worse that label reads. One value had to sit where those
  demands crossed, which is how `--primary` ended up at `#1287B4` with Dark Azure
  text: 4.64:1 in both directions. Both cleared AA, and the button still looked
  wrong, because 4.64:1 is the floor rather than a margin — a near-black label on
  a saturated mid-tone reads as a mistake.
  
  Each role now goes where it wanted to be. In the dark palette the surface
  darkens to the light theme's corrected Cerulean and carries white text, and the
  tone keeps the lightened value it was always good at:
  
  | role                       | light                          | dark                       |
  | -------------------------- | ------------------------------ | -------------------------- |
  | `--primary`                | `#007DAA`                      | `#1287B4` → **`#007DAA`**  |
  | `--primary-foreground`     | `#FFFFFF`                      | Dark Azure → **`#FFFFFF`** |
  | `--primary-tone`           | _new_, follows `--primary`     | _new_, `#1287B4`           |
  | `--destructive`            | Maroon                         | `#C85D55` → **`#C05046`**  |
  | `--destructive-foreground` | `#FFFFFF`                      | Dark Azure → **`#FFFFFF`** |
  | `--destructive-tone`       | _new_, follows `--destructive` | _new_, `#C85D55`           |
  
  Dark-mode button labels go from 4.64:1 to 4.65:1 (primary) and 4.69:1
  (destructive) — now on white, which is the readable direction — while the
  surfaces keep 4.06:1 and 4.03:1 against the page, well clear of the 3:1 that
  SC 1.4.11 asks of a control. Text tones are unchanged at 4.64:1. The light
  palette is untouched: it has no tension between the two jobs, so each tone
  simply follows its surface.
  
  `CONTRAST_PAIRS` gained the two surfaces at the 3:1 graphic threshold, which is
  what now stops `--primary` being darkened indefinitely to buy its label more
  contrast.
  
  **No change is needed in consuming apps.** Components were repointed
  internally: `Text tone="primary|destructive"`, `Button variant="link"`, the
  active tab, `Alert`/`Toast` tone borders and icons, outline `StatusBadge`,
  destructive menu items, `Field` errors and the required-field asterisk, and
  invalid form-control borders all resolve to the new tones.
  
  **If you reference the roles directly**, `text-primary` and `text-destructive`
  still work but now name the _surface_, which is darker on dark. Anything drawn
  on `background` — link text, an icon, a hairline — should move to
  `text-primary-tone` / `text-destructive-tone`. Filled usages (`bg-primary`,
  `bg-destructive` with their `-foreground`) are unchanged. Custom palettes
  passed to `ThemeProvider` should define the two new roles; without them those
  utilities resolve to nothing.

## 0.3.0

### Minor Changes

- [#15](https://github.com/kubermatic/ui-kit/pull/15) [`1b3a739`](https://github.com/kubermatic/ui-kit/commit/1b3a739da7bc8f2c221ee938ebb6b22d9f8b665d) Thanks [@mstruebing](https://github.com/mstruebing)! - `TableRow` is now inert unless you pass `interactive`, and `DataTable` only
  marks rows interactive when `onRowClick` is set.
  
  Previously every row highlighted on hover — header rows, skeleton rows, the
  empty-state row, and the rows of read-only tables alike. A cue that appears on
  everything tells the user nothing, so a read-only table and a navigable one
  were indistinguishable until you clicked one and found out.
  
  **If a table of yours loses its hover highlight, that table had no `onRowClick`
  and was never clickable.** That is the fix, not a regression. If the rows _are_
  targets, give `DataTable` an `onRowClick`; if you are composing the `Table`
  primitives by hand, pass `interactive` on the rows that are targets:
  
  ```tsx
  <TableRow interactive onClick={() => navigate(href)}>
  ```
  
  An interactive row now also carries `cursor-pointer`, `data-interactive="true"`
  and the `group/row` hover group. The group is there so the link in the first
  cell can underline on row hover:
  
  ```tsx
  <a href={href} className="group-hover/row:underline">
    {name}
  </a>
  ```
  
  That link is still your job, and still worth doing — `onRowClick` deliberately
  does not make the `<tr>` focusable, so without a real link in the row the list
  is unreachable by keyboard.

### Patch Changes

- [#16](https://github.com/kubermatic/ui-kit/pull/16) [`00147ef`](https://github.com/kubermatic/ui-kit/commit/00147eff5284a8d58d8555dc42cd2452485c0cd5) Thanks [@mstruebing](https://github.com/mstruebing)! - Correctly mark tabs as selected visually when they are selected.

## 0.2.0

### Minor Changes

- [#3](https://github.com/kubermatic/ui-kit/pull/3) [`82a0f31`](https://github.com/kubermatic/ui-kit/commit/82a0f31e053291cd9c0774aedf2934975c28969a) Thanks [@mstruebing](https://github.com/mstruebing)! - Initial implementation.
