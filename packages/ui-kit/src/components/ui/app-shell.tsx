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

import type { ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import { SidebarProvider, type SidebarProviderProps } from './sidebar.js';
import { SkipLink } from './skip-link.js';
import { ToastProvider, Toaster } from './toast.js';
import { TooltipProvider } from './tooltip.js';

export type AppShellLayout = 'sidebar-first' | 'header-first';

export interface AppShellProps {
  /**
   * How the sidebar and the header relate.
   *
   * - `sidebar-first` — the sidebar is full height and the header sits inside
   *   the content column beside it.
   * - `header-first` — the header spans the whole width and the sidebar starts
   *   below it.
   *
   * This is the one prop that had to exist. Both products are "a sidebar, a
   * header and a content area", and they disagree about which of the two
   * spans the corner — so a single hardcoded frame would have forced one of
   * them to rebuild it.
   */
  layout?: AppShellLayout;
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;

  /**
   * Mounts `SidebarProvider`, `TooltipProvider` and `ToastProvider`.
   *
   * Turn it off when the app needs the sidebar state outside the shell — a
   * keyboard shortcut, a persisted layout — and mount the providers yourself
   * further up. Everything here reads from context either way.
   */
  providers?: boolean;
  /** Forwarded to `SidebarProvider` when `providers` is on. */
  sidebarProps?: Omit<SidebarProviderProps, 'children'>;
  /**
   * Renders the `Toaster`.
   *
   * Defaults to whatever `providers` is, and that default is the important
   * part: `Toaster` needs a `ToastProvider` above it, so a shell that rendered
   * one while the consumer owned the providers would either crash or quietly
   * compete with the consumer's own `Toaster`. With `providers={false}` you
   * mount both yourself.
   */
  toaster?: boolean;
  /** Corner the toasts appear in. */
  toastPosition?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';

  /** Renders the skip link. */
  skipLink?: boolean;
  /** Id of the main region, and the skip link's destination. */
  mainId?: string;
  /** Padding and width constraints on the content area. */
  contentClassName?: string;
  className?: string;
}

/**
 * AppShell — the frame.
 *
 * Everything below is a composition of pieces you could assemble yourself; the
 * value is that the four things that are easy to get wrong are already right:
 *
 * - **`<main>` exists, once, with an id.** A page needs exactly one main
 *   landmark. Neither product had one — both nested the content in divs, so
 *   "jump to main content" had nothing to jump to, and one product's skip
 *   link pointed at a `<div>`.
 * - **`tabIndex={-1}` on it,** or the skip link scrolls without moving focus
 *   and the next Tab starts from the top again.
 * - **Only the content scrolls.** The sidebar and header are outside the
 *   scroll container, so a long table does not scroll the navigation away and
 *   `position: sticky` on the header works without a z-index fight.
 * - **The providers are in the right order,** with the tooltip provider above
 *   the sidebar so collapsed-rail tooltips share one delay.
 *
 *   <BrandProvider brand={brand}>
 *     <ThemeProvider>
 *       <AppShell
 *         layout="sidebar-first"
 *         sidebar={<Sidebar>…</Sidebar>}
 *         header={<AppHeader user={<UserMenu … />} />}
 *       >
 *         <Outlet />
 *       </AppShell>
 *     </ThemeProvider>
 *   </BrandProvider>
 *
 * `ThemeProvider` is deliberately *not* mounted here: it owns the `.dark`
 * class on `<html>`, which is above the shell, and an app that renders two
 * shells side by side — a tenant preview — must not get two of them.
 */
export function AppShell({
  layout = 'sidebar-first',
  sidebar,
  header,
  footer,
  children,
  providers = true,
  sidebarProps,
  toaster = providers,
  toastPosition = 'bottom-right',
  skipLink = true,
  mainId = 'main-content',
  contentClassName,
  className,
}: AppShellProps) {
  const main = (
    <main
      id={mainId}
      /* Focusable as a target only — it never appears in the tab order. */
      tabIndex={-1}
      data-slot="app-shell-main"
      className={cn('min-h-0 flex-1 overflow-y-auto outline-none', contentClassName ?? 'p-6')}
    >
      {children}
    </main>
  );

  const frame =
    layout === 'sidebar-first' ? (
      <div
        data-slot="app-shell"
        data-layout="sidebar-first"
        className={cn('flex h-dvh w-full overflow-hidden bg-background text-foreground', className)}
      >
        {sidebar}
        <div className="flex min-w-0 flex-1 flex-col">
          {header}
          {main}
          {footer}
        </div>
      </div>
    ) : (
      <div
        data-slot="app-shell"
        data-layout="header-first"
        className={cn(
          'flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground',
          className,
        )}
      >
        {header}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {sidebar}
          <div className="flex min-w-0 flex-1 flex-col">{main}</div>
        </div>
        {footer}
      </div>
    );

  const content = (
    <>
      {skipLink ? <SkipLink target={mainId} /> : null}
      {frame}
      {toaster ? <Toaster position={toastPosition} /> : null}
    </>
  );

  if (!providers) return content;

  return (
    <TooltipProvider>
      <ToastProvider>
        <SidebarProvider {...sidebarProps}>{content}</SidebarProvider>
      </ToastProvider>
    </TooltipProvider>
  );
}
