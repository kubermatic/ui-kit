---
'@kubermatic/ui-kit': minor
---

`TableRow` is now inert unless you pass `interactive`, and `DataTable` only
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
