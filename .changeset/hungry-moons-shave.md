---
'@kubermatic/ui-kit': minor
---

Split `primary` and `destructive` into a surface role and a text tone, and
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
