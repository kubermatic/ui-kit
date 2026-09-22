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

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

export interface ToggleGroupProps extends Omit<
  ComponentProps<typeof BaseToggleGroup>,
  'className'
> {
  className?: string;
}

/**
 * ToggleGroup — a segmented control. Used for view switches: table/grid,
 * light/dark/system, YAML/form.
 *
 * Distinct from `Switch`, which changes a setting. This changes a selection,
 * and Base UI gives it the roving-tabindex behaviour that implies: one tab
 * stop for the group, arrow keys within it.
 */
export function ToggleGroup({ className, ...props }: ToggleGroupProps) {
  return (
    <BaseToggleGroup
      data-slot="toggle-group"
      className={cn(
        'inline-flex items-center gap-1 rounded-md border border-input bg-background p-1 shadow-xs',
        className,
      )}
      {...props}
    />
  );
}

export interface ToggleGroupItemProps extends Omit<ComponentProps<typeof Toggle>, 'className'> {
  className?: string;
}

export function ToggleGroupItem({ className, ...props }: ToggleGroupItemProps) {
  return (
    <Toggle
      data-slot="toggle-group-item"
      className={cn(
        'inline-flex h-7 min-w-7 cursor-pointer items-center justify-center gap-1.5 rounded-sm px-2',
        'font-sans text-sm font-medium whitespace-nowrap transition-colors outline-none',
        'hover:bg-secondary hover:text-secondary-foreground',
        'focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'data-pressed:bg-primary data-pressed:text-primary-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}
