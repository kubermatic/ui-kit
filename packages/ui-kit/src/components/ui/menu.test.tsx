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
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuSeparator,
  MenuTrigger,
} from './menu';

async function openMenu() {
  screen.getByRole('button', { name: 'Actions' }).focus();
  await userEvent.keyboard('{Enter}');
}

describe('Menu', () => {
  it('is a menu of menu items', async () => {
    render(
      <Menu>
        <MenuTrigger render={<Button>Actions</Button>} />
        <MenuContent>
          {/* `MenuGroupLabel` requires a `MenuGroup` around it — Base UI
              throws without one, since the label is what the group's
              `aria-labelledby` points at. */}
          <MenuGroup>
            <MenuGroupLabel>Secret</MenuGroupLabel>
            <MenuItem>Edit</MenuItem>
            <MenuSeparator />
            <MenuItem variant="destructive">Delete</MenuItem>
          </MenuGroup>
        </MenuContent>
      </Menu>,
    );

    await openMenu();

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'Edit',
      'Delete',
    ]);
  });

  it('runs the item that was chosen and closes', async () => {
    const onClick = vi.fn();
    render(
      <Menu>
        <MenuTrigger render={<Button>Actions</Button>} />
        <MenuContent>
          <MenuItem onClick={onClick}>Edit</MenuItem>
        </MenuContent>
      </Menu>,
    );

    await openMenu();
    await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    render(
      <Menu>
        <MenuTrigger render={<Button>Actions</Button>} />
        <MenuContent>
          <MenuItem>Edit</MenuItem>
        </MenuContent>
      </Menu>,
    );

    await openMenu();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  /*
   * A `MenuItem` whose `onClick` calls `router.push` is not a link: it cannot
   * be middle-clicked, copied, or opened in a new tab.
   */
  it('renders a navigating item as a real link', async () => {
    render(
      <Menu>
        <MenuTrigger render={<Button>Actions</Button>} />
        <MenuContent>
          <MenuLinkItem render={<a href="/settings" />}>Settings</MenuLinkItem>
        </MenuContent>
      </Menu>,
    );

    await openMenu();
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toHaveAttribute('href', '/settings');
  });
});
