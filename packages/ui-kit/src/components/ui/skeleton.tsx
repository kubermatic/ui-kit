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

import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * Skeleton — a loading placeholder.
 *
 * `bg-muted`, not a Tailwind palette grey. One product's version is
 * `bg-slate-200`, which is invisible on the dark palette and unreachable by
 * any theme override.
 *
 * No `role="status"`: a page full of skeletons would announce a dozen busy
 * regions. Put one `aria-busy` region around the area that is loading, which
 * is what the templates in this kit do.
 */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export interface SkeletonTextProps extends ComponentProps<'div'> {
  /** Number of lines. */
  lines?: number;
}

/**
 * SkeletonText — several lines, the last one short.
 *
 * The short last line is the detail that makes it read as a paragraph rather
 * than as a stack of bars.
 */
export function SkeletonText({ lines = 3, className, ...props }: SkeletonTextProps) {
  return (
    <div data-slot="skeleton-text" className={cn('flex flex-col gap-2', className)} {...props}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn('h-4', index === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}
