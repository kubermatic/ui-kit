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

import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

export const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md',
    'text-sm font-medium transition-colors outline-none',
    'focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
        outline:
          'border bg-background shadow-xs hover:bg-secondary hover:text-secondary-foreground',
        ghost: 'hover:bg-secondary hover:text-secondary-foreground',
        link: 'text-primary-tone underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 gap-1.5 rounded-md px-3',
        default: 'h-9 px-4 py-2',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    Omit<ComponentProps<typeof BaseButton>, 'className'>,
    VariantProps<typeof buttonVariants> {
  className?: string;
}

/**
 * Button — shadcn styling over Base UI's button primitive.
 *
 * Base UI is what gives us correct `disabled` semantics (including
 * `focusableWhenDisabled` for buttons that must stay reachable by keyboard)
 * and the `render` prop for composition.
 *
 * ### A link that looks like a button
 *
 * Use `buttonVariants()` on a real anchor, **not** `render`:
 *
 *   <a href="/docs" className={buttonVariants({ variant: 'outline' })}>Docs</a>
 *
 * This is the one case where the obvious spelling is the wrong one, so it is
 * worth being explicit about why. `render={<a href="…" />}` looks right and
 * produces a working link, but Base UI logs "expected a native <button>"
 * because `nativeButton` defaults to `true` and it can no longer attach the
 * behaviour it promised. Setting `nativeButton={false}` silences that and is
 * worse: Base UI then adds `role="button"` to the anchor, and an element
 * announced as a button but activated as a link cannot be middle-clicked,
 * copied, or opened in a new tab — the exact loss the role is claiming not to
 * cause.
 *
 * `buttonVariants` has no behaviour to attach and no opinion about the
 * element, which is why it is exported.
 */
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <BaseButton
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
