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

import {
  Menu as BaseMenu,
  type MenuTriggerProps as BaseMenuTriggerProps,
} from '@base-ui/react/menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * Menu — a list of commands, anchored to a trigger.
 *
 * The row-actions "⋯" button on every table in both products. Base UI gives it
 * the parts that make it a menu rather than a list of buttons in a box: arrow
 * keys move between items, typing jumps to an item, Escape closes and returns
 * focus to the trigger, and the items are `role="menuitem"` inside a
 * `role="menu"` so the count is announced.
 *
 * Use `MenuLinkItem` for anything that navigates. A `MenuItem` with an
 * `onClick` that calls `router.push` is not a link: it cannot be
 * middle-clicked, copied, or opened in a new tab.
 */
export const Menu = BaseMenu.Root;
export const MenuGroup = BaseMenu.Group;
export const MenuRadioGroup = BaseMenu.RadioGroup;
export const MenuSub = BaseMenu.SubmenuRoot;

export type MenuTriggerProps<Payload = unknown> = BaseMenuTriggerProps<Payload>;

/**
 * The control that opens the menu.
 *
 * Carries no appearance of its own — the "⋯" it usually is, and the avatar or
 * `Button` it sometimes is, look nothing alike, so the caller styles it. The
 * one thing it says is that it can be clicked: no UA stylesheet gives a
 * `<button>` the pointer cursor, which left every consumer adding
 * `cursor-pointer` by hand and looking inert wherever one forgot.
 *
 * Base UI's own props pass straight through, `className` callback and
 * `payload` generic included, because narrowing either to add one utility
 * class would cost more than the class is worth.
 */
export function MenuTrigger<Payload>({ className, ...props }: MenuTriggerProps<Payload>) {
  return (
    <BaseMenu.Trigger
      data-slot="menu-trigger"
      className={
        typeof className === 'function'
          ? (state) => cn('cursor-pointer', className(state))
          : cn('cursor-pointer', className)
      }
      {...props}
    />
  );
}

const popupClasses = [
  'min-w-[10rem] max-h-[var(--available-height)] overflow-y-auto',
  'rounded-md border border-border bg-background p-1 text-foreground shadow-md outline-none',
  'origin-[var(--transform-origin)] transition-[transform,scale,opacity]',
  'data-starting-style:scale-95 data-starting-style:opacity-0',
  'data-ending-style:scale-95 data-ending-style:opacity-0',
];

const itemClasses = [
  'relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5',
  'font-sans text-sm outline-none select-none',
  'data-highlighted:bg-secondary data-highlighted:text-secondary-foreground',
  'data-disabled:pointer-events-none data-disabled:opacity-50',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
];

/**
 * `destructive` uses the `destructive` text tone on `background`, which is a
 * measured pair. On hover it stays that tone over `secondary` rather than
 * inverting to a filled red row — an accidental hover should not look like the
 * action already happened.
 */
const destructiveClasses = 'text-destructive-tone data-highlighted:text-destructive-tone';

export interface MenuContentProps extends Omit<ComponentProps<typeof BaseMenu.Popup>, 'className'> {
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export function MenuContent({
  className,
  side = 'bottom',
  align = 'end',
  sideOffset = 4,
  ...props
}: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50 outline-none"
      >
        <BaseMenu.Popup
          data-slot="menu-content"
          className={cn(popupClasses, className)}
          {...props}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export interface MenuItemProps extends Omit<ComponentProps<typeof BaseMenu.Item>, 'className'> {
  className?: string;
  variant?: 'default' | 'destructive';
}

export function MenuItem({ className, variant = 'default', ...props }: MenuItemProps) {
  return (
    <BaseMenu.Item
      data-slot="menu-item"
      className={cn(itemClasses, variant === 'destructive' && destructiveClasses, className)}
      {...props}
    />
  );
}

export interface MenuLinkItemProps extends Omit<
  ComponentProps<typeof BaseMenu.LinkItem>,
  'className'
> {
  className?: string;
  variant?: 'default' | 'destructive';
}

/**
 * A menu item that is a real anchor. Pass your router's link through `render`:
 *
 *   <MenuLinkItem render={<Link href="/settings" />}>Settings</MenuLinkItem>
 */
export function MenuLinkItem({ className, variant = 'default', ...props }: MenuLinkItemProps) {
  return (
    <BaseMenu.LinkItem
      data-slot="menu-link-item"
      className={cn(itemClasses, variant === 'destructive' && destructiveClasses, className)}
      {...props}
    />
  );
}

/**
 * The label of a group of items.
 *
 * **Must be inside `MenuGroup`** — Base UI throws otherwise, because the label
 * is what gets wired to the group's `aria-labelledby`. For a header that
 * merely identifies something at the top of a menu (an account, a resource
 * name), use a plain element instead: it is not labelling a group, and
 * claiming it does adds a group of one to what a screen reader announces.
 */
export function MenuGroupLabel({
  className,
  ...props
}: Omit<ComponentProps<typeof BaseMenu.GroupLabel>, 'className'> & { className?: string }) {
  return (
    <BaseMenu.GroupLabel
      data-slot="menu-group-label"
      className={cn('px-2 py-1.5 font-sans text-xs font-medium text-muted-foreground', className)}
      {...props}
    />
  );
}

export function MenuSeparator({
  className,
  ...props
}: Omit<ComponentProps<typeof BaseMenu.Separator>, 'className'> & { className?: string }) {
  return (
    <BaseMenu.Separator
      data-slot="menu-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

export function MenuCheckboxItem({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof BaseMenu.CheckboxItem>, 'className'> & { className?: string }) {
  return (
    <BaseMenu.CheckboxItem
      data-slot="menu-checkbox-item"
      className={cn(itemClasses, 'pl-8', className)}
      {...props}
    >
      <BaseMenu.CheckboxItemIndicator className="absolute left-2 flex items-center justify-center">
        <Check className="size-4" />
      </BaseMenu.CheckboxItemIndicator>
      {children}
    </BaseMenu.CheckboxItem>
  );
}

export function MenuRadioItem({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof BaseMenu.RadioItem>, 'className'> & { className?: string }) {
  return (
    <BaseMenu.RadioItem
      data-slot="menu-radio-item"
      className={cn(itemClasses, 'pl-8', className)}
      {...props}
    >
      <BaseMenu.RadioItemIndicator className="absolute left-2 flex items-center justify-center">
        <Circle className="size-2 fill-current" />
      </BaseMenu.RadioItemIndicator>
      {children}
    </BaseMenu.RadioItem>
  );
}

export function MenuSubTrigger({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof BaseMenu.SubmenuTrigger>, 'className'> & { className?: string }) {
  return (
    <BaseMenu.SubmenuTrigger
      data-slot="menu-sub-trigger"
      className={cn(itemClasses, 'data-popup-open:bg-secondary', className)}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4" />
    </BaseMenu.SubmenuTrigger>
  );
}

export function MenuSubContent({ className, ...props }: MenuContentProps) {
  return <MenuContent side="right" align="start" sideOffset={0} className={className} {...props} />;
}
