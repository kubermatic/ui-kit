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
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

import { Button } from './button';
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from './menu';

const meta = {
  title: 'Overlays/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A list of commands, anchored to a trigger — the row-actions "⋯" button on every ' +
          'table in both products. Base UI gives it the parts that make it a menu rather ' +
          'than a list of buttons in a box: arrow keys move between items, typing jumps to ' +
          'one, Escape closes and returns focus to the trigger, and the items are ' +
          '`role="menuitem"` inside a `role="menu"` so the count is announced.\n\n' +
          'Use `MenuLinkItem` for anything that navigates. A `MenuItem` with an `onClick` ' +
          'that calls `router.push` is not a link: it cannot be middle-clicked, copied, or ' +
          'opened in a new tab.',
      },
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RowActions: Story = {
  render: () => (
    <Menu>
      <MenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Actions for db-credentials">
            <MoreHorizontal />
          </Button>
        }
      />
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>db-credentials</MenuGroupLabel>
          <MenuItem>Force sync</MenuItem>
          <MenuLinkItem render={<a href="#edit" />}>Edit</MenuLinkItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem variant="destructive">Delete</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithSelectionAndSubmenu: Story = {
  render: function SelectionStory() {
    const [showNamespace, setShowNamespace] = useState(true);
    const [sort, setSort] = useState('name');

    return (
      <Menu>
        <MenuTrigger render={<Button variant="outline">View</Button>} />
        <MenuContent align="start" className="min-w-56">
          <MenuGroup>
            <MenuGroupLabel>Columns</MenuGroupLabel>
            <MenuCheckboxItem
              checked={showNamespace}
              onCheckedChange={setShowNamespace}
              closeOnClick={false}
            >
              Namespace
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Sort by</MenuGroupLabel>
            <MenuRadioGroup value={sort} onValueChange={(value) => setSort(value as string)}>
              <MenuRadioItem value="name">Name</MenuRadioItem>
              <MenuRadioItem value="age">Age</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuSub>
            <MenuSubTrigger>Copy as</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>YAML</MenuItem>
              <MenuItem>JSON</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
    );
  },
};
