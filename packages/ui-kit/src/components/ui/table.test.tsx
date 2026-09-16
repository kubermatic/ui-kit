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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

describe('Table', () => {
  /*
   * A real `<table>`. Row and column headers are what let a screen reader
   * announce "Status, Degraded" instead of "Degraded", and no ARIA reproduces
   * that as well as the element does.
   */
  it('exposes header cells as column headers', () => {
    render(
      <Table>
        <TableCaption>Secrets</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>db</TableCell>
            <TableCell>Ready</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>1 row</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByRole('table', { name: 'Secrets' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual([
      'Name',
      'Status',
    ]);
    expect(screen.getByRole('cell', { name: 'db' })).toBeInTheDocument();
  });

  /*
   * The hover highlight is the only thing telling a user a row does something,
   * so a row that does nothing must not have one. Both consuming apps shipped
   * tables where every row lit up — including read-only ones — which makes the
   * cue worthless.
   */
  it('gives a plain row no hover affordance', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>db</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const row = screen.getByRole('row');
    expect(row).not.toHaveClass('hover:bg-muted');
    expect(row).not.toHaveClass('cursor-pointer');
    expect(row).not.toHaveAttribute('data-interactive');
  });

  it('gives an interactive row the highlight, the pointer and a hover group', () => {
    render(
      <Table>
        <TableBody>
          <TableRow interactive>
            <TableCell>db</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const row = screen.getByRole('row');
    expect(row).toHaveClass('hover:bg-muted', 'cursor-pointer', 'group/row');
    expect(row).toHaveAttribute('data-interactive', 'true');
  });

  /* Eight columns of Kubernetes metadata fit no phone; the wrapper scrolls. */
  it('wraps the table in a horizontal scroll container', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(container.querySelector('[data-slot="table-container"]')).toHaveClass('overflow-x-auto');
  });
});
