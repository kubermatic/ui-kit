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
import { LayoutGrid, List, Rows3 } from 'lucide-react';
import { useState } from 'react';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

const meta = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A segmented control, for view switches: table/grid, light/dark/system, ' +
          'YAML/form. Distinct from `Switch`, which changes a setting — this changes a ' +
          'selection, and Base UI gives it the roving-tabindex behaviour that implies: one ' +
          'tab stop for the group, arrow keys within it.',
      },
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function PlaygroundStory() {
    const [view, setView] = useState(['table']);
    return (
      <ToggleGroup value={view} onValueChange={setView} multiple={false} aria-label="View">
        <ToggleGroupItem value="table" aria-label="Table">
          <List />
        </ToggleGroupItem>
        <ToggleGroupItem value="rows" aria-label="Compact rows">
          <Rows3 />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid">
          <LayoutGrid />
        </ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

export const WithLabels: Story = {
  render: function WithLabelsStory() {
    const [format, setFormat] = useState(['form']);
    return (
      <ToggleGroup value={format} onValueChange={setFormat} multiple={false} aria-label="Editor">
        <ToggleGroupItem value="form">Form</ToggleGroupItem>
        <ToggleGroupItem value="yaml">YAML</ToggleGroupItem>
      </ToggleGroup>
    );
  },
};
