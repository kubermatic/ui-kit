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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { StatusBadge } from './status-badge';

const meta = {
  title: 'Data/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          'The semantic table elements, styled. A real `<table>`, not a grid of divs: row ' +
          'and column headers are what let a screen reader announce "Status, Degraded" ' +
          'instead of "Degraded", and there is no ARIA that reproduces that as well as the ' +
          'element does.\n\n' +
          'For a resource list, reach for `DataTable` instead — it adds search, sorting, ' +
          'column visibility, selection and the loading/empty/error states. These parts are ' +
          'for a table you are laying out by hand.',
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="w-[40rem]">
      <Table>
        <TableCaption>External secrets in the billing namespace.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>db-credentials</TableCell>
            <TableCell>vault-backend</TableCell>
            <TableCell>
              <StatusBadge tone="success" dot>
                Synced
              </StatusBadge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>api-token</TableCell>
            <TableCell>aws-secretsmanager</TableCell>
            <TableCell>
              <StatusBadge tone="error" dot>
                Error
              </StatusBadge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
