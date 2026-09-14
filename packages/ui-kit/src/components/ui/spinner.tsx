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

import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

export const spinnerVariants = cva('animate-spin text-current', {
  variants: {
    size: {
      sm: 'size-4',
      default: 'size-6',
      lg: 'size-10',
    },
  },
  defaultVariants: { size: 'default' },
});

export interface SpinnerProps
  extends Omit<ComponentProps<'span'>, 'children'>, VariantProps<typeof spinnerVariants> {
  /**
   * What is loading. Announced; visually hidden unless `showLabel`.
   *
   * One product's spinner renders a bare icon, so a screen reader on a loading nav
   * section is told nothing at all — the region simply appears empty until the
   * data arrives.
   */
  label?: string;
  /** Renders the label beside the spinner as well as announcing it. */
  showLabel?: boolean;
}

/**
 * Spinner — an indeterminate busy indicator.
 *
 * `role="status"` with `aria-live="polite"`, so the label is announced when it
 * appears without interrupting whatever the user is doing. Use this for a
 * region that is loading; use `Skeleton` when you know the shape of what is
 * arriving, because it does not move the layout when it resolves.
 */
export function Spinner({
  className,
  size,
  label = 'Loading',
  showLabel = false,
  ...props
}: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      role="status"
      aria-live="polite"
      className={cn('inline-flex items-center gap-2 font-sans text-sm', className)}
      {...props}
    >
      <Loader2 aria-hidden="true" className={cn(spinnerVariants({ size }))} />
      <span className={showLabel ? undefined : 'sr-only'}>{label}</span>
    </span>
  );
}
