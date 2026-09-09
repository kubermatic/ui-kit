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

import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import { SidebarTrigger, useSidebar } from './sidebar.js';

export interface AppHeaderProps extends Omit<ComponentProps<'header'>, 'children'> {
  /**
   * Left-hand slot, for a `header-first` layout where the header spans the
   * corner and so owns the brand. Pass `<Logo />`.
   *
   * There is no default: in a `sidebar-first` layout the sidebar already shows
   * the brand, and a second copy in the header would be wrong. Omit it there.
   *
   * Do **not** pass `<SidebarBrand />` here. It swaps the lockup for the
   * square mark when the rail collapses, which is right inside a 3.5rem rail
   * and wrong in a full-width header — and it requires a `SidebarProvider`,
   * which a header on a sign-in page does not have.
   */
  brand?: ReactNode;
  /** Middle slot — breadcrumbs, a page title, a search box. */
  children?: ReactNode;
  /** Right-hand controls: an org selector, a cluster picker, a "New" button. */
  actions?: ReactNode;
  /** Far right, after a divider. `UserMenu` goes here. */
  user?: ReactNode;
  /**
   * When to show the sidebar trigger.
   *
   * `mobile` is the default and the right answer for a `header-first` layout:
   * the rail has its own trigger on desktop, and the header's would be a
   * second control for the same thing.
   */
  sidebarTrigger?: 'never' | 'mobile' | 'always';
  /** Sticks to the top of the scroll container. */
  sticky?: boolean;
  height?: string;
}

/**
 * AppHeader — the top bar.
 *
 * Slots rather than a fixed composition, because the two products put
 * different things here and neither is wrong: one has the brand, an
 * organisation selector and the user menu; the other has a breadcrumb, a
 * cluster picker, a namespace picker and the user menu. Both are
 * `brand` / `children` / `actions` / `user`.
 *
 * A real `<header>`, which is a `banner` landmark — so "jump to banner" works
 * and the header is not just the first `<div>` on the page.
 */
export function AppHeader({
  brand,
  children,
  actions,
  user,
  sidebarTrigger = 'mobile',
  sticky = true,
  height = '3.5rem',
  className,
  ...props
}: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      style={{ ['--header-height' as string]: height }}
      className={cn(
        'z-30 flex h-[var(--header-height)] w-full shrink-0 items-center gap-3',
        'border-b border-border bg-background px-4',
        sticky && 'sticky top-0',
        className,
      )}
      {...props}
    >
      <HeaderTrigger mode={sidebarTrigger} />

      {brand ? <div className="flex shrink-0 items-center">{brand}</div> : null}

      <div className="flex min-w-0 flex-1 items-center gap-3">{children}</div>

      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}

      {user ? (
        <div className="flex shrink-0 items-center gap-2 border-l border-border pl-3">{user}</div>
      ) : null}
    </header>
  );
}

/**
 * The trigger, or nothing.
 *
 * Split into its own component because `useSidebar` throws outside a provider,
 * and `AppHeader` has to stay usable on a page with no sidebar at all — a sign-in
 * screen, a standalone tool. Calling the hook here means the `never` case
 * never reaches it.
 */
function HeaderTrigger({ mode }: { mode: 'never' | 'mobile' | 'always' }) {
  if (mode === 'never') return null;
  return <HeaderTriggerInner mode={mode} />;
}

function HeaderTriggerInner({ mode }: { mode: 'mobile' | 'always' }) {
  const { isMobile } = useSidebar();
  if (mode === 'mobile' && !isMobile) return null;
  return <SidebarTrigger />;
}
