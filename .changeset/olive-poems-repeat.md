---
'@kubermatic/ui-kit': patch
---

Fix the combobox suggestion popup anchoring to the wrong element.

`MultiCombobox` sized its popup from the `<input>` rather than from the field,
so with chips selected the popup took the width of whatever gap was left on the
chip row and resized and shifted on every selection change. `Combobox` had the
same missing anchor; its input is full-width so it looked right, but the popup
still came out two pixels narrow and a pixel off, because the input excludes the
field's borders.

Both controls now render their field box as a `Combobox.InputGroup`, which is
the element Base UI anchors the popup to. The popup matches the field in both,
and stays put as chips are added, removed, or wrapped.

The props of both components are unchanged, and `className` still applies to the
outer field box. Each control renders one extra wrapper element, and the field
box gains `role="group"` plus Base UI's `data-open`, `data-disabled`,
`data-popup-side` and `data-placeholder` attributes.
