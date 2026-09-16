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

import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * Table — the semantic table elements, styled.
 *
 * A real `<table>`, not a grid of divs. Row and column headers are what let a
 * screen reader announce "Status, Degraded" instead of "Degraded", and there
 * is no ARIA that reproduces that as well as the element does.
 *
 * The wrapper scrolls horizontally rather than letting the table squash: a
 * Kubernetes resource table has eight columns and no responsive breakpoint
 * makes that fit a phone. `tabindex` is not set on the wrapper because the
 * rows contain focusable cells; if you render a table of plain text wide
 * enough to scroll, add it so keyboard users can reach the overflow.
 */
export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn('w-full caption-bottom border-collapse font-sans text-sm', className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

export function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('border-t bg-muted font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  );
}

export interface TableRowProps extends ComponentProps<'tr'> {
  /**
   * The row is a target — it highlights on hover and shows a pointer.
   *
   * Off by default, and that default is the point: a highlight that follows
   * the cursor reads as "this does something", so a row that does nothing
   * must not have one. A table where every row lights up is a table where the
   * highlight tells you nothing about which rows you can act on.
   *
   * An interactive row is also `group/row`, so the cell carrying the link can
   * react to hover anywhere on the row — `group-hover/row:underline` on the
   * name is what makes the row read as one target rather than a strip of text
   * with a link somewhere in it.
   */
  interactive?: boolean;
}

export function TableRow({ className, interactive, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      /* A handle for tests and for consumers styling rows by state. */
      data-interactive={interactive || undefined}
      className={cn(
        'border-b border-border transition-colors',
        'data-[state=selected]:bg-muted',
        interactive && 'group/row cursor-pointer hover:bg-muted',
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-10 px-3 text-left align-middle font-medium whitespace-nowrap text-muted-foreground',
        '[&:has([role=checkbox])]:w-0 [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'px-3 py-2 align-middle',
        '[&:has([role=checkbox])]:w-0 [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}
