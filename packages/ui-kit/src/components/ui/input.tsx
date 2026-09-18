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

import { Input as BaseInput } from '@base-ui/react/input';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

export const inputVariants = cva(
  [
    'flex w-full min-w-0 rounded-md border border-input bg-background',
    'font-sans text-sm text-foreground shadow-xs transition-[color,box-shadow]',
    'placeholder:text-muted-foreground',
    'outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
    // Base UI sets `aria-invalid` from the Field's validity, so an invalid
    // control is styled without the consumer wiring anything up.
    'aria-invalid:border-destructive-tone aria-invalid:ring-destructive-tone/30',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 py-1',
        default: 'h-9 px-3 py-1',
        lg: 'h-10 px-4 py-2',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export interface InputProps
  extends
    Omit<ComponentProps<typeof BaseInput>, 'className' | 'size'>,
    VariantProps<typeof inputVariants> {
  className?: string;
  /** Icon or adornment inside the leading edge — a magnifier on a search box. */
  startAdornment?: ReactNode;
  /** Icon or adornment inside the trailing edge — a clear button, a unit. */
  endAdornment?: ReactNode;
}

/**
 * Input — Base UI's input, which wires itself to an enclosing `Field`.
 *
 * The adornment props exist because both products hand-roll the same
 * absolutely-positioned magnifier over a padded input on every table toolbar.
 * When either is present the input is wrapped in a relative container and the
 * padding is widened on that side; when neither is, the markup is a bare
 * `<input>` and there is no wrapper to fight with in a flex layout.
 */
export function Input({ className, size, startAdornment, endAdornment, ...props }: InputProps) {
  const input = (
    <BaseInput
      data-slot="input"
      className={cn(
        inputVariants({ size }),
        startAdornment && 'pl-9',
        endAdornment && 'pr-9',
        className,
      )}
      {...props}
    />
  );

  if (!startAdornment && !endAdornment) return input;

  return (
    <div data-slot="input-wrapper" className="relative w-full">
      {startAdornment ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center text-muted-foreground [&_svg]:size-4"
        >
          {startAdornment}
        </span>
      ) : null}
      {input}
      {endAdornment ? (
        <span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center text-muted-foreground [&_svg]:size-4">
          {endAdornment}
        </span>
      ) : null}
    </div>
  );
}
