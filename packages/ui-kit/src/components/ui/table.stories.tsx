/*
 * Copyright 2026 The Kubermatic ui-kit Authors.
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

import { Badge } from './badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

const ROWS = [
  { name: 'web-frontend-01', node: 'worker-03', cpu: '4', status: 'Running' },
  { name: 'db-primary', node: 'worker-01', cpu: '8', status: 'Running' },
  { name: 'batch-worker-07', node: 'worker-05', cpu: '2', status: 'Stopped' },
  { name: 'cache-redis', node: 'worker-02', cpu: '2', status: 'Failed' },
] as const;

const STATUS_VARIANT = {
  Running: 'success',
  Stopped: 'secondary',
  Failed: 'destructive',
} as const;

const meta = {
  title: 'Primitives/Table',
  component: Table,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Table>
      <TableCaption>Virtual machines in namespace `default`.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Node</TableHead>
          <TableHead className="text-right">vCPU</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell className="text-muted-foreground">{row.node}</TableCell>
            <TableCell className="text-right tabular-nums">{row.cpu}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={2}
            className="text-muted-foreground h-24 text-center"
          >
            No virtual machines found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
