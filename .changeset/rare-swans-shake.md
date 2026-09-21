---
'@kubermatic/ui-kit': minor
---

Headlines are now white on dark, instead of blue.

On the dark palette `--heading` was `#4183B2`, a lightened Aegean measuring
4.60:1 on the background — past the AA text minimum by a rounding error, and in
practice dim and hard to scan at headline weight. No blue is both legible on
Dark Azure and still recognisably Aegean, so the role now follows
`--foreground` there (18.90:1) and headlines are the brightest text on the
page. The light palette is unchanged and keeps brand Aegean.

Everything drawing `text-heading` changes colour on dark: `Text` `h1`/`h2`/`h3`
and `tone="heading"`, `PageHeader`, `DialogTitle`, `DrawerTitle`,
`ConfirmDialog` and `Brand`. Screenshot tests that capture a dark theme need
new baselines. To keep the blue, override the role:
`<ThemeProvider tokens={{ dark: { heading: '#4183b2' } }}>`.
