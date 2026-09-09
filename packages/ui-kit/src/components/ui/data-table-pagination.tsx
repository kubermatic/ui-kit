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

import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cn } from '../../lib/utils.js';
import { Button } from './button.js';
import { FilterSelect } from './select.js';

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  /** Choices for rows-per-page. Pass `[]` to hide the selector. */
  pageSizeOptions?: readonly number[];
  /** Shows "n of m selected" when row selection is on. */
  showSelectionCount?: boolean;
  className?: string;
}

/**
 * DataTablePagination — the footer controls.
 *
 * The page numbers are text rather than a strip of page links: a resource list
 * is browsed by scanning, not by jumping to page 7, and a link per page is a
 * lot of tab stops for something nobody uses.
 *
 * The first/last buttons are hidden below `sm` rather than shrunk, because
 * four 24px targets in a row on a phone is how you paginate by accident.
 */
export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 25, 50, 100],
  showSelectionCount = false,
  className,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const selectedCount = Object.keys(table.getState().rowSelection).length;

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 font-sans text-sm',
        className,
      )}
    >
      <div className="text-muted-foreground">
        {showSelectionCount && selectedCount > 0
          ? `${selectedCount} of ${table.getFilteredRowModel().rows.length} selected`
          : `${table.getFilteredRowModel().rows.length} ${
              table.getFilteredRowModel().rows.length === 1 ? 'row' : 'rows'
            }`}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {pageSizeOptions.length > 0 ? (
          <FilterSelect
            label="Rows per page"
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
            options={pageSizeOptions.map(String)}
            triggerClassName="w-20"
            data-testid="data-table-page-size"
          />
        ) : null}

        <div className="text-muted-foreground" aria-live="polite">
          {/* Announced politely, so paging tells a screen-reader user where
              they landed. Both products' tables change silently. */}
          Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="First page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Last page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(pageCount - 1)}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
