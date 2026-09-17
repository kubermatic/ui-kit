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
import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeyRound, MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from './button';
import { DataTable } from './data-table';
import { selectionColumn } from './data-table-selection-column';
import { EmptyState } from './empty-state';
import { Menu, MenuContent, MenuItem, MenuTrigger } from './menu';
import { FilterSelect } from './select';
import { StatusBadge, type StatusTone } from './status-badge';
import type { ColumnDef } from '@tanstack/react-table';

interface ExternalSecret {
  name: string;
  namespace: string;
  store: string;
  status: StatusTone;
  statusLabel: string;
}

const DATA: ExternalSecret[] = [
  {
    name: 'db-credentials',
    namespace: 'billing',
    store: 'vault-backend',
    status: 'success',
    statusLabel: 'Synced',
  },
  {
    name: 'api-token',
    namespace: 'billing',
    store: 'aws-secretsmanager',
    status: 'error',
    statusLabel: 'Error',
  },
  {
    name: 'tls-cert',
    namespace: 'ingress',
    store: 'vault-backend',
    status: 'warning',
    statusLabel: 'Degraded',
  },
  {
    name: 'smtp-password',
    namespace: 'notifications',
    store: 'gcp-secretmanager',
    status: 'success',
    statusLabel: 'Synced',
  },
  {
    name: 'oidc-client-secret',
    namespace: 'auth',
    store: 'vault-backend',
    status: 'pending',
    statusLabel: 'Pending',
  },
  {
    name: 'redis-password',
    namespace: 'cache',
    store: 'vault-backend',
    status: 'success',
    statusLabel: 'Synced',
  },
];

const COLUMNS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'namespace', header: 'Namespace' },
  { accessorKey: 'store', header: 'Secret store' },
  {
    accessorKey: 'statusLabel',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge tone={row.original.status} dot>
        {row.original.statusLabel}
      </StatusBadge>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <Menu>
        <MenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label={`Actions for ${row.original.name}`}>
              <MoreHorizontal />
            </Button>
          }
        />
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Force sync</MenuItem>
          <MenuItem variant="destructive">Delete</MenuItem>
        </MenuContent>
      </Menu>
    ),
  },
] as ColumnDef<ExternalSecret, never>[];

const meta = {
  title: 'Data/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The resource list, once. One product has one of these and the other has five ' +
          'near-copies, one per resource kind; this is their union. What it fixes on the ' +
          'way:\n\n' +
          '- **`aria-sort` on the `<th>`** — neither app sets it, so a screen reader is ' +
          'never told a column is sorted, let alone which way.\n' +
          "- **The column-visibility menu is a menu** — one product's is a `<div>` of " +
          '`<label>`s toggled by `useState`, with no escape handling, no focus management ' +
          'and no click-outside.\n' +
          '- **`aria-rowcount` is the total**, with an absolute `aria-rowindex` per row, so ' +
          '"row 340 of 4000" is announced correctly even when only fifteen `<tr>`s exist.\n' +
          '- **Selection survives a refetch**, given `getRowId`.\n' +
          '- **Only clickable rows look clickable** — `onRowClick` is what brings the hover ' +
          'highlight and the pointer. Both apps highlight every row regardless, so a ' +
          'read-only table and a navigable one look identical until you click one.\n\n' +
          '`onRowClick` deliberately does *not* make the row focusable: a clickable `<tr>` ' +
          'is unreachable by keyboard, and making the row itself a tab stop breaks the grid ' +
          'semantics. Put a real link in the first cell and treat the row click as the ' +
          'shortcut it is — see **Navigable**.',
      },
    },
  },
  args: { data: DATA, columns: COLUMNS, caption: 'External secrets' },
} satisfies Meta<typeof DataTable<ExternalSecret>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="p-6">
      <DataTable {...args} />
    </div>
  ),
};

/** Everything on at once: filters, column visibility, selection, paging. */
export const FullyLoaded: Story = {
  render: function FullyLoadedStory(args) {
    const [store, setStore] = useState('All');
    const filtered = store === 'All' ? DATA : DATA.filter((secret) => secret.store === store);

    return (
      <div className="p-6">
        <DataTable
          {...args}
          data={filtered}
          columns={[
            selectionColumn<ExternalSecret>({
              ariaLabel: (row) => `Select ${(row as ExternalSecret).name}`,
            }),
            ...COLUMNS,
          ]}
          enableRowSelection
          enableColumnVisibility
          getRowId={(row) => row.name}
          pageSize={5}
          toolbar={
            <FilterSelect
              label="Store"
              value={store}
              onValueChange={setStore}
              options={['All', 'vault-backend', 'aws-secretsmanager', 'gcp-secretmanager']}
              triggerClassName="w-52"
            />
          }
        />
      </div>
    );
  },
};

/**
 * A navigable list, done properly: a real link in the first cell, `onRowClick`
 * as the shortcut on top of it.
 *
 * The link is what makes the row reachable by keyboard — the row itself is not
 * a tab stop and must not become one. `group-hover/row:underline` is what ties
 * the two together: hovering anywhere on the row underlines the name, so the
 * row reads as a single target rather than a strip of text with a link in it.
 *
 * Compare with **Playground**, which has no `onRowClick` — those rows stay
 * inert, and that difference is the whole point.
 */
export const Navigable: Story = {
  render: () => (
    <div className="p-6">
      <DataTable
        data={DATA}
        caption="External secrets"
        columns={
          [
            {
              accessorKey: 'name',
              header: 'Name',
              cell: ({ row }) => (
                <a
                  href={`#/external-secrets/${row.original.name}`}
                  /* The row navigates to the same place; without this, both fire. */
                  onClick={(event) => event.stopPropagation()}
                  className="rounded-sm font-medium underline-offset-2 group-hover/row:underline hover:underline"
                >
                  {row.original.name}
                </a>
              ),
            },
            ...COLUMNS.slice(1),
          ] as ColumnDef<ExternalSecret, never>[]
        }
        onRowClick={() => {}}
      />
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => (
    <div className="p-6">
      <DataTable {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    data: [],
    empty: (
      <EmptyState
        icon={<KeyRound />}
        title="No external secrets yet"
        description="An ExternalSecret pulls a value from a provider and writes it into a Kubernetes Secret."
        action={
          <Button>
            <Plus />
            New external secret
          </Button>
        }
      />
    ),
  },
  render: (args) => (
    <div className="p-6">
      <DataTable {...args} />
    </div>
  ),
};

export const Failed: Story = {
  args: { error: new Error('dial tcp 10.0.4.2:8200: connect: connection refused') },
  render: (args) => (
    <div className="p-6">
      <DataTable {...args} onRetry={() => {}} />
    </div>
  ),
};

export const NavigableDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Navigable.render,
};

export const FullyLoadedDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: FullyLoaded.render,
};
