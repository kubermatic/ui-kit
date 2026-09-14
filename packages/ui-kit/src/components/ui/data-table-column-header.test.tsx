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
import { describe, expect, it, vi } from 'vitest';
import type { Column } from '@tanstack/react-table';

import { DataTableColumnHeader, ariaSort } from './data-table-column-header';

/** A column stub with only the bits `ariaSort` reads. */
const column = (canSort: boolean, sorted: false | 'asc' | 'desc') =>
  ({
    getCanSort: () => canSort,
    getIsSorted: () => sorted,
  }) as unknown as Column<unknown, unknown>;

describe('ariaSort', () => {
  /*
   * `undefined` rather than `'none'` for an unsortable column: `aria-sort` is
   * only meaningful on a column that *can* sort, and setting it to "none"
   * everywhere tells a screen reader every column is sortable.
   */
  it('is absent when the column cannot sort', () => {
    expect(ariaSort(column(false, false))).toBeUndefined();
  });

  it('maps the sort state to the ARIA vocabulary', () => {
    expect(ariaSort(column(true, false))).toBe('none');
    expect(ariaSort(column(true, 'asc'))).toBe('ascending');
    expect(ariaSort(column(true, 'desc'))).toBe('descending');
  });
});

describe('DataTableColumnHeader', () => {
  it('renders plain text for a column that cannot sort', () => {
    render(
      <DataTableColumnHeader column={column(false, false)} className="text-right">
        Actions
      </DataTableColumnHeader>,
    );

    expect(screen.getByText('Actions')).toHaveClass('text-right');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a sort button for a column that can', async () => {
    const toggleSorting = vi.fn();
    const sortable = {
      getCanSort: () => true,
      getIsSorted: () => false as const,
      toggleSorting,
    } as unknown as Column<unknown, unknown>;

    render(<DataTableColumnHeader column={sortable}>Name</DataTableColumnHeader>);

    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(toggleSorting).toHaveBeenCalledWith(false);
  });
});
