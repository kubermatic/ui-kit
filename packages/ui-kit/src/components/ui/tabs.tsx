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

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * Tabs — the detail-page section switcher.
 *
 * One product's `DetailTabs` is a row of `<button>`s with an `onChange`, which
 * gives no `role="tablist"`, no arrow-key movement between tabs, and no
 * `aria-controls` linking a tab to its panel — so a screen reader announces
 * four unrelated buttons and the panel below them is not connected to any of
 * them. Base UI supplies all of it.
 *
 * Two visual variants, because both products have both: `underline` for
 * page-level sections (the detail pages), `pill` for a segmented switch inside
 * a panel.
 */
export const Tabs = BaseTabs.Root;

export const tabsListVariants = cva('flex items-center', {
  variants: {
    variant: {
      underline: 'gap-4 border-b border-border',
      pill: 'w-fit gap-1 rounded-md bg-muted p-1',
    },
  },
  defaultVariants: { variant: 'underline' },
});

export interface TabsListProps
  extends
    Omit<ComponentProps<typeof BaseTabs.List>, 'className'>,
    VariantProps<typeof tabsListVariants> {
  className?: string;
}

export function TabsList({ className, variant, ...props }: TabsListProps) {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      data-variant={variant ?? 'underline'}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

export const tabsTabVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-sans text-sm font-medium transition-colors outline-none',
    'focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        underline: [
          /* `min-h-9` rather than padding alone: WCAG 2.2 SC 2.5.8 wants a
           * 24px target and the axe run measures it with real geometry. */
          '-mb-px min-h-9 border-b-2 border-transparent px-1 text-muted-foreground',
          'hover:border-border hover:text-foreground',
          'data-selected:border-primary data-selected:text-primary',
        ],
        pill: [
          'min-h-7 rounded-sm px-3 text-muted-foreground',
          'hover:text-foreground',
          'data-selected:bg-background data-selected:text-foreground data-selected:shadow-xs',
        ],
      },
    },
    defaultVariants: { variant: 'underline' },
  },
);

export interface TabsTabProps
  extends
    Omit<ComponentProps<typeof BaseTabs.Tab>, 'className'>,
    VariantProps<typeof tabsTabVariants> {
  className?: string;
}

export function TabsTab({ className, variant, ...props }: TabsTabProps) {
  return (
    <BaseTabs.Tab
      data-slot="tabs-tab"
      className={cn(tabsTabVariants({ variant }), className)}
      {...props}
    />
  );
}

export function TabsPanel({
  className,
  ...props
}: Omit<ComponentProps<typeof BaseTabs.Panel>, 'className'> & { className?: string }) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-panel"
      className={cn(
        'flex-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    />
  );
}
