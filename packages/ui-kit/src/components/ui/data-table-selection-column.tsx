/*
 * Copyright 2026 The Kubermatic Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from './checkbox.js';

/** The id the selection column is registered under. */
export const SELECTION_COLUMN_ID = 'select';

export interface SelectionColumnOptions {
  /**
   * Accessible name for a row's checkbox, derived from the row. Default is
   * "Select row"; pass something specific and the announcement becomes
   * "Select my-secret" instead of the same phrase forty times.
   */
  ariaLabel?: (row: unknown) => string;
}

/**
 * selectionColumn — the leading checkbox column.
 *
 * A function rather than a constant so the row label can be derived, and
 * exported rather than built into `DataTable` because the position matters:
 * some tables want it after an expander or an icon, and a hardcoded first
 * column cannot be moved.
 *
 * `enableSorting`/`enableHiding` are off — a sortable checkbox column reorders
 * rows by selection state, which nobody wants, and hiding it strands the
 * selection.
 */
export function selectionColumn<TData>({ ariaLabel }: SelectionColumnOptions = {}): ColumnDef<
  TData,
  unknown
> {
  return {
    id: SELECTION_COLUMN_ID,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        /*
         * Base UI takes `indeterminate` as a real prop, so "some but not all
         * selected" needs no ref and no effect — which is the version of this
         * that both products got wrong by setting `.indeterminate` on the DOM
         * node after render.
         */
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
        aria-label="Select all rows on this page"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        aria-label={ariaLabel ? ariaLabel(row.original) : 'Select row'}
      />
    ),
  };
}
