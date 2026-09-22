---
'@kubermatic/ui-kit': minor
---

Interactive components now carry `cursor-pointer` themselves, so a consumer no
longer has to add it to every control it renders.

No UA stylesheet gives a `<button>` the pointer cursor — only links get it —
and the kit was not overriding that. Every product was therefore reapplying
`cursor-pointer` by hand, and the screens where somebody forgot looked inert
under the mouse: a menu's "⋯" trigger, a workspace row, a tab.

Covered now: `Button` (and everything built on it, including `buttonVariants`
on an anchor), `MenuTrigger` and every menu row, `TabsTab`, `SelectTrigger`
and `SelectItem`, the combobox's list items, clear and open controls,
`SidebarMenuButton` and `SidebarTrigger`, `Checkbox`, `Switch`,
`RadioGroupItem`, the tag-input's remove buttons, and the close buttons on
`Dialog`, `Drawer` and toasts. Disabled states are untouched and keep the
arrow or `not-allowed` they already had.

**Two rows change on purpose.** `MenuItem` and `SelectItem` were
`cursor-default`, copied from shadcn, which in turn copies the desktop
convention that a native menu row does not take the pointer. On the web that
reads as "not clickable" next to every other control on the page, and both
products had already overridden it row by row. If you want the old behaviour
on a particular menu, pass `className="cursor-default"` — `cn` merges it and
the kit's class drops out.

**Delete your own overrides.** A `cursor-pointer` you pass yourself still
wins, so nothing breaks if you leave them, but they are now noise. Worth
grepping for before your next release.

`MenuTrigger` was a bare re-export of Base UI's trigger and is now a thin
component, so that it has somewhere to put the class. It still ships no
appearance of its own — a "⋯", an avatar and a `Button` look nothing alike —
and Base UI's props pass straight through, `className` callback and `payload`
generic included. It gains `data-slot="menu-trigger"`, which is new to style
or select against.
