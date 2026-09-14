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

export interface DescriptionListProps extends ComponentProps<'dl'> {
  /**
   * `horizontal` puts the term in a fixed left column and the value beside it,
   * collapsing to stacked below `sm`. `stacked` always stacks, which is what a
   * narrow drawer or a sidebar panel needs.
   */
  orientation?: 'horizontal' | 'stacked';
}

/**
 * DescriptionList — the metadata block on every detail page.
 *
 * A real `<dl>`/`<dt>`/`<dd>`. Both products build this out of a two-column
 * `<table>` (one product's key-value-table) or nested divs (the other's detail
 * panels); a table asserts a relationship between *rows* that does not exist
 * here, and divs assert nothing at all. The list element is what lets a screen
 * reader move term-by-term and announce "Namespace, kube-system" as a pair.
 *
 * The layout lives entirely here, and `DescriptionItem` renders a bare
 * `<dt>`/`<dd>` pair with no wrapper — so in `horizontal` the terms are real
 * grid items and line up down the column. A wrapper per pair is what forces
 * people back to a table: each row then has its own grid and the columns
 * drift.
 */
export function DescriptionList({
  className,
  orientation = 'horizontal',
  ...props
}: DescriptionListProps) {
  return (
    <dl
      data-slot="description-list"
      data-orientation={orientation}
      className={cn(
        'font-sans text-sm',
        orientation === 'horizontal'
          ? [
              'grid grid-cols-1 gap-x-4 sm:grid-cols-[minmax(8rem,14rem)_1fr]',
              '[&>dt]:pt-3 [&>dt:first-child]:pt-0',
              // On the two-column layout the value shares its row with the
              // term, so it takes the same top padding; stacked below `sm` it
              // sits directly under it and takes none.
              '[&>dd]:pb-3 sm:[&>dd]:pt-3 sm:[&>dd]:pb-0 sm:[&>dt:first-child+dd]:pt-0',
            ]
          : ['flex flex-col', '[&>dt]:mt-3 [&>dt:first-child]:mt-0', '[&>dd]:mt-0.5'],
        className,
      )}
      {...props}
    />
  );
}

export interface DescriptionItemProps {
  term: ReactNode;
  children?: ReactNode;
  /** Extra classes for the `<dd>`. */
  className?: string;
  /** Extra classes for the `<dt>`. */
  termClassName?: string;
  /** Stops a long value — a token, a base64 blob — from widening the page. */
  truncate?: boolean;
}

/**
 * One term/value pair. Renders `<dt>` and `<dd>` as siblings with no wrapper,
 * so the parent's grid sees them.
 */
export function DescriptionItem({
  term,
  children,
  className,
  termClassName,
  truncate,
}: DescriptionItemProps) {
  return (
    <>
      <dt data-slot="description-term" className={cn('text-muted-foreground', termClassName)}>
        {term}
      </dt>
      <dd
        data-slot="description-details"
        className={cn('text-foreground', truncate ? 'truncate' : 'min-w-0 break-words', className)}
      >
        {children}
      </dd>
    </>
  );
}
