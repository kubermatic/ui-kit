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
import { KeyRound, Plus } from 'lucide-react';

import { Button } from './button';
import { EmptyState } from './empty-state';
import { ListPage } from './list-page';
import { StatusBadge, type StatusTone } from './status-badge';
import type { ColumnDef } from '@tanstack/react-table';

interface Secret {
  name: string;
  namespace: string;
  store: string;
  status: StatusTone;
  statusLabel: string;
}

const DATA: Secret[] = [
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
] as ColumnDef<Secret, never>[];

const meta = {
  title: 'Templates/ListPage',
  component: ListPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A titled page whose body is a resource table — the single most repeated shape ' +
          'across both products. One has eleven of them (organisations, projects, members, ' +
          'secrets, config maps, service accounts, roles, services, service objects, ' +
          'blueprints, namespaces) and the other has nine. Each is a heading, a ' +
          'description, a "New …" button and a table, and each one currently spells that ' +
          'out again — so the gap above the table and the position of the action button ' +
          'differ page to page.\n\n' +
          'Every `DataTable` prop passes straight through, so the loading, empty and error ' +
          "states are the table's and there is nothing new to learn. When a page needs " +
          'more than a table under the heading, compose `Page` + `PageHeader` + `DataTable` ' +
          'directly: this is the common case, not a base class.',
      },
    },
  },
  args: { title: 'External Secrets', data: DATA, columns: COLUMNS, caption: 'External secrets' },
} satisfies Meta<typeof ListPage<Secret>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    description: 'Reconciled from a provider into a Kubernetes Secret.',
    actions: (
      <Button>
        <Plus />
        New external secret
      </Button>
    ),
  },
  render: (args) => (
    <div className="p-6">
      <ListPage {...args} />
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => (
    <div className="p-6">
      <ListPage {...args} />
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
      <ListPage {...args} />
    </div>
  ),
};

export const Failed: Story = {
  args: { error: new Error('The API returned 503.'), onRetry: () => {} },
  render: (args) => (
    <div className="p-6">
      <ListPage {...args} />
    </div>
  ),
};
