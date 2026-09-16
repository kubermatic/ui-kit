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

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type Table as TableInstance,
  type VisibilityState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Columns3, Search } from 'lucide-react';
import { useMemo, useRef, useState, type ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import { Button } from './button.js';
import { DataTableColumnHeader, ariaSort } from './data-table-column-header.js';
import { DataTablePagination } from './data-table-pagination.js';
import { EmptyState } from './empty-state.js';
import { ErrorState } from './error-state.js';
import { Input } from './input.js';
import { MenuCheckboxItem, Menu, MenuContent, MenuTrigger } from './menu.js';
import { Skeleton } from './skeleton.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table.js';

export interface DataTableProps<TData> {
  data: readonly TData[];
  /*
   * `any` for the cell-value parameter, deliberately, and it is the only one
   * in the package.
   *
   * A real column list is heterogeneous — one column accesses a string, the
   * next a number, the next has no accessor at all — so there is no single
   * value type to name. `never` was the previous attempt: it makes an
   * already-built array assignable, but TypeScript still checks each object
   * literal against it, so every consumer has to write
   * `as ColumnDef<Row, never>[]`. Ten of this package's own stories and tests
   * did exactly that, and one product grew a wrapper component whose main job
   * was to hide the cast. `any` is TanStack's own documented type for this
   * prop, and the cost is contained: it is one parameter of one prop, and
   * `TData` — the part that catches real mistakes, like an accessor naming a
   * field the row does not have — stays strict.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see above
  columns: ColumnDef<TData, any>[];

  /* ---------------------------------------------------------------- states */
  /** Renders skeleton rows instead of the body. */
  loading?: boolean;
  /** Replaces the whole table with an `ErrorState`. */
  error?: unknown;
  onRetry?: () => void;
  /** Replaces the body when there are no rows. Defaults to an `EmptyState`. */
  empty?: ReactNode;
  emptyMessage?: string;

  /* --------------------------------------------------------------- toolbar */
  enableSearch?: boolean;
  searchPlaceholder?: string;
  /** Extra toolbar content — `FilterSelect`s, a "New" button. */
  toolbar?: ReactNode;
  enableColumnVisibility?: boolean;

  /* -------------------------------------------------------------- rows */
  enableRowSelection?: boolean;
  /**
   * Stable row identity. Without it TanStack keys rows by index, so selection
   * follows the *position* and a refetch that reorders the list moves the
   * ticks to different resources.
   */
  getRowId?: (row: TData) => string;
  onRowClick?: (row: TData) => void;
  initialSorting?: SortingState;

  /* ------------------------------------------------------- size strategy */
  /**
   * Client-side paging. On by default: a namespace with 4 000 secrets renders
   * 4 000 rows otherwise.
   */
  pagination?: boolean;
  pageSize?: number;
  /**
   * Renders only the visible rows instead of paging. For an append-only stream
   * — the event feed — where paging fights the data. Mutually exclusive with
   * `pagination`; setting both prefers virtualization.
   */
  virtualize?: boolean;
  /** Height of the scroll container when virtualizing. */
  virtualizeHeight?: string;

  /** Describes the table for screen readers. Strongly recommended. */
  caption?: string;
  className?: string;
  'data-testid'?: string;
}

const ESTIMATED_ROW_HEIGHT = 41;

/**
 * DataTable — the resource list, once.
 *
 * One product has one of these (search, sort, column visibility, selection,
 * optional virtualization) and the other has five near-copies, one per
 * resource kind. This is their union, and what it fixes on the
 * way:
 *
 * - **`aria-sort` on the `<th>`.** Neither app sets it, so a screen reader is
 *   never told a column is sorted, let alone which way.
 * - **The column-visibility menu is a menu.** One product's is a `<div>` of
 *   `<label>`s toggled by `useState`, with no escape handling, no focus
 *   management, and no click-outside — it stays open until you click it again.
 * - **`onRowClick` does not make the row a button.** A clickable `<tr>` is
 *   unreachable by keyboard, and making the row itself focusable breaks the
 *   grid semantics. The cue is that the row is a *shortcut*: the first cell
 *   should contain a real link, and `onRowClick` is the convenience on top of
 *   it. That is why this prop does not add `tabIndex` — if it is your only way
 *   into the detail page, put a link in the row.
 * - **Only clickable rows look clickable.** `onRowClick` is what makes a row
 *   `interactive`: the hover highlight and the pointer appear together, and a
 *   table without it stays visually inert. Both apps highlight every row on
 *   hover regardless, which tells the user nothing — a read-only table and a
 *   navigable one are indistinguishable until you click one and find out.
 *   Interactive rows are `group/row`, so the link in the first cell can
 *   `group-hover/row:underline` and the row reads as a single target.
 * - **Selection survives a refetch,** given `getRowId`.
 *
 * Deliberately client-side. Server-side paging and filtering need the table
 * state hoisted into the URL and the query, and that is the consumer's
 * concern — pass `pagination={false}` and drive `data` yourself.
 */
export function DataTable<TData>({
  data,
  columns,
  loading = false,
  error,
  onRetry,
  empty,
  emptyMessage = 'Nothing to show yet.',
  enableSearch = true,
  searchPlaceholder = 'Search…',
  toolbar,
  enableColumnVisibility = false,
  enableRowSelection = false,
  getRowId,
  onRowClick,
  initialSorting = [],
  pagination = true,
  pageSize = 25,
  virtualize = false,
  virtualizeHeight = '32rem',
  caption,
  className,
  'data-testid': testId = 'data-table',
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const paginated = pagination && !virtualize;

  const rows = useMemo(() => data as TData[], [data]);

  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable returns a new instance each render by design
  const table: TableInstance<TData> = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(paginated ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    initialState: paginated ? { pagination: { pageIndex: 0, pageSize } } : undefined,
    enableRowSelection,
    getRowId,
  });

  const visibleRows = table.getRowModel().rows;
  const leafColumns = table.getVisibleLeafColumns();
  const columnCount = leafColumns.length;

  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: visibleRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    enabled: virtualize,
    overscan: 12,
  });

  if (error) {
    return (
      <div className={cn('rounded-lg border border-border', className)} data-testid={testId}>
        <ErrorState
          error={error}
          onRetry={onRetry}
          title="Could not load this list"
          className="border-0"
        />
      </div>
    );
  }

  const virtualRows = virtualize ? virtualizer.getVirtualItems() : [];
  const paddingTop = virtualRows.length > 0 ? (virtualRows[0]?.start ?? 0) : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - (virtualRows[virtualRows.length - 1]?.end ?? 0)
      : 0;

  const bodyRows = virtualize
    ? virtualRows.map((virtualRow) => ({
        row: visibleRows[virtualRow.index]!,
        index: virtualRow.index,
      }))
    : visibleRows.map((row, index) => ({ row, index }));

  const tableElement = (
    <Table
      /*
       * `aria-rowcount` is the total, not the rendered count — that is the
       * whole point of it when rows are virtualized or paged. Each row then
       * carries its absolute `aria-rowindex`, 1-based and offset by the header
       * row, so "row 340 of 4000" is announced correctly even though only
       * fifteen `<tr>`s exist.
       */
      aria-rowcount={table.getFilteredRowModel().rows.length}
    >
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} aria-rowindex={1}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                aria-sort={ariaSort(header.column)}
                colSpan={header.colSpan}
                style={header.getSize() === 150 ? undefined : { width: header.getSize() }}
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  /*
                   * A header rendered as a plain string still gets the
                   * sort affordance, so a column definition does not have
                   * to opt into `DataTableColumnHeader` by hand to be
                   * sortable — which is where both apps' tables diverge
                   * from each other today.
                   */
                  typeof header.column.columnDef.header === 'string' ? (
                    <DataTableColumnHeader column={header.column}>
                      {header.column.columnDef.header}
                    </DataTableColumnHeader>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )
                ) : (
                  flexRender(header.column.columnDef.header, header.getContext())
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {loading ? (
          Array.from({ length: 5 }, (_, rowIndex) => (
            <TableRow key={`skeleton-${rowIndex}`}>
              {leafColumns.map((column) => (
                <TableCell key={column.id}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : visibleRows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columnCount} className="p-0">
              {empty ?? <EmptyState title={emptyMessage} icon={<Search />} />}
            </TableCell>
          </TableRow>
        ) : (
          <>
            {paddingTop > 0 ? (
              <tr aria-hidden="true">
                <td colSpan={columnCount} style={{ height: paddingTop }} />
              </tr>
            ) : null}

            {bodyRows.map(({ row, index }) => (
              <TableRow
                key={row.id}
                aria-rowindex={index + 2}
                /*
                 * Row identity in the DOM, so an end-to-end suite can address
                 * a row by *what it is* rather than where it sits. Without it
                 * the only handle is the visual position, and a test that
                 * clicks "the second row" starts failing the moment sorting,
                 * paging or a refetch reorders the list. Falls back to
                 * TanStack's row id, which is the index unless `getRowId` was
                 * given — so pass `getRowId` if you intend to select on this.
                 */
                data-row-id={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                interactive={!!onRowClick}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {paddingBottom > 0 ? (
              <tr aria-hidden="true">
                <td colSpan={columnCount} style={{ height: paddingBottom }} />
              </tr>
            ) : null}
          </>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div
      data-slot="data-table"
      data-testid={testId}
      aria-busy={loading || undefined}
      className={cn('flex flex-col rounded-lg border border-border bg-background', className)}
    >
      {enableSearch || toolbar || enableColumnVisibility ? (
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          {enableSearch ? (
            <Input
              size="sm"
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              startAdornment={<Search />}
              className="max-w-xs"
              data-testid={`${testId}-search`}
            />
          ) : null}

          <div className="flex flex-1 flex-wrap items-center gap-2">{toolbar}</div>

          {enableColumnVisibility ? (
            <Menu>
              <MenuTrigger
                render={
                  <Button variant="outline" size="sm" data-testid={`${testId}-columns`}>
                    <Columns3 />
                    Columns
                  </Button>
                }
              />
              <MenuContent className="min-w-48">
                {table
                  .getAllLeafColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <MenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(checked) => column.toggleVisibility(checked)}
                      /* `closeOnClick={false}` so toggling three columns is
                       * three clicks, not three reopenings of the menu. */
                      closeOnClick={false}
                    >
                      {typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : column.id}
                    </MenuCheckboxItem>
                  ))}
              </MenuContent>
            </Menu>
          ) : null}
        </div>
      ) : null}

      {virtualize ? (
        <div ref={scrollRef} style={{ maxHeight: virtualizeHeight }} className="overflow-auto">
          {tableElement}
        </div>
      ) : (
        tableElement
      )}

      {paginated && visibleRows.length > 0 ? (
        <DataTablePagination table={table} showSelectionCount={enableRowSelection} />
      ) : null}
    </div>
  );
}
