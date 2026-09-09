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

import { MenuItem } from './menu';
import { UserMenu } from './user-menu';

async function openMenu() {
  screen.getByTestId('user-menu-trigger').focus();
  await userEvent.keyboard('{Enter}');
}

describe('UserMenu', () => {
  /*
   * A product with authentication disabled — which one product supports —
   * should get no affordance, not an avatar of nobody.
   */
  it('renders nothing without a user', () => {
    const { container } = render(<UserMenu user={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  /*
   * The accessible name is the person, not "User menu": on a dashboard where
   * people hold an admin session and a normal one, which account you are about
   * to sign out of is the whole question.
   */
  it('names the trigger after the account', () => {
    render(<UserMenu user={{ name: 'Ada Lovelace', email: 'ada@example.com' }} />);
    expect(screen.getByRole('button', { name: 'Account menu, Ada Lovelace' })).toBeInTheDocument();
  });

  it('falls back to the email when there is no name', () => {
    render(<UserMenu user={{ email: 'ada@example.com' }} />);
    expect(
      screen.getByRole('button', { name: 'Account menu, ada@example.com' }),
    ).toBeInTheDocument();
  });

  it('shows the account details in the menu', async () => {
    render(<UserMenu user={{ name: 'Ada Lovelace', email: 'ada@example.com' }} />);
    await openMenu();

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByTestId('user-email')).toHaveTextContent('ada@example.com');
  });

  it('signs out', async () => {
    const onSignOut = vi.fn();
    render(<UserMenu user={{ email: 'ada@example.com' }} onSignOut={onSignOut} />);
    await openMenu();

    await userEvent.click(screen.getByTestId('sign-out'));
    expect(onSignOut).toHaveBeenCalledOnce();
  });

  it('omits sign-out when there is no handler', async () => {
    render(<UserMenu user={{ email: 'ada@example.com' }} />);
    await openMenu();

    expect(screen.queryByTestId('sign-out')).not.toBeInTheDocument();
  });

  it('takes extra items', async () => {
    render(
      <UserMenu user={{ email: 'ada@example.com' }}>
        <MenuItem>API tokens</MenuItem>
      </UserMenu>,
    );
    await openMenu();

    expect(screen.getByRole('menuitem', { name: 'API tokens' })).toBeInTheDocument();
  });
});

describe('UserMenu display', () => {
  it('shows the name beside the avatar when asked', () => {
    render(<UserMenu user={{ name: 'Ada Lovelace' }} showName />);
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
  });

  it('renders nothing for a null user', () => {
    const { container } = render(<UserMenu user={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('takes an avatar image', () => {
    render(<UserMenu user={{ name: 'Ada', image: '/ada.png' }} />);
    expect(screen.getByRole('button', { name: 'Account menu, Ada' })).toBeInTheDocument();
  });

  it('falls back to "Account" with neither name nor email', () => {
    render(<UserMenu user={{}} />);
    expect(screen.getByRole('button', { name: 'Account menu, Account' })).toBeInTheDocument();
  });
});
