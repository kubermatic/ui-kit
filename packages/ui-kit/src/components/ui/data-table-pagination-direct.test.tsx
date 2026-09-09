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
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';

import { DataTablePagination } from './data-table-pagination';

interface Row {
  name: string;
}

const DATA: Row[] = Array.from({ length: 8 }, (_, index) => ({ name: `row-${index}` }));
const COLUMNS = [{ accessorKey: 'name', header: 'Name' }] as ColumnDef<Row, never>[];

/**
 * Drives the footer against a real table instance, so the props `DataTable`
 * does not forward — `pageSizeOptions`, `showSelectionCount` — are still
 * covered. It is an exported component; a consumer composing their own table
 * body can use it directly.
 */
function Harness({
  pageSizeOptions,
  showSelectionCount,
}: {
  pageSizeOptions?: readonly number[];
  showSelectionCount?: boolean;
}) {
  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable returns a new instance each render by design
  const table = useReactTable({
    data: DATA,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  });

  return (
    <DataTablePagination
      table={table}
      pageSizeOptions={pageSizeOptions}
      showSelectionCount={showSelectionCount}
    />
  );
}

describe('DataTablePagination, standalone', () => {
  it('hides the page-size selector when given no choices', () => {
    render(<Harness pageSizeOptions={[]} />);

    expect(screen.queryByRole('combobox', { name: 'Rows per page' })).not.toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  it('falls back to the row count when nothing is selected', () => {
    render(<Harness showSelectionCount />);
    expect(screen.getByText('8 rows')).toBeInTheDocument();
  });
});
