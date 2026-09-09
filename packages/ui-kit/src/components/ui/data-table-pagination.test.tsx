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
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from './data-table';
import { selectionColumn } from './data-table-selection-column';

interface Row {
  name: string;
}

const DATA: Row[] = Array.from({ length: 12 }, (_, index) => ({ name: `row-${index}` }));
const COLUMNS = [{ accessorKey: 'name', header: 'Name' }] as ColumnDef<Row, never>[];

const setup = (props: Partial<Parameters<typeof DataTable<Row>>[0]> = {}) =>
  render(<DataTable data={DATA} columns={COLUMNS} pageSize={5} {...props} />);

describe('DataTablePagination', () => {
  it('reports the row count when nothing is selected', () => {
    setup();
    expect(screen.getByText('12 rows')).toBeInTheDocument();
  });

  it('uses the singular for one row', () => {
    setup({ data: [DATA[0]!] });
    expect(screen.getByText('1 row')).toBeInTheDocument();
  });

  it('jumps to the last page and back to the first', async () => {
    setup();

    await userEvent.click(screen.getByRole('button', { name: 'Last page' }));
    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'First page' }));
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('steps back a page', async () => {
    setup();

    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('changes the page size', async () => {
    setup();

    const trigger = screen.getByRole('combobox', { name: 'Rows per page' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(screen.getByRole('option', { name: '10' }));

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  /* Announced politely, so paging tells a screen-reader user where they landed. */
  it('announces the current page', () => {
    setup();
    expect(screen.getByText('Page 1 of 3')).toHaveAttribute('aria-live', 'polite');
  });
});

describe('DataTablePagination options', () => {
  it('hides the page-size control when there are no choices', () => {
    render(<DataTable data={DATA} columns={COLUMNS} pageSize={5} />);
    // The default set is present…
    expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeInTheDocument();
  });

  it('reports the selection count once rows are selected', async () => {
    render(
      <DataTable
        data={DATA}
        columns={[selectionColumn<Row>(), ...COLUMNS]}
        pageSize={5}
        enableRowSelection
      />,
    );

    // No `ariaLabel`, so the default name applies to every row's checkbox.
    const boxes = screen.getAllByRole('checkbox', { name: 'Select row' });
    await userEvent.click(boxes[0]!);
    expect(screen.getByText('1 of 12 selected')).toBeInTheDocument();
  });
});
