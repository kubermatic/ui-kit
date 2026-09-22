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
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * Dialog — a modal.
 *
 * Base UI owns the parts that are easy to get wrong and impossible to notice
 * in manual testing: the focus trap, restoring focus to the trigger on close,
 * `aria-modal`, and marking the rest of the page inert so a screen reader's
 * virtual cursor cannot wander out of the dialog while it is open.
 *
 * `Dialog.Title` and `Dialog.Description` are not decoration — they are what
 * `aria-labelledby` and `aria-describedby` point at, wired automatically by
 * being inside the popup. A dialog rendered without a `DialogTitle` is
 * announced as "dialog" and nothing else, which is the state of several
 * existing product dialogs.
 */
export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

export const dialogContentVariants = cva(
  [
    'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
    'flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] flex-col gap-4',
    'rounded-lg border border-border bg-background p-6 text-foreground shadow-lg outline-none',
    'transition-[transform,scale,opacity]',
    'data-starting-style:scale-95 data-starting-style:opacity-0',
    'data-ending-style:scale-95 data-ending-style:opacity-0',
  ],
  {
    variants: {
      size: {
        sm: 'sm:max-w-sm',
        default: 'sm:max-w-lg',
        lg: 'sm:max-w-2xl',
        xl: 'sm:max-w-4xl',
        /* For an editor or a graph — the cases that want the full screen. */
        full: 'sm:h-[calc(100dvh-4rem)] sm:max-h-none sm:w-[calc(100vw-4rem)] sm:max-w-none',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export interface DialogContentProps
  extends
    Omit<ComponentProps<typeof BaseDialog.Popup>, 'className'>,
    VariantProps<typeof dialogContentVariants> {
  className?: string;
  /** Renders the corner close button. */
  showClose?: boolean;
  closeLabel?: string;
}

export function DialogContent({
  className,
  size,
  showClose = true,
  closeLabel = 'Close',
  children,
  ...props
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        className={cn(
          'fixed inset-0 z-50 bg-foreground/50 transition-opacity',
          'data-starting-style:opacity-0 data-ending-style:opacity-0',
        )}
      />
      <BaseDialog.Popup
        data-slot="dialog-content"
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {showClose ? (
          <BaseDialog.Close
            aria-label={closeLabel}
            className={cn(
              'absolute top-4 right-4 flex size-7 cursor-pointer items-center justify-center rounded-sm',
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

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-1.5 pr-8 text-left', className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: Omit<ComponentProps<typeof BaseDialog.Title>, 'className'> & { className?: string }) {
  return (
    <BaseDialog.Title
      data-slot="dialog-title"
      className={cn('font-display text-lg font-bold text-heading', className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: Omit<ComponentProps<typeof BaseDialog.Description>, 'className'> & { className?: string }) {
  return (
    <BaseDialog.Description
      data-slot="dialog-description"
      className={cn('font-sans text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

/** Scrolls its own content, so the header and footer stay put on a long form. */
export function DialogBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-body"
      className={cn('-mx-6 min-h-0 flex-1 overflow-y-auto px-6', className)}
      {...props}
    />
  );
}

export interface DialogFooterProps extends ComponentProps<'div'> {
  children?: ReactNode;
}

export function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}
