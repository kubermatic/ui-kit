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

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

export interface ScrollAreaProps extends Omit<
  ComponentProps<typeof BaseScrollArea.Root>,
  'className'
> {
  className?: string;
  orientation?: 'vertical' | 'horizontal' | 'both';
}

/**
 * ScrollArea — a scroll container with a styled scrollbar.
 *
 * Worth the component only where a native scrollbar would be intrusive: a
 * scrolling popover, the sidebar's nav list. Base UI keeps the *native*
 * scrolling behaviour — momentum, wheel, keyboard, screen-reader scroll — and
 * only replaces the bar's appearance, which is the part custom scroll
 * implementations get wrong.
 *
 * For a page, use plain `overflow-y-auto`. Replacing the document scrollbar
 * costs more than it buys.
 */
export function ScrollArea({
  className,
  orientation = 'vertical',
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <BaseScrollArea.Root
      data-slot="scroll-area"
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <BaseScrollArea.Viewport className="size-full overscroll-contain rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
        <BaseScrollArea.Content>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>

      {orientation !== 'horizontal' ? (
        <BaseScrollArea.Scrollbar
          orientation="vertical"
          className="flex w-2 justify-center opacity-0 transition-opacity delay-300 data-hovering:opacity-100 data-hovering:delay-0 data-scrolling:opacity-100 data-scrolling:delay-0"
        >
          <BaseScrollArea.Thumb className="w-1 rounded-full bg-border" />
        </BaseScrollArea.Scrollbar>
      ) : null}

      {orientation !== 'vertical' ? (
        <BaseScrollArea.Scrollbar
          orientation="horizontal"
          className="flex h-2 items-center opacity-0 transition-opacity delay-300 data-hovering:opacity-100 data-hovering:delay-0 data-scrolling:opacity-100 data-scrolling:delay-0"
        >
          <BaseScrollArea.Thumb className="h-1 rounded-full bg-border" />
        </BaseScrollArea.Scrollbar>
      ) : null}

      {orientation === 'both' ? <BaseScrollArea.Corner /> : null}
    </BaseScrollArea.Root>
  );
}
