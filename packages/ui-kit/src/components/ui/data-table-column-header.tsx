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

import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowDownUp, ArrowUp } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

export interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  children: ReactNode;
  className?: string;
}

/** The `aria-sort` value for a column, or `undefined` when it cannot sort. */
export function ariaSort<TData, TValue>(
  column: Column<TData, TValue>,
): 'ascending' | 'descending' | 'none' | undefined {
  if (!column.getCanSort()) return undefined;
  const sorted = column.getIsSorted();
  if (sorted === 'asc') return 'ascending';
  if (sorted === 'desc') return 'descending';
  return 'none';
}

/**
 * DataTableColumnHeader — a sortable column header.
 *
 * The button is inside the `<th>`; `aria-sort` goes on the `<th>` itself,
 * which `DataTable` applies from `ariaSort()`. That split matters: `aria-sort`
 * is only valid on the header cell, and a screen reader reading a button with
 * it announces nothing.
 *
 * The icon shows the *current* state, not the next one. An unsorted column
 * shows the neutral both-ways glyph rather than a down arrow, so the header
 * never claims a sort that is not applied — which is what one product's does
 * correctly and what a surprising number of tables get backwards.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  children,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={cn(className)}>{children}</span>;
  }

  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === 'asc')}
      className={cn(
        'group/sort -mx-1 inline-flex min-h-6 cursor-pointer items-center gap-1.5 rounded-sm px-1',
        'font-medium transition-colors outline-none',
        'hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
        sorted && 'text-foreground',
        className,
      )}
    >
      {children}
      {sorted === 'desc' ? (
        <ArrowDown aria-hidden="true" className="size-3.5" />
      ) : sorted === 'asc' ? (
        <ArrowUp aria-hidden="true" className="size-3.5" />
      ) : (
        <ArrowDownUp
          aria-hidden="true"
          className="size-3.5 opacity-0 transition-opacity group-hover/sort:opacity-60 group-focus-visible/sort:opacity-60"
        />
      )}
    </button>
  );
}
