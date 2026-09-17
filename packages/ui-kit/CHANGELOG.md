# @kubermatic/ui-kit

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
