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

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * Popover — an anchored panel with interactive content.
 *
 * Distinct from `Tooltip`, which is a description and cannot hold anything
 * focusable, and from `Menu`, which is a list of commands with arrow-key
 * navigation. This is the one that holds a form: an organisation selector
 * and its metadata filter are both popovers.
 */
export const Popover = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverClose = BasePopover.Close;

export interface PopoverContentProps extends Omit<
  ComponentProps<typeof BasePopover.Popup>,
  'className'
> {
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export function PopoverContent({
  className,
  side = 'bottom',
  align = 'center',
  sideOffset = 6,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50 outline-none"
      >
        <BasePopover.Popup
          data-slot="popover-content"
          className={cn(
            'max-h-[var(--available-height)] w-72 overflow-y-auto',
            'rounded-md border border-border bg-background p-4 text-foreground shadow-md outline-none',
            'origin-[var(--transform-origin)] transition-[transform,scale,opacity]',
            'data-starting-style:scale-95 data-starting-style:opacity-0',
            'data-ending-style:scale-95 data-ending-style:opacity-0',
            className,
          )}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export function PopoverTitle({
  className,
  ...props
}: Omit<ComponentProps<typeof BasePopover.Title>, 'className'> & { className?: string }) {
  return (
    <BasePopover.Title
      data-slot="popover-title"
      className={cn('font-sans text-sm leading-none font-semibold', className)}
      {...props}
    />
  );
}

export function PopoverDescription({
  className,
  ...props
}: Omit<ComponentProps<typeof BasePopover.Description>, 'className'> & { className?: string }) {
  return (
    <BasePopover.Description
      data-slot="popover-description"
      className={cn('font-sans text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}
