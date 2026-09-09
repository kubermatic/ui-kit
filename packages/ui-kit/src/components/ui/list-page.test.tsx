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

import { ListPage } from './list-page';

interface Secret {
  name: string;
}

const COLUMNS = [{ accessorKey: 'name', header: 'Name' }] as ColumnDef<Secret, never>[];

describe('ListPage', () => {
  /*
   * The most repeated shape in both products: one has eleven of these and
   * the other nine, each spelling out the heading, the description, the
   * action button and the table again.
   */
  it('puts a heading, a description and an action above the table', () => {
    render(
      <ListPage
        title="Secrets"
        description="In the selected namespace."
        actions={<button type="button">New secret</button>}
        data={[{ name: 'db-credentials' }]}
        columns={COLUMNS}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Secrets' })).toBeInTheDocument();
    expect(screen.getByText('In the selected namespace.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New secret' })).toBeInTheDocument();
    expect(screen.getByText('db-credentials')).toBeInTheDocument();
  });

  /* Every DataTable prop passes through, so there is nothing new to learn. */
  it("forwards the table's states", () => {
    render(
      <ListPage
        title="Secrets"
        data={[]}
        columns={COLUMNS}
        error={new Error('connection refused')}
      />,
    );
    expect(screen.getByText('connection refused')).toBeInTheDocument();
  });

  it('renders breadcrumbs when given them', () => {
    render(
      <ListPage
        title="Secrets"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Secrets' }]}
        data={[]}
        columns={COLUMNS}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });
});
