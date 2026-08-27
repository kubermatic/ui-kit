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

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen } from 'storybook/test';
import {
  Copy,
  Download,
  MoreHorizontal,
  Pause,
  Play,
  Settings,
  Trash2,
} from 'lucide-react';

import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

const meta = {
  title: 'Primitives/Dropdown menu',
  component: DropdownMenu,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The row-actions menu every resource table in these dashboards ends with.
 *
 * `DropdownMenuLabel` maps to Base UI's `Menu.GroupLabel`, which *throws* unless
 * it is inside a `DropdownMenuGroup` or `DropdownMenuRadioGroup` — it labels the
 * group, it is not a free-standing heading. A closed menu hides the mistake,
 * because the popup never mounts.
 */
export const Playground: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Actions">
            <MoreHorizontal />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>web-frontend-01</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Play />
            Start
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pause />
            Stop
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy />
            Clone
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Open: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger
        render={<Button variant="outline">Actions</Button>}
      />
      <DropdownMenuContent className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>batch-worker-07</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Play />
            Start
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Download />
            Download kubeconfig
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async () => {
    // `screen`, not `canvas` — the popup portals outside the story root.
    const menu = await screen.findByRole('menu');
    await expect(menu).toBeInTheDocument();
    await expect(
      screen.getByRole('menuitem', { name: /download kubeconfig/i }),
    ).toHaveAttribute('data-disabled');
  },
};

/**
 * Checkbox and radio items keep their own state, so both need a real owner —
 * hence the named component. Also the only place `inset` alignment is visible:
 * a plain item beside indicator items would otherwise sit out of column.
 *
 * Note both labels sit inside a group. `DropdownMenuRadioGroup` supplies that
 * context itself; the checkbox items need an explicit `DropdownMenuGroup`.
 */
export const Selection: Story = {
  render: function ColumnVisibility() {
    const [columns, setColumns] = React.useState({
      node: true,
      address: true,
      age: false,
    });
    const [namespace, setNamespace] = React.useState('default');

    return (
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger render={<Button variant="outline">View</Button>} />
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={columns.node}
              onCheckedChange={(checked) =>
                setColumns((prev) => ({ ...prev, node: checked }))
              }
            >
              Node
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columns.address}
              onCheckedChange={(checked) =>
                setColumns((prev) => ({ ...prev, address: checked }))
              }
            >
              IP address
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columns.age}
              onCheckedChange={(checked) =>
                setColumns((prev) => ({ ...prev, age: checked }))
              }
            >
              Age
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuRadioGroup
            value={namespace}
            onValueChange={(value) => setNamespace(value as string)}
          >
            <DropdownMenuLabel>Namespace</DropdownMenuLabel>
            <DropdownMenuRadioItem value="default">
              default
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="kube-system">
              kube-system
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem inset>Reset to defaults</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

/**
 * Submenus are the sub-part most menu stories forget. The parent is open by
 * default; the submenu itself still opens on hover or arrow key, which is the
 * behaviour worth checking here.
 */
export const Submenu: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger
        render={<Button variant="outline">web-frontend-01</Button>}
      />
      <DropdownMenuContent className="w-52">
        <DropdownMenuItem>
          <Settings />
          Configure
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Download />
            Export
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Manifest (YAML)</DropdownMenuItem>
            <DropdownMenuItem>Manifest (JSON)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Support bundle</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
