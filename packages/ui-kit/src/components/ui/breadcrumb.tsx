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

import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { Fragment, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * Breadcrumb — where you are in the hierarchy.
 *
 * An `<ol>` inside a labelled `<nav>`, because the order is the meaning. The
 * separators are `aria-hidden`: a screen reader reading "Organizations
 * slash Acme slash Secrets" is being read punctuation, and the list already
 * conveys the nesting.
 *
 * One product derives its breadcrumb by title-casing URL segments, which
 * produces "Eso deployments" and "Push secrets". `Breadcrumbs` takes labels
 * rather than deriving them for that reason — the route knows its own name and
 * the URL does not.
 */
export function Breadcrumb({ className, ...props }: ComponentProps<'nav'>) {
  return (
    <nav
      data-slot="breadcrumb"
      aria-label="Breadcrumb"
      className={cn('font-sans text-sm', className)}
      {...props}
    />
  );
}

export function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'flex flex-wrap items-center gap-1.5 break-words text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

/**
 * A link in the trail. Pass the router's own link component:
 *
 *   <BreadcrumbLink render={<Link to="/clusters" />}>Clusters</BreadcrumbLink>
 */
export interface BreadcrumbLinkProps extends ComponentProps<'a'> {
  /** Replaces the rendered `<a>` — for a framework link component. */
  render?: ReactNode;
}

export function BreadcrumbLink({ className, render, ...props }: BreadcrumbLinkProps) {
  const classes = cn('transition-colors hover:text-foreground', className);

  if (render) {
    /*
     * Rendered by cloning rather than through Base UI's `useRender`: a
     * breadcrumb link has no behaviour to merge, only a class, and pulling in
     * the render machinery for that would make the simple case require a
     * Base UI import in the consumer.
     */
    return (
      <span data-slot="breadcrumb-link" className={cn('contents', classes)}>
        {render}
      </span>
    );
  }

  return <a data-slot="breadcrumb-link" className={classes} {...props} />;
}

/**
 * The current page.
 *
 * Plain text with `aria-current="page"` — deliberately *not*
 * `role="link" aria-disabled="true"`, which is the common shadcn markup for
 * this. That pairing announces "Secrets, link, dimmed", claiming an
 * interactive element that does not exist and inviting the user to try
 * activating it. `aria-current` on ordinary text says the one thing that is
 * true.
 */
export function BreadcrumbPage({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn('font-medium text-foreground', className)}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({ children, className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

export function BreadcrumbEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-5 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-3.5" />
    </span>
  );
}

export interface BreadcrumbEntry {
  label: ReactNode;
  /** Omit for the current page, which renders as text. */
  href?: string;
  /** A framework link element, used instead of a plain `<a href>`. */
  render?: ReactNode;
}

export interface BreadcrumbsProps extends Omit<ComponentProps<'nav'>, 'children'> {
  items: readonly BreadcrumbEntry[];
}

/**
 * Breadcrumbs — the data-driven form, which is what a page template needs.
 *
 * The last entry is always the current page regardless of whether it has an
 * `href`: a trail whose final item links to the page you are already on is a
 * link that does nothing.
 */
export function Breadcrumbs({ items, ...props }: BreadcrumbsProps) {
  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          /*
           * The separator is a sibling `<li>`, not nested inside the item: an
           * `<li>` inside an `<li>` is invalid, and a screen reader announcing
           * "list of 3 items" would be counting separators as entries.
           */
          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href} render={item.render}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {isLast ? null : <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
