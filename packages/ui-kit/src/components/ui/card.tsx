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

import type { ComponentProps, ElementType } from 'react';

import type { PolymorphicProps } from '../../lib/polymorphic.js';
import { cn } from '../../lib/utils.js';

/**
 * Card — the bordered surface.
 *
 * Compound parts rather than `title`/`actions` props, deliberately: the parts
 * match what one product already imports from its own `components/ui/card`, so
 * migrating that app is a change of import specifier and nothing else.
 *
 * The other's `<Card title subtitle actions>` shape is a *page section*, not
 * a surface, and it is `Section` in the layout layer. Keeping them apart is
 * what stops this component growing a header it renders sometimes.
 *
 * `bg-background` with a hairline, not `bg-muted`: a card on a page is the
 * same plane as the page, and `muted` is for a well *inside* one. Pass
 * `className="bg-muted"` for the recessed look — `muted`/`muted-foreground` is
 * a measured pair.
 *
 * Polymorphic, because a card that *is* a labelled region of the page should
 * be a `<section>` — which is what `Section` renders it as.
 */
export type CardProps<T extends ElementType = 'div'> = PolymorphicProps<T, { className?: string }>;

export function Card<T extends ElementType = 'div'>({ className, as, ...props }: CardProps<T>) {
  const Component: ElementType = as ?? 'div';
  return (
    <Component
      data-slot="card"
      className={cn(
        'flex flex-col gap-6 rounded-lg border border-border bg-background py-6 text-foreground shadow-xs',
        className,
      )}
      {...props}
    />
  );
}

/**
 * Grid rather than flex, so `CardAction` can sit in a second column on the
 * first row without the title's text wrapping under it.
 */
export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6',
        'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        className,
      )}
      {...props}
    />
  );
}

/**
 * Polymorphic for the same reason: a card title is usually the heading of its
 * region, and a `<div>` with bold text is not in the document outline.
 */
export type CardTitleProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  { className?: string }
>;

export function CardTitle<T extends ElementType = 'div'>({
  className,
  as,
  ...props
}: CardTitleProps<T>) {
  const Component: ElementType = as ?? 'div';
  return (
    <Component
      data-slot="card-title"
      className={cn('font-sans leading-none font-semibold', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('font-sans text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

/** Top-right slot of the header — a menu, a "New" button, a status badge. */
export function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}
