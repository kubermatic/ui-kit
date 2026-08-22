# Changelog

All notable changes to `@kubermatic/ui-kit` are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0]

The exported API is unchanged, so nothing needs editing in a consuming app. Two
groups of changes are visible on screen once the version is picked up, and are
the reason this is a minor rather than a patch.

### Changed

- **`--muted-foreground` is darker** — `oklch(0.5547 …)` to `oklch(0.54 …)`,
  hue and chroma untouched. It measured 4.47:1 on `--background` and 4.34:1 on
  `--muted`, both under the WCAG AA floor of 4.5:1, and it carries every
  description, hint and secondary table cell in the kit. The new value clears
  all three surfaces it renders on (4.74 / 4.60 / 4.78). This is the single
  most visible change in the release, though it is close to imperceptible
  side by side.
- **Destructive text is now `--error-foreground`, not `--destructive`.**
  `--destructive` is a fill: it is tuned to carry white on top of it, and as
  text on a page surface it measured 4.47:1 in light and 3.63:1 in dark.
  Affects `Button` variants `outlineDestructive` and `ghostDestructive`, the
  destructive `DropdownMenuItem`, `FormLabel` in its error state, and
  `FormMessage`. Borders and hover fills still use `--destructive`, so the
  solid destructive button is unchanged — `outlineDestructive` now pairs deep
  red text with a lighter red border.
- `Alert` variants `info` and `success` read the new `--info-soft` and
  `--success-soft` tokens instead of hard-coding an `oklch()` literal for their
  dark text. Rendering is identical; the values simply moved into the palette
  where a re-brand can reach them.
- `--warning-soft` darkens from `oklch(0.55 …)` to `oklch(0.52 …)`; it missed
  AA at 4.10:1 on its own 10% tint.

Every foreground/background pair the kit renders now clears WCAG AA in both
themes. `Foundations/Contrast` measures all 20 and fails if that stops being
true.

### Added

- `--info-soft` and `--success-soft` tokens, completing the `-soft` set that
  previously held only `--warning-soft`. Override them alongside the rest.
- Accessible names on controls that had none: the `Combobox` trigger, clear and
  chip-remove buttons, and the `FormMultiCombobox` chips input. `PopoverTitle`
  and `PopoverDescription` now render Base UI's own parts, which is what gives
  the popover's `role="dialog"` an accessible name — previously it had none.
- `alertVariants`, `sidebarMenuButtonVariants`, `inputGroupAddonVariants` and
  `inputGroupButtonVariants` are exported, matching `badgeVariants` and
  `buttonVariants`.

### Fixed

- `Badge` variants `ghost` and `link` were shipped but never rendered by a
  story, so neither had been reviewed against either token set.

## [0.1.0]

Initial extraction: 32 primitives built on Base UI and Tailwind CSS 4, plus the
OKLch light/dark token set they render against.
