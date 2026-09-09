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

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { useId, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * TooltipProvider — shares the open/close delay across every tooltip, so
 * moving along a row of icon buttons does not re-trigger the opening delay on
 * each one. Mount it once, near the root; `AppShell` already does.
 */
export const TooltipProvider = BaseTooltip.Provider;
export const TooltipRoot = BaseTooltip.Root;
export const TooltipTrigger = BaseTooltip.Trigger;

export interface TooltipContentProps extends Omit<
  ComponentProps<typeof BaseTooltip.Popup>,
  'className'
> {
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  /** Renders the little arrow. Off by default; it rarely adds anything. */
  arrow?: boolean;
}

export function TooltipContent({
  className,
  side = 'top',
  sideOffset = 6,
  arrow = false,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} sideOffset={sideOffset} className="z-50">
        <BaseTooltip.Popup
          data-slot="tooltip-content"
          className={cn(
            'max-w-xs rounded-md bg-foreground px-2.5 py-1.5',
            'font-sans text-xs text-background',
            'origin-[var(--transform-origin)] transition-[transform,scale,opacity]',
            'data-starting-style:scale-95 data-starting-style:opacity-0',
            'data-ending-style:scale-95 data-ending-style:opacity-0',
            className,
          )}
          {...props}
        >
          {arrow ? (
            <BaseTooltip.Arrow className="data-[side=bottom]:-top-1 data-[side=top]:-bottom-1">
              <span className="block size-2 rotate-45 bg-foreground" />
            </BaseTooltip.Arrow>
          ) : null}
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

export interface TooltipProps {
  /** The tooltip text. */
  content: ReactNode;
  /** The element it describes. Must accept a ref and spread its props. */
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

/**
 * Tooltip — the three-part composition, as one component, with the ARIA
 * wiring that Base UI deliberately leaves out.
 *
 * Base UI renders the popup as `role="presentation"` and sets no
 * `aria-describedby` on the trigger. That is a defensible default — a tooltip
 * duplicating a button's own label is noise — but it means the *content* is
 * unreachable to a screen reader, and the case that matters most here is the
 * one where the tooltip says something the label does not: the sidebar's
 * "disabled because you lack permission", a truncated resource name in full.
 *
 * So this wrapper gives the popup `role="tooltip"` and an id, and points the
 * trigger's `aria-describedby` at it. The compound parts
 * (`TooltipRoot` / `TooltipTrigger` / `TooltipContent`) are exported
 * unchanged, so a caller who wants Base UI's behaviour can still have it.
 *
 * A tooltip is *supplementary* either way: it is a description, not a label.
 * It must never be the only place information exists, because it is
 * unreachable by touch — an icon button still needs its own `aria-label`.
 */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const id = useId();

  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger aria-describedby={id} render={children as never} />
      <TooltipContent id={id} role="tooltip" side={side} className={className}>
        {content}
      </TooltipContent>
    </BaseTooltip.Root>
  );
}
