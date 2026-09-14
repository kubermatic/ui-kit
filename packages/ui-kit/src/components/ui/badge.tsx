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
import type { ElementType } from 'react';

import type { PolymorphicProps } from '../../lib/polymorphic.js';
import { cn } from '../../lib/utils.js';

/**
 * Badge — the home for the brand's highlight colours.
 *
 * Teal, Rosé and Honey are specified as highlights, and they are only legible
 * that way: each measures under 3:1 against white, so none can be text or a
 * functional border on a light background. As a filled surface carrying Dark
 * Azure they measure 10.67:1, 7.35:1 and 10.11:1 — which is what these
 * variants do.
 */
export const badgeVariants = cva(
  [
    'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden',
    'rounded-md border border-transparent px-2 py-0.5',
    'font-sans text-xs font-bold whitespace-nowrap',
    "[&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3",
  ],
  {
    variants: {
      variant: {
        accent: 'bg-accent text-accent-foreground',
        rose: 'bg-highlight-rose text-highlight-rose-foreground',
        honey: 'bg-highlight-honey text-highlight-honey-foreground',
        primary: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
      },
    },
    defaultVariants: {
      variant: 'accent',
    },
  },
);

interface BadgeOwnProps extends VariantProps<typeof badgeVariants> {
  className?: string;
}

/**
 * Polymorphic: `<Badge as="a" href="/tags/prod">` typechecks, and `href` is
 * offered by autocomplete.
 */
export type BadgeProps<T extends ElementType = 'span'> = PolymorphicProps<T, BadgeOwnProps>;

export function Badge<T extends ElementType = 'span'>({
  className,
  variant,
  as,
  ...props
}: BadgeProps<T>) {
  const Component: ElementType = as ?? 'span';

  return (
    <Component data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
