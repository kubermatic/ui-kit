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
  MenuCheckboxItem,
  MenuContent,
  MenuLinkItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from './menu';

async function openMenu() {
  screen.getByRole('button', { name: 'Actions' }).focus();
  await userEvent.keyboard('{Enter}');
}

describe('Menu parts', () => {
  it('renders a checkbox item that reports its state', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Menu>
        <MenuTrigger render={<Button>Actions</Button>} />
        <MenuContent>
          <MenuCheckboxItem checked onCheckedChange={onCheckedChange}>
            Show namespace
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>,
    );

    await openMenu();
    const item = screen.getByRole('menuitemcheckbox', { name: 'Show namespace' });
    expect(item).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(item);
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it('renders a radio group of items', async () => {
    render(
      <Menu>
        <MenuTrigger render={<Button>Actions</Button>} />
        <MenuContent>
          <MenuRadioGroup value="name">
            <MenuRadioItem value="name">By name</MenuRadioItem>
            <MenuRadioItem value="age">By age</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>,
    );

    await openMenu();
    expect(screen.getByRole('menuitemradio', { name: 'By name' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menuitemradio', { name: 'By age' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('renders a submenu behind its own trigger', async () => {
    render(
      <Menu>
        <MenuTrigger render={<Button>Actions</Button>} />
        <MenuContent>
          <MenuSub>
            <MenuSubTrigger>Copy as</MenuSubTrigger>
            <MenuSubContent>
              <MenuCheckboxItem checked={false}>YAML</MenuCheckboxItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>,
    );

    await openMenu();

    const subTrigger = screen.getByRole('menuitem', { name: 'Copy as' });
    expect(subTrigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(screen.queryByRole('menuitemcheckbox', { name: 'YAML' })).not.toBeInTheDocument();

    subTrigger.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('menuitemcheckbox', { name: 'YAML' })).toBeInTheDocument();
  });
});

describe('MenuLinkItem tone', () => {
  it('takes the destructive tone', async () => {
    render(
      <Menu>
        <MenuTrigger render={<Button>Actions</Button>} />
        <MenuContent>
          <MenuLinkItem variant="destructive" render={<a href="/delete" />}>
            Delete
          </MenuLinkItem>
        </MenuContent>
      </Menu>,
    );

    await openMenu();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('text-destructive-tone');
  });
});
