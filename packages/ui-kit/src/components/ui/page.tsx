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

import { ArrowLeft } from 'lucide-react';
import { cloneElement, useId, type ComponentProps, type ReactElement, type ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import { Breadcrumbs, type BreadcrumbEntry } from './breadcrumb.js';
import { Button, buttonVariants } from './button.js';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from './card.js';
import { Text } from './text.js';

/**
 * Page — the vertical rhythm of a route.
 *
 * Both products set the gap between the title block, the toolbar and the
 * content on every page by hand, so no two pages agree. This is the one place
 * it is decided.
 */
export function Page({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="page" className={cn('flex w-full flex-col gap-6', className)} {...props} />
  );
}

export interface BackTarget {
  label: string;
  href?: string;
  /** The router's link element, used instead of `href`. */
  render?: ReactElement<{ className?: string; children?: ReactNode }>;
  /** Handler, for a history-based back. Used when there is no href or render. */
  onClick?: () => void;
}

/**
 * BackButton — the "up one level" affordance on a detail page.
 *
 * A link when it has a destination, a button when it goes back in history.
 * One product's is always a button calling `navigate(-1)`, which cannot be
 * middle-clicked and — worse — goes somewhere unpredictable when the detail
 * page was opened directly from a bookmark or a shared URL.
 */
export function BackButton({ label, href, render, onClick }: BackTarget) {
  const content = (
    <>
      <ArrowLeft />
      {label}
    </>
  );

  /*
   * A link case and a button case, and they are built differently on purpose.
   *
   * The link is a real `<a>` carrying `buttonVariants()`, not
   * `<Button render={<a />}>` — see the note on `Button`. Going through
   * Base UI's button here would either warn or, with `nativeButton={false}`,
   * announce the anchor as a button and take away middle-click and
   * open-in-new-tab. A "Back to secrets" link is exactly the thing people
   * middle-click.
   */
  const classes = cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '-ml-2 w-fit');

  if (render) {
    return cloneElement(render, { className: cn(render.props.className, classes) }, content);
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Button variant="ghost" size="sm" className="-ml-2 w-fit" onClick={onClick}>
      {content}
    </Button>
  );
}

export interface PageHeaderProps extends Omit<ComponentProps<'div'>, 'title' | 'children'> {
  /** Trail above the title. */
  breadcrumbs?: readonly BreadcrumbEntry[];
  /** "Back to …", above the title. Usually instead of breadcrumbs, not both. */
  back?: BackTarget;
  title: ReactNode;
  description?: ReactNode;
  /** Beside the title — a `StatusBadge`, a version chip. */
  status?: ReactNode;
  /** Right-hand slot: the primary action and an overflow menu. */
  actions?: ReactNode;
  /** Rendered below everything — a `TabsList`. */
  tabs?: ReactNode;
  /** Renders the title as something other than `h1`. */
  as?: 'h1' | 'h2';
}

/**
 * PageHeader — breadcrumbs, title, status, actions, tabs.
 *
 * The title is an `<h1>` by default and there should be exactly one per route.
 * Both products currently emit either none — the page title is a `<div>` with
 * large text — or several, because each card's title is also an `<h2>` under
 * no `<h1>`. Either way the document outline a screen-reader user navigates by
 * is unusable.
 */
export function PageHeader({
  breadcrumbs,
  back,
  title,
  description,
  status,
  actions,
  tabs,
  as = 'h1',
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div data-slot="page-header" className={cn('flex flex-col gap-4', className)} {...props}>
      {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      {back ? <BackButton {...back} /> : null}

      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <Text as={as} variant="h2" className="min-w-0 break-words">
              {title}
            </Text>
            {status}
          </div>
          {description ? (
            <Text variant="small" tone="muted" className="max-w-3xl text-pretty">
              {description}
            </Text>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>

      {tabs}
    </div>
  );
}

/**
 * PageToolbar — filters and bulk actions above a list.
 *
 * Only for a list that is *not* a `DataTable`: the table has its own toolbar
 * slot, and two rows of controls stacked above each other is what happens when
 * both are used.
 */
export function PageToolbar({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="page-toolbar"
      className={cn('flex flex-wrap items-center gap-3', className)}
      {...props}
    />
  );
}

export function PageContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="page-content"
      className={cn('flex min-w-0 flex-col gap-6', className)}
      {...props}
    />
  );
}

export interface SectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  /** Top-right slot — an "Edit" button, a copy button, a menu. */
  actions?: ReactNode;
  /** Heading level. Pick the one that fits under the page's `h1`. */
  as?: 'h2' | 'h3';
  /** Removes the card surface, leaving the heading and the content. */
  plain?: boolean;
}

/**
 * Section — a titled block of a page.
 *
 * This is one product's `<Card title subtitle actions>` under a name that says
 * what it is. `Card` stayed a bare surface so the other's compound usage
 * keeps working; this is the shape the detail pages actually want, and it
 * emits a real heading rather than a styled `<h3>` floating outside the
 * outline.
 *
 * A `<section>` with an accessible name — from the heading via
 * `aria-labelledby` — is a region a screen reader can list and jump between,
 * which is how you skim a detail page with six panels on it.
 */
export function Section({
  title,
  description,
  actions,
  as = 'h2',
  plain = false,
  className,
  children,
  ...props
}: SectionProps) {
  const headingId = useId();

  const header = title ? (
    <CardHeader className={plain ? 'px-0' : undefined}>
      <CardTitle as={as} id={headingId} className="font-display text-base font-bold text-heading">
        {title}
      </CardTitle>
      {description ? <CardDescription>{description}</CardDescription> : null}
      {actions ? <CardAction>{actions}</CardAction> : null}
    </CardHeader>
  ) : null;

  const body = (
    <CardContent className={cn(plain && 'px-0', !title && !plain && 'pt-0')}>
      {children}
    </CardContent>
  );

  /*
   * `aria-labelledby` only when there is a heading to point at. A `<section>`
   * with no accessible name is not a region at all — it is skipped by the
   * landmark list, which is the correct outcome for an unlabelled block and
   * the reason this is conditional rather than always set.
   */
  const labelling = title ? { 'aria-labelledby': headingId } : {};

  if (plain) {
    return (
      <section
        data-slot="section"
        className={cn('flex flex-col gap-4', className)}
        {...labelling}
        {...props}
      >
        {header}
        {body}
      </section>
    );
  }

  return (
    <Card as="section" data-slot="section" className={className} {...labelling} {...props}>
      {header}
      {body}
    </Card>
  );
}
