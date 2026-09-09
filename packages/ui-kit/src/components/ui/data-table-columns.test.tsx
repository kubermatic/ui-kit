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
import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from './data-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { StatusBadge } from './status-badge';

interface Secret {
  name: string;
  status: 'success' | 'error';
}

const DATA: Secret[] = [
  { name: 'db-credentials', status: 'success' },
  { name: 'api-token', status: 'error' },
];

describe('DataTable column definitions', () => {
  /*
   * A header rendered as a plain string gets the sort affordance without the
   * column definition opting into `DataTableColumnHeader` by hand — which is
   * where the two apps' tables diverge from each other today. A *rendered*
   * header is left alone, so a column can opt out or decorate it.
   */
  it('leaves a rendered header alone but still sorts it', () => {
    const columns = [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column}>Resource name</DataTableColumnHeader>
        ),
      },
    ] as ColumnDef<Secret, never>[];

    render(<DataTable data={DATA} columns={columns} />);

    const header = screen.getByRole('columnheader', { name: 'Resource name' });
    expect(header).toHaveAttribute('aria-sort', 'none');
  });

  it('omits aria-sort from a column that cannot sort', () => {
    const columns = [
      { accessorKey: 'name', header: 'Name' },
      { id: 'actions', header: 'Actions', enableSorting: false, cell: () => <span>…</span> },
    ] as ColumnDef<Secret, never>[];

    render(<DataTable data={DATA} columns={columns} />);

    expect(screen.getByRole('columnheader', { name: 'Actions' })).not.toHaveAttribute('aria-sort');
  });

  it('honours an explicit column width', () => {
    const columns = [{ accessorKey: 'name', header: 'Name', size: 320 }] as ColumnDef<
      Secret,
      never
    >[];

    render(<DataTable data={DATA} columns={columns} />);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveStyle({ width: '320px' });
  });

  it('renders a cell component', () => {
    const columns = [
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge tone={row.original.status}>{row.original.status}</StatusBadge>
        ),
      },
    ] as ColumnDef<Secret, never>[];

    render(<DataTable data={DATA} columns={columns} />);
    expect(screen.getByText('success')).toBeInTheDocument();
  });
});

describe('DataTable toolbar', () => {
  const columns = [{ accessorKey: 'name', header: 'Name' }] as ColumnDef<Secret, never>[];

  it('renders no toolbar at all when nothing goes in it', () => {
    const { container } = render(<DataTable data={DATA} columns={columns} enableSearch={false} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table"] > .border-b')).toBeNull();
  });

  it('renders extra toolbar content beside the search box', () => {
    render(
      <DataTable
        data={DATA}
        columns={columns}
        toolbar={<button type="button">Only mine</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Only mine' })).toBeInTheDocument();
  });

  it('keeps a toolbar for extra content even with search off', () => {
    render(
      <DataTable
        data={DATA}
        columns={columns}
        enableSearch={false}
        toolbar={<span>filters</span>}
      />,
    );
    expect(screen.getByText('filters')).toBeInTheDocument();
  });

  it('takes a custom empty state', () => {
    render(<DataTable data={[]} columns={columns} empty={<p>Create your first secret.</p>} />);
    expect(screen.getByText('Create your first secret.')).toBeInTheDocument();
  });

  it('works without a caption', () => {
    render(<DataTable data={DATA} columns={columns} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
