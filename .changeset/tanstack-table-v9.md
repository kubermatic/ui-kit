---
'@kubermatic/ui-kit': minor
---

`DataTable` now runs on TanStack Table v9 (9.3.1). Most column code needs no change.

- **No change needed** for columns that use `accessorFn`, or an `accessorKey` that names a real field of the row type. `createColumnHelper` and the other table types still come from `@kubermatic/ui-kit`, with the same generics.
- **Stricter `accessorKey`.** A plain column object whose `accessorKey` names a field the row type does not have now fails type-checking. Fix the key, or switch to `accessorFn`. Nested paths such as `'metadata.name'` still work.
- **Row types must be objects or arrays** (TanStack's `RowData`). Interfaces and object types already satisfy this.
- **Small tables sort like large ones.** Tables with 10 or fewer rows used to sort text case-sensitively; they now sort case-insensitively, like larger tables. Update any snapshot or test that relied on the old order.
- **`DataTablePagination` takes the kit's `TableInstance`.** A table built directly with TanStack v8's `useReactTable` is no longer accepted; use `DataTable`, which paginates by default.
- **TanStack Table v9 is bundled** as a direct dependency. Do not install `@tanstack/react-table` yourself for kit tables. If your app has its own v8 copy for other tables, it stays independent of the kit's.
