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

interface Event {
  message: string;
}

const DATA: Event[] = Array.from({ length: 500 }, (_, index) => ({
  message: `event-${index}`,
}));
const COLUMNS = [{ accessorKey: 'message', header: 'Message' }] as ColumnDef<Event, never>[];

describe('DataTable, virtualized', () => {
  /*
   * For an append-only stream — the event feed — where paging fights the data.
   * Mutually exclusive with pagination; setting both prefers virtualization.
   */
  it('renders only a window of rows and no pager', () => {
    render(<DataTable data={DATA} columns={COLUMNS} virtualize pagination />);

    expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
    // Far fewer than 500 `<tr>`s, plus the header.
    expect(screen.getAllByRole('row').length).toBeLessThan(100);
  });

  /*
   * The count is the *total*, not the number of `<tr>`s that exist — which is
   * the whole point of the attribute when rows are virtualized. Each row then
   * carries its absolute `aria-rowindex`, so "row 340 of 500" is announced
   * correctly even though only a handful are in the DOM.
   */
  it('still reports the full row count', () => {
    render(<DataTable data={DATA} columns={COLUMNS} virtualize />);
    expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '500');
  });

  it('scrolls inside its own container', () => {
    const { container } = render(
      <DataTable data={DATA} columns={COLUMNS} virtualize virtualizeHeight="10rem" />,
    );
    const scroller = container.querySelector<HTMLElement>('.overflow-auto');
    expect(scroller).toBeInTheDocument();
    expect(scroller?.style.maxHeight).toBe('10rem');
  });

  it('shows the empty state with nothing to virtualize', () => {
    render(<DataTable data={[]} columns={COLUMNS} virtualize emptyMessage="No events." />);
    expect(screen.getByText('No events.')).toBeInTheDocument();
  });
});
