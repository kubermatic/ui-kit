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
import { useState } from 'react';

import {
  FilterSelect,
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

const meta = {
  title: 'Forms/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          'Exposed as parts rather than a single configured component, because the two ' +
          'products need genuinely different item rendering — one puts a role description ' +
          'in each row, the other puts a connection-status dot after the cluster name. ' +
          'A single `options` prop would have grown a `renderOption` escape hatch within ' +
          'a week.\n\n' +
          'For the common toolbar case — a flat list filtering a table — use ' +
          '`FilterSelect`, which *is* that configured component and says so.',
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="w-64">
      <Select defaultValue="billing">
        <SelectTrigger aria-label="Namespace">
          <SelectValue placeholder="All namespaces" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="billing">billing</SelectItem>
          <SelectItem value="ingress">ingress</SelectItem>
          <SelectItem value="kube-system">kube-system</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Grouped: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger aria-label="Namespace">
          <SelectValue placeholder="Pick a namespace" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectGroupLabel>Workloads</SelectGroupLabel>
            <SelectItem value="billing">billing</SelectItem>
            <SelectItem value="checkout">checkout</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectGroupLabel>System</SelectGroupLabel>
            <SelectItem value="kube-system">kube-system</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

/**
 * The inline label is *associated* with the control, not merely adjacent —
 * otherwise a toolbar of four filters announces "All, All, Synced, All" with
 * no way to tell which is which.
 */
export const Filter: Story = {
  render: function FilterStory() {
    const [status, setStatus] = useState('All');
    return (
      <FilterSelect
        label="Status"
        value={status}
        onValueChange={setStatus}
        options={['All', 'Synced', 'Degraded', 'Error']}
      />
    );
  },
};

export const FilterDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Filter.render,
};
