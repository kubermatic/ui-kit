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
'use client';

import { LogOut } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import { Avatar } from './avatar.js';
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from './menu.js';

export interface UserMenuUser {
  name?: string | null;
  email?: string | null;
  /** Avatar URL — an OIDC `picture` claim, a Gravatar. */
  image?: string | null;
}

export interface UserMenuProps {
  user?: UserMenuUser | null;
  onSignOut?: () => void;
  signOutLabel?: string;
  /** Extra items above the sign-out row — "Settings", "API tokens". */
  children?: ReactNode;
  /** Shows the name beside the avatar on wide screens. */
  showName?: boolean;
  className?: string;
}

/**
 * UserMenu — who is signed in, and how to stop being signed in.
 *
 * Renders nothing when there is no user, so a product with authentication
 * disabled — which one product supports — passes `user={undefined}` and gets
 * no empty affordance rather than an avatar of nobody.
 *
 * The trigger's accessible name is the person, not "User menu": "Account menu,
 * ada@example.com" is what tells you which account you are about to sign out
 * of, and on a dashboard where people hold an admin session and a normal one
 * that is the whole question.
 */
export function UserMenu({
  user,
  onSignOut,
  signOutLabel = 'Sign out',
  children,
  showName = false,
  className,
}: UserMenuProps) {
  if (!user) return null;

  const displayName = user.name ?? user.email ?? 'Account';

  return (
    <Menu>
      <MenuTrigger
        data-testid="user-menu-trigger"
        aria-label={`Account menu, ${displayName}`}
        className={cn(
          'flex items-center gap-2 rounded-md p-1 transition-colors outline-none',
          'hover:bg-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50',
          className,
        )}
      >
        <Avatar src={user.image ?? undefined} name={displayName} />
        {showName ? (
          <span className="hidden max-w-40 truncate font-sans text-sm sm:inline">
            {displayName}
          </span>
        ) : null}
      </MenuTrigger>

      <MenuContent className="min-w-56">
        {/*
         * A plain block, not `MenuGroupLabel`: that part requires a
         * `Menu.Group` around it and Base UI throws without one. And it is the
         * wrong role anyway — this is a header identifying the account, not
         * the label of a group of items, and claiming otherwise adds a group
         * of one to what a screen reader announces.
         */}
        <div className="flex flex-col gap-0.5 px-2 py-2">
          {user.name ? (
            <span className="truncate font-sans text-sm font-medium text-foreground">
              {user.name}
            </span>
          ) : null}
          {user.email ? (
            <span
              className="truncate font-sans text-xs text-muted-foreground"
              data-testid="user-email"
            >
              {user.email}
            </span>
          ) : null}
        </div>

        {children ? (
          <>
            <MenuSeparator />
            {children}
          </>
        ) : null}

        {onSignOut ? (
          <>
            <MenuSeparator />
            <MenuItem onClick={onSignOut} data-testid="sign-out">
              <LogOut />
              {signOutLabel}
            </MenuItem>
          </>
        ) : null}
      </MenuContent>
    </Menu>
  );
}
