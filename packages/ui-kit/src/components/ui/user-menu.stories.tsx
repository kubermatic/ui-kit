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
import { KeyRound, Settings } from 'lucide-react';

import { USER } from '@/test/app-fixtures';

import { MenuItem, MenuLinkItem } from './menu';
import { UserMenu } from './user-menu';

const meta = {
  title: 'App Frame/UserMenu',
  component: UserMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Who is signed in, and how to stop being signed in. Renders nothing when there ' +
          'is no user, so a product with authentication disabled — which one product ' +
          'supports — gets no empty affordance rather than an avatar of nobody.\n\n' +
          'The trigger\'s accessible name is the person, not "User menu": on a dashboard ' +
          'where people hold an admin session and a normal one, which account you are about ' +
          'to sign out of is the whole question.',
      },
    },
  },
  args: { user: USER, onSignOut: () => {} },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithName: Story = {
  args: { showName: true },
};

export const WithExtraItems: Story = {
  args: {
    children: (
      <>
        <MenuLinkItem render={<a href="#settings" />}>
          <Settings />
          Settings
        </MenuLinkItem>
        <MenuItem>
          <KeyRound />
          API tokens
        </MenuItem>
      </>
    ),
  },
};

/** Authentication disabled: nothing at all. */
export const NoUser: Story = {
  args: { user: undefined },
  render: (args) => (
    <div className="font-sans text-sm text-muted-foreground">
      <UserMenu {...args} />
      (nothing rendered)
    </div>
  ),
};
