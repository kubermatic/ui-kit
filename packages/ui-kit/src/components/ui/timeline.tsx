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
import { statusDotVariants, type StatusTone } from './status-badge.js';

export type TimelineProps = ComponentProps<'ol'>;

/**
 * Timeline — a chronological list of events.
 *
 * A sync history, and both products' Kubernetes event lists. An
 * `<ol>`, because the order is the content: reversed chronology is a claim
 * about the data, and a `<ul>` does not make it.
 *
 * The connecting line is drawn with a pseudo-element on each item rather than
 * an absolutely-positioned rail on the container, so an item of any height
 * connects to the next one and the last item's line stops rather than
 * dangling.
 */
export function Timeline({ className, ...props }: TimelineProps) {
  return (
    <ol
      data-slot="timeline"
      className={cn('flex flex-col font-sans text-sm', className)}
      {...props}
    />
  );
}

export interface TimelineItemProps extends Omit<ComponentProps<'li'>, 'title'> {
  /** Colour of the marker. Same tone vocabulary as `StatusBadge`. */
  tone?: StatusTone;
  title: ReactNode;
  /** When it happened. Pass a formatted string, or a `<time>` element. */
  timestamp?: ReactNode;
  /** Replaces the dot — an icon, a small avatar. */
  marker?: ReactNode;
  children?: ReactNode;
}

export function TimelineItem({
  className,
  tone = 'neutral',
  title,
  timestamp,
  marker,
  children,
  ...props
}: TimelineItemProps) {
  return (
    <li
      data-slot="timeline-item"
      className={cn(
        'relative grid grid-cols-[auto_1fr] gap-x-3 pb-5 last:pb-0',
        // The rail: from below the marker to the bottom of the item. Hidden on
        // the last item so the line ends with the list.
        'before:absolute before:top-5 before:bottom-0 before:left-[0.3125rem] before:w-px before:bg-border',
        'last:before:hidden',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="z-1 mt-1.5 flex size-2.5 items-center justify-center [&_svg]:size-3"
      >
        {marker ?? <span className={cn(statusDotVariants({ tone, size: 'default' }))} />}
      </span>

      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span data-slot="timeline-title" className="font-medium text-foreground">
            {title}
          </span>
          {timestamp ? (
            <span
              data-slot="timeline-timestamp"
              className="text-xs whitespace-nowrap text-muted-foreground"
            >
              {timestamp}
            </span>
          ) : null}
        </div>
        {children ? (
          <div data-slot="timeline-body" className="text-muted-foreground break-words">
            {children}
          </div>
        ) : null}
      </div>
    </li>
  );
}
