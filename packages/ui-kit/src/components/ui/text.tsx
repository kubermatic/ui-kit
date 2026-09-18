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
 * The brand typography hierarchy:
 *
 *   Ubuntu Bold  headlines  (h1–h3)
 *   Roboto Bold  sublines
 *   Roboto       general text
 *
 * Headlines and sublines are set in Title Case. That is an authoring
 * convention, not a style: `text-transform: capitalize` is deliberately NOT
 * applied, because it upper-cases every word including articles and
 * prepositions ("Deploy A Cluster"), which is not Title Case. Write the
 * casing you want into the copy.
 */
export const textVariants = cva('', {
  variants: {
    variant: {
      // Headlines — Ubuntu Bold, Aegean via the `heading` role.
      h1: 'font-display text-4xl font-bold tracking-tight text-balance text-heading',
      h2: 'font-display text-3xl font-bold tracking-tight text-balance text-heading',
      h3: 'font-display text-xl font-bold tracking-tight text-heading',
      // Sublines — Roboto Bold.
      subline: 'font-sans text-lg font-bold tracking-tight',
      // General text — Roboto.
      body: 'font-sans text-base leading-7',
      small: 'font-sans text-sm leading-6',
      code: 'rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
    },
    /**
     * Text colours are restricted to roles that clear 4.5:1 in BOTH themes.
     * Teal, Rosé and Honey are absent on purpose — they measure 1.77:1, 2.57:1
     * and 1.87:1 on white, so as text they would be illegal on a light
     * background. Use them as surfaces via `Badge` instead.
     *
     * `primary` and `destructive` resolve to the `-tone` roles, not to the
     * surfaces of the same name. A surface is tuned to carry its own label,
     * which on a dark page makes it too dark to read against `background`;
     * the tone is the same hue tuned for exactly that job.
     */
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      heading: 'text-heading',
      primary: 'text-primary-tone',
      destructive: 'text-destructive-tone',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});

/** The element each variant renders when `as` is not given. */
const defaultElement = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  subline: 'p',
  body: 'p',
  small: 'p',
  code: 'code',
} as const satisfies Record<NonNullable<VariantProps<typeof textVariants>['variant']>, ElementType>;

interface TextOwnProps extends VariantProps<typeof textVariants> {
  className?: string;
}

/**
 * Polymorphic. `as` overrides the rendered element, which otherwise defaults
 * to the semantic tag for the variant (`h2` renders `<h2>`) so visual choices
 * do not silently dictate the document outline.
 */
export type TextProps<T extends ElementType = 'p'> = PolymorphicProps<T, TextOwnProps>;

export function Text<T extends ElementType = 'p'>({
  className,
  variant,
  tone,
  weight,
  as,
  ...props
}: TextProps<T>) {
  const Component: ElementType = as ?? defaultElement[variant ?? 'body'];

  return (
    <Component
      data-slot="text"
      className={cn(textVariants({ variant, tone, weight }), className)}
      {...props}
    />
  );
}
