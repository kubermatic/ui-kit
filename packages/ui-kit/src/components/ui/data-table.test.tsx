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
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataTable } from './data-table';
import { selectionColumn } from './data-table-selection-column';
import type { ColumnDef } from './data-table-types';

interface Secret {
  name: string;
  namespace: string;
}

const DATA: Secret[] = [
  { name: 'db-credentials', namespace: 'billing' },
  { name: 'api-token', namespace: 'billing' },
  { name: 'tls-cert', namespace: 'ingress' },
];

const COLUMNS: ColumnDef<Secret, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'namespace', header: 'Namespace' },
];

const setup = (props: Partial<Parameters<typeof DataTable<Secret>>[0]> = {}) =>
  render(<DataTable data={DATA} columns={COLUMNS} caption="Secrets" {...props} />);

describe('DataTable', () => {
  it('renders a row per record', () => {
    setup();
    // Three records plus the header row.
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('describes itself with a caption', () => {
    setup();
    expect(screen.getByRole('table', { name: 'Secrets' })).toBeInTheDocument();
  });

  /*
   * The total, not the rendered count — which is the whole point of the
   * attribute once rows are paged or virtualized.
   */
  it('reports the unpaged row count', () => {
    setup({ pageSize: 2 });
    expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '3');
  });

  it('filters on the search box', async () => {
    setup();
    await userEvent.type(screen.getByRole('textbox', { name: 'Search…' }), 'tls');

    expect(screen.getByText('tls-cert')).toBeInTheDocument();
    expect(screen.queryByText('db-credentials')).not.toBeInTheDocument();
  });

  /*
   * Neither product sets `aria-sort`, so a screen reader is never told a
   * column is sorted, let alone which way.
   */
  it('announces the sort state on the header cell', async () => {
    setup();
    const header = screen.getByRole('columnheader', { name: 'Name' });
    expect(header).toHaveAttribute('aria-sort', 'none');

    await userEvent.click(within(header).getByRole('button'));
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );

    await userEvent.click(
      within(screen.getByRole('columnheader', { name: 'Name' })).getByRole('button'),
    );
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
  });

  it('actually sorts', async () => {
    setup();
    await userEvent.click(
      within(screen.getByRole('columnheader', { name: 'Name' })).getByRole('button'),
    );

    const cells = screen.getAllByRole('cell').map((cell) => cell.textContent);
    expect(cells.slice(0, 2)).toEqual(['api-token', 'billing']);
  });

  it('shows the empty message when there is nothing to show', () => {
    setup({ data: [], emptyMessage: 'No secrets here.' });
    expect(screen.getByText('No secrets here.')).toBeInTheDocument();
  });

  it('marks itself busy while loading', () => {
    const { container } = setup({ loading: true });
    expect(container.querySelector('[data-slot="data-table"]')).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('replaces the table with an error state, offering a retry', async () => {
    const onRetry = vi.fn();
    setup({ error: new Error('connection refused'), onRetry });

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText('connection refused')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('calls onRowClick with the record', async () => {
    const onRowClick = vi.fn();
    setup({ onRowClick });

    await userEvent.click(screen.getByText('tls-cert'));
    expect(onRowClick).toHaveBeenCalledWith({ name: 'tls-cert', namespace: 'ingress' });
  });

  /*
   * `onRowClick` is the whole signal. Without it the table is read-only and
   * must not borrow the affordance — otherwise the hover highlight says
   * "clickable" on a row that will never do anything.
   */
  it('marks body rows interactive only when onRowClick is given', () => {
    const { container: readOnly } = setup();
    expect(readOnly.querySelectorAll('tbody tr[data-interactive]')).toHaveLength(0);

    const { container: navigable } = setup({ onRowClick: vi.fn() });
    expect(navigable.querySelectorAll('tbody tr[data-interactive]')).toHaveLength(DATA.length);
  });

  /* The header is never a target, even when the body rows are. */
  it('leaves the header row inert on a clickable table', () => {
    const { container } = setup({ onRowClick: vi.fn() });
    expect(container.querySelector('thead tr')).not.toHaveAttribute('data-interactive');
  });

  /* Nor is the "nothing here" row, which has no record behind it. */
  it('leaves the empty row inert', () => {
    const { container } = setup({ data: [], onRowClick: vi.fn() });
    expect(container.querySelector('tbody tr')).not.toHaveAttribute('data-interactive');
  });

  describe('pagination', () => {
    it('pages, and says which page you are on', async () => {
      setup({ pageSize: 2 });

      expect(screen.getAllByRole('row')).toHaveLength(3);
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
      expect(screen.getByText('tls-cert')).toBeInTheDocument();
    });

    it('disables the ends of the range', async () => {
      setup({ pageSize: 2 });

      expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
      await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
      expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    });

    it('can be turned off', () => {
      setup({ pagination: false });
      expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(4);
    });
  });

  describe('row selection', () => {
    const columns = [
      selectionColumn<Secret>({ ariaLabel: (row) => `Select ${(row as Secret).name}` }),
      ...COLUMNS,
    ];

    it('names each checkbox after its row', async () => {
      setup({ columns, enableRowSelection: true });

      await userEvent.click(screen.getByRole('checkbox', { name: 'Select tls-cert' }));
      expect(screen.getByText('1 of 3 selected')).toBeInTheDocument();
    });

    it('selects every row on the page from the header', async () => {
      setup({ columns, enableRowSelection: true });

      await userEvent.click(screen.getByRole('checkbox', { name: 'Select all rows on this page' }));
      expect(screen.getByText('3 of 3 selected')).toBeInTheDocument();
    });

    /*
     * Selection keyed by row identity, not position — otherwise a refetch that
     * reorders the list moves the ticks to different resources.
     */
    it('keeps the selection on the same record when the data reorders', async () => {
      const { rerender } = render(
        <DataTable data={DATA} columns={columns} enableRowSelection getRowId={(row) => row.name} />,
      );

      await userEvent.click(screen.getByRole('checkbox', { name: 'Select tls-cert' }));
      rerender(
        <DataTable
          data={[...DATA].reverse()}
          columns={columns}
          enableRowSelection
          getRowId={(row) => row.name}
        />,
      );

      expect(screen.getByRole('checkbox', { name: 'Select tls-cert' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Select api-token' })).not.toBeChecked();
    });
  });

  describe('column visibility', () => {
    /*
     * Opened from the keyboard rather than with `userEvent.click`. Base UI's
     * menu opens on `pointerdown`, and jsdom does not implement PointerEvent —
     * so a synthetic click never reaches it. Enter on the focused trigger is
     * the path a keyboard user takes anyway, which makes this the more
     * interesting assertion of the two.
     */
    const openMenu = async () => {
      screen.getByRole('button', { name: 'Columns' }).focus();
      await userEvent.keyboard('{Enter}');
    };

    it('hides a column from a real menu', async () => {
      setup({ enableColumnVisibility: true });

      await openMenu();
      await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Namespace' }));

      expect(screen.queryByRole('columnheader', { name: 'Namespace' })).not.toBeInTheDocument();
    });

    /*
     * One product's version is a `<div>` of `<label>`s toggled by `useState`:
     * no escape handling, no focus management, no click-outside. Toggling three
     * columns should also be three clicks, not three reopenings.
     */
    it('stays open while you toggle several', async () => {
      setup({ enableColumnVisibility: true });

      await openMenu();
      await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Namespace' }));

      expect(screen.getByRole('menuitemcheckbox', { name: 'Name' })).toBeInTheDocument();
    });

    it('falls back to the column id when the header is not a string', async () => {
      setup({
        enableColumnVisibility: true,
        columns: [
          { accessorKey: 'name', header: 'Name' },
          { accessorKey: 'namespace', header: () => <span>NS</span> },
        ],
      });

      await openMenu();

      expect(screen.getByRole('menuitemcheckbox', { name: 'namespace' })).toBeInTheDocument();
    });
  });

  /*
   * An ungrouped column next to a group gets a placeholder cell in the group
   * row, so the header rows stay aligned.
   */
  it('renders grouped headers with a placeholder above ungrouped columns', () => {
    const columns: ColumnDef<Secret, unknown>[] = [
      {
        id: 'identity',
        header: 'Identity',
        columns: [{ accessorKey: 'name', header: 'Name' }],
      },
      { accessorKey: 'namespace', header: 'Namespace' },
    ];
    setup({ columns });

    const [groupRow, leafRow] = within(screen.getByRole('table')).getAllByRole('row');
    const groupCells = within(groupRow!).getAllByRole('columnheader');
    expect(groupCells.map((cell) => cell.textContent)).toEqual(['Identity', '']);
    expect(within(leafRow!).getByRole('columnheader', { name: 'Namespace' })).toBeInTheDocument();
  });
  /*
   * Row identity in the DOM. A product's end-to-end suite needs to click "the
   * row for db-credentials", not "the second row" — the latter breaks as soon
   * as sorting or a refetch reorders the data.
   */
  describe('row identity', () => {
    it('stamps the row id given by getRowId', () => {
      setup({ getRowId: (row) => row.name });

      const row = document.querySelector('[data-row-id="db-credentials"]');
      expect(row).not.toBeNull();
      expect(row).toHaveTextContent('billing');
    });

    it('falls back to the row index without getRowId', () => {
      setup();

      expect(document.querySelector('[data-row-id="0"]')).toHaveTextContent('db-credentials');
    });
  });
});

/*
 * Characterization of behaviour that comes from TanStack Table rather than from
 * this component — sort functions, the global filter, page-index resets. These
 * pin what consumers see today so that a TanStack upgrade has to keep it, and
 * they must pass unchanged across one. They assert on the DOM only.
 */
describe('DataTable behaviour pinned across TanStack upgrades', () => {
  interface Workload {
    name: string;
    replicas: number;
    label: string;
  }

  const WORKLOADS: Workload[] = [
    { name: 'web', replicas: 3, label: 'bravo' },
    { name: 'api', replicas: 12, label: 'Charlie' },
    { name: 'worker', replicas: 1, label: 'alpha' },
  ];

  const workloadColumns: ColumnDef<Workload, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'replicas', header: 'Replicas' },
    { accessorKey: 'label', header: 'Label' },
  ];

  const renderWorkloads = (props: Partial<Parameters<typeof DataTable<Workload>>[0]> = {}) =>
    render(
      <DataTable
        data={WORKLOADS}
        columns={workloadColumns}
        getRowId={(row) => row.name}
        {...props}
      />,
    );

  const rowOrder = () =>
    Array.from(document.querySelectorAll('tbody tr[data-row-id]')).map((row) =>
      row.getAttribute('data-row-id'),
    );

  const clickHeader = (name: string) =>
    userEvent.click(within(screen.getByRole('columnheader', { name })).getByRole('button'));

  /*
   * The header button always asks for an explicit direction, so a column never
   * cycles back to unsorted, and a number column starts ascending like a
   * string one does.
   */
  describe.each([
    {
      column: 'Name',
      ascending: ['api', 'web', 'worker'],
      descending: ['worker', 'web', 'api'],
    },
    {
      column: 'Replicas',
      ascending: ['worker', 'web', 'api'],
      descending: ['api', 'web', 'worker'],
    },
    /*
     * Changed on purpose in the v9 migration. v8 sampled rows from the
     * eleventh onward to pick the sort function, so a table of ten rows or
     * fewer compared raw values and `Charlie` sorted before `alpha`. v9
     * samples the first rows, so text now ignores case at every size.
     */
    {
      column: 'Label',
      ascending: ['worker', 'web', 'api'],
      descending: ['api', 'web', 'worker'],
    },
  ])('sorting the $column column', ({ column, ascending, descending }) => {
    it('cycles ascending, descending, ascending', async () => {
      renderWorkloads();
      const header = () => screen.getByRole('columnheader', { name: column });

      expect(rowOrder()).toEqual(['web', 'api', 'worker']);
      expect(header()).toHaveAttribute('aria-sort', 'none');

      await clickHeader(column);
      expect(rowOrder()).toEqual(ascending);
      expect(header()).toHaveAttribute('aria-sort', 'ascending');

      await clickHeader(column);
      expect(rowOrder()).toEqual(descending);
      expect(header()).toHaveAttribute('aria-sort', 'descending');

      await clickHeader(column);
      expect(rowOrder()).toEqual(ascending);
      expect(header()).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  it('sorts a mixed-case column case-insensitively past ten rows', async () => {
    const labels = ['delta', 'Echo', 'alpha', 'Foxtrot', 'charlie', 'Bravo'];
    const data = Array.from({ length: 12 }, (_, index) => ({
      name: `w${index}`,
      replicas: index,
      label: `${labels[index % labels.length]!}${index < labels.length ? '' : '-two'}`,
    }));
    render(<DataTable data={data} columns={workloadColumns} getRowId={(row) => row.name} />);

    await clickHeader('Label');
    expect(
      Array.from(document.querySelectorAll('tbody tr td:nth-child(3)')).map(
        (cell) => cell.textContent,
      ),
    ).toEqual([
      'alpha',
      'alpha-two',
      'Bravo',
      'Bravo-two',
      'charlie',
      'charlie-two',
      'delta',
      'delta-two',
      'Echo',
      'Echo-two',
      'Foxtrot',
      'Foxtrot-two',
    ]);
  });

  describe('search', () => {
    const search = (text: string) =>
      userEvent.type(screen.getByRole('textbox', { name: 'Search…' }), text);

    it('matches a substring of a string cell, ignoring case', async () => {
      renderWorkloads();
      await search('CHAR');
      expect(rowOrder()).toEqual(['api']);
    });

    it('matches a substring of a number cell', async () => {
      renderWorkloads();
      await search('2');
      expect(rowOrder()).toEqual(['api']);
    });

    it('reports the filtered total in aria-rowcount', async () => {
      renderWorkloads({ pageSize: 1 });
      expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '3');

      await search('w');
      expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '2');
    });
  });

  it('returns to the first page when data changes', async () => {
    const { rerender } = renderWorkloads({ pageSize: 2 });
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();

    rerender(
      <DataTable
        data={[...WORKLOADS, { name: 'cron', replicas: 0, label: 'delta' }]}
        columns={workloadColumns}
        getRowId={(row) => row.name}
        pageSize={2}
      />,
    );

    // The reset lands a tick after the render, hence `findBy`.
    expect(await screen.findByText('Page 1 of 2')).toBeInTheDocument();
    expect(rowOrder()).toEqual(['web', 'api']);
  });

  it('keeps a selection on its record when getRowId is given and the data reorders', async () => {
    const columns = [
      selectionColumn<Workload>({ ariaLabel: (row) => `Select ${(row as Workload).name}` }),
      ...workloadColumns,
    ];
    const { rerender } = renderWorkloads({ columns, enableRowSelection: true });

    await userEvent.click(screen.getByRole('checkbox', { name: 'Select worker' }));
    rerender(
      <DataTable
        data={[...WORKLOADS].reverse()}
        columns={columns}
        enableRowSelection
        getRowId={(row) => row.name}
      />,
    );

    expect(rowOrder()).toEqual(['worker', 'api', 'web']);
    expect(document.querySelector('[data-row-id="worker"]')).toHaveAttribute(
      'data-state',
      'selected',
    );
    expect(screen.getByRole('checkbox', { name: 'Select worker' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Select web' })).not.toBeChecked();
    expect(screen.getByText('1 of 3 selected')).toBeInTheDocument();
  });

  it('sets an inline width only on a column given a size', () => {
    render(
      <DataTable
        data={WORKLOADS}
        columns={[
          { accessorKey: 'name', header: 'Name', size: 120 },
          { accessorKey: 'label', header: 'Label' },
        ]}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveStyle({ width: '120px' });
    expect(screen.getByRole('columnheader', { name: 'Label' }).style.width).toBe('');
  });
});
