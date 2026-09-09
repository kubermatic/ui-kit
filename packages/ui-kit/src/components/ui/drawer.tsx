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

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * Drawer — a panel that slides in from an edge.
 *
 * Built on Base UI's **Dialog** rather than its `Drawer`, deliberately. The
 * dedicated primitive adds swipe-to-dismiss and snap points, which is worth
 * having for a mobile bottom sheet and is not what either product uses this
 * for: both open a right-hand panel with a resource's YAML or an error trace
 * in it. Dialog gives the same focus trap, inert background and escape
 * handling with a fraction of the API, and moving to `Drawer` later is a
 * change inside this file.
 *
 * `side="left"` is also what the app sidebar becomes below the mobile
 * breakpoint — see `Sidebar`.
 */
export const Drawer = BaseDialog.Root;
export const DrawerTrigger = BaseDialog.Trigger;
export const DrawerClose = BaseDialog.Close;

export const drawerContentVariants = cva(
  [
    'fixed z-50 flex flex-col gap-4 bg-background text-foreground shadow-lg outline-none',
    'transition-transform duration-200 ease-out',
  ],
  {
    variants: {
      side: {
        right: [
          'inset-y-0 right-0 h-full w-3/4 border-l border-border sm:max-w-md',
          'data-starting-style:translate-x-full data-ending-style:translate-x-full',
        ],
        left: [
          'inset-y-0 left-0 h-full w-3/4 border-r border-border sm:max-w-md',
          'data-starting-style:-translate-x-full data-ending-style:-translate-x-full',
        ],
        top: [
          'inset-x-0 top-0 h-auto max-h-[80dvh] border-b border-border',
          'data-starting-style:-translate-y-full data-ending-style:-translate-y-full',
        ],
        bottom: [
          'inset-x-0 bottom-0 h-auto max-h-[80dvh] border-t border-border',
          'data-starting-style:translate-y-full data-ending-style:translate-y-full',
        ],
      },
      size: {
        default: '',
        /* Wide enough for a YAML editor or a log tail. */
        lg: 'sm:max-w-2xl',
        xl: 'sm:max-w-4xl',
      },
    },
    defaultVariants: { side: 'right', size: 'default' },
  },
);

export interface DrawerContentProps
  extends
    Omit<ComponentProps<typeof BaseDialog.Popup>, 'className'>,
    VariantProps<typeof drawerContentVariants> {
  className?: string;
  showClose?: boolean;
  closeLabel?: string;
}

export function DrawerContent({
  className,
  side,
  size,
  showClose = true,
  closeLabel = 'Close',
  children,
  ...props
}: DrawerContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        className={cn(
          'fixed inset-0 z-50 bg-foreground/50 transition-opacity',
          'data-starting-style:opacity-0 data-ending-style:opacity-0',
        )}
      />
      <BaseDialog.Popup
        data-slot="drawer-content"
        className={cn(drawerContentVariants({ side, size }), className)}
        {...props}
      >
        {children}
        {showClose ? (
          <BaseDialog.Close
            aria-label={closeLabel}
            className={cn(
              'absolute top-4 right-4 flex size-7 items-center justify-center rounded-sm',
              'text-muted-foreground transition-colors outline-none',
              'hover:bg-secondary hover:text-secondary-foreground',
              'focus-visible:ring-[3px] focus-visible:ring-ring/50',
            )}
          >
            <X className="size-4" />
          </BaseDialog.Close>
        ) : null}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn('flex flex-col gap-1.5 border-b border-border px-6 py-4 pr-12', className)}
      {...props}
    />
  );
}

export function DrawerTitle({
  className,
  ...props
}: Omit<ComponentProps<typeof BaseDialog.Title>, 'className'> & { className?: string }) {
  return (
    <BaseDialog.Title
      data-slot="drawer-title"
      className={cn('font-display text-lg font-bold text-heading', className)}
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: Omit<ComponentProps<typeof BaseDialog.Description>, 'className'> & { className?: string }) {
  return (
    <BaseDialog.Description
      data-slot="drawer-description"
      className={cn('font-sans text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export function DrawerBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-body"
      className={cn('min-h-0 flex-1 overflow-y-auto px-6 py-4', className)}
      {...props}
    />
  );
}

export function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        'flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}
