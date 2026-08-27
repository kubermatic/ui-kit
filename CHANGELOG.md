# Changelog

All notable changes to `@kubermatic/ui-kit` are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Breaking, on the dependency surface rather than the component API. Every
component keeps its props; what changes is what a consuming app has to install
and where toasts come from.

### Removed

- **`sonner` is no longer a peer dependency**, and `Toaster` is no longer a
  wrapper around it. Toasts are built on Base UI's `toast`, which is the engine
  every other primitive here already uses, so this removes an external package
  from the boundary rather than adding one.

  Migration: import `toast` from `@kubermatic/ui-kit` instead of from `sonner`,
  and uninstall `sonner`. The call shapes are unchanged —
  `toast.success(...)`, `toast.error(title, { description })` and
  `toast.promise(p, { loading, success, error })` all still work. Two
  differences worth knowing: `toast.dismiss()` replaces `toast.dismiss` from
  sonner with the same meaning, and an action is given as
  `actionProps: { children: 'Retry', onClick }` rather than
  `action: { label, onClick }`.

- **`next-themes` is no longer a peer dependency.** The sonner wrapper was its
  only consumer, and `<Toaster />` no longer takes a `theme` prop. Toasts style
  from the same tokens as everything else and follow the `.dark` class the app
  already toggles, which works whether or not that app uses next-themes.

### Changed

- **`@base-ui/react` and `lucide-react` moved from peer to direct
  dependencies.** They carry no cross-boundary identity requirement, so the kit
  owns them outright and consuming apps get them transitively. Remove both from
  your `package.json`: keeping a copy re-opens the version split — the products
  currently span three `lucide-react` majors — and the Base UI engine choice
  stops being something a product can get wrong. `kubermatic-config check`
  fails a repo that declares either.

- **Every component now carries `'use client'`** — 25 of the 32 were missing it,
  along with the `useIsMobile` hook. A Next.js app can import any primitive
  directly into a server component. Applied to all of them rather than only the
  ones that use a hook today: the failure is asymmetric (a missing directive is
  a build error in the consumer, a needless one is a few hundred bytes), and
  only the blanket form is mechanically enforceable, which it now is via a lint
  rule.

### Added

- **`@kubermatic/ui-kit/tokens`** — the token set as importable values, for the
  four rendering boundaries that cannot take a class name: Chart.js datasets,
  React Flow `style`, Recharts `fill` and CodeMirror's `EditorView.theme()`.
  `cssVar(name)` returns `var(--name)` and follows the theme; `resolveToken`
  reads the computed value for canvas, which is the one boundary `var()` does
  not survive. Its own entry point, so it does not pull the component graph in.

- **Apache-2.0 headers on every source file**, enforced by a lint rule. They
  were on none of them.

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
