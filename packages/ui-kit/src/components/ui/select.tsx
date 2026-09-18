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

import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * Select — Base UI's select, styled.
 *
 * Exposed as parts rather than a single configured component, because the
 * two products need genuinely different item rendering: one puts a role
 * description and an icon in each row, the other puts a connection-status
 * dot after the cluster name. A single `options` prop would have grown a
 * `renderOption` escape hatch within a week.
 *
 * For the common toolbar case — a flat list of strings filtering a table —
 * use `FilterSelect`, which is that configured component and says so.
 *
 * Pass `items` whenever a value and its label differ. It is how Base UI maps
 * the selected value back to a label for the closed trigger; without it
 * `SelectValue` renders the raw value, so a `namespaced`/`Namespaced` pair
 * shows the machine string to the user. `FilterSelect` does this for you —
 * composing the parts yourself means remembering it.
 *
 *   <Select value={ns} onValueChange={setNs} items={options}>
 *     <SelectTrigger><SelectValue placeholder="Namespace" /></SelectTrigger>
 *     <SelectContent>
 *       <SelectItem value="default">default</SelectItem>
 *     </SelectContent>
 *   </Select>
 */
export const Select = BaseSelect.Root;
export const SelectGroup = BaseSelect.Group;
export const SelectValue = BaseSelect.Value;

export type SelectTriggerProps = Omit<ComponentProps<typeof BaseSelect.Trigger>, 'className'> & {
  className?: string;
  size?: 'sm' | 'default';
};

export function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3',
        'font-sans text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none',
        'data-[size=default]:h-9 data-[size=sm]:h-8',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive-tone aria-invalid:ring-destructive-tone/30',
        // The placeholder is rendered by Select.Value, so the muted colour has
        // to be selected on the trigger's own placeholder state.
        'data-placeholder:text-muted-foreground',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        className,
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon className="text-muted-foreground">
        <ChevronDown className="size-4" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export type SelectContentProps = Omit<ComponentProps<typeof BaseSelect.Popup>, 'className'> & {
  className?: string;
  /** Distance from the trigger, in pixels. */
  sideOffset?: number;
  /** Aligns the popup's width to the trigger's. */
  matchTriggerWidth?: boolean;
};

export function SelectContent({
  className,
  sideOffset = 4,
  matchTriggerWidth = true,
  children,
  ...props
}: SelectContentProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        sideOffset={sideOffset}
        alignItemWithTrigger={false}
        className="z-50 outline-none"
      >
        <BaseSelect.ScrollUpArrow className="flex h-6 cursor-default items-center justify-center bg-background text-muted-foreground">
          <ChevronUp className="size-4" />
        </BaseSelect.ScrollUpArrow>
        <BaseSelect.Popup
          data-slot="select-content"
          className={cn(
            'max-h-[min(24rem,var(--available-height))] min-w-[8rem] overflow-y-auto',
            'rounded-md border border-border bg-background p-1 text-foreground shadow-md outline-none',
            matchTriggerWidth && 'w-[var(--anchor-width)]',
            'origin-[var(--transform-origin)] transition-[transform,scale,opacity]',
            'data-starting-style:scale-95 data-starting-style:opacity-0',
            'data-ending-style:scale-95 data-ending-style:opacity-0',
            className,
          )}
          {...props}
        >
          <BaseSelect.List>{children}</BaseSelect.List>
        </BaseSelect.Popup>
        <BaseSelect.ScrollDownArrow className="flex h-6 cursor-default items-center justify-center bg-background text-muted-foreground">
          <ChevronDown className="size-4" />
        </BaseSelect.ScrollDownArrow>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export type SelectItemProps = Omit<ComponentProps<typeof BaseSelect.Item>, 'className'> & {
  className?: string;
};

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2',
        'font-sans text-sm outline-none select-none',
        'data-highlighted:bg-secondary data-highlighted:text-secondary-foreground',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText className="flex flex-1 items-center gap-2">
        {children}
      </BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="absolute right-2 flex items-center justify-center">
        <Check className="size-4" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export function SelectGroupLabel({
  className,
  ...props
}: Omit<ComponentProps<typeof BaseSelect.GroupLabel>, 'className'> & { className?: string }) {
  return (
    <BaseSelect.GroupLabel
      data-slot="select-group-label"
      className={cn('px-2 py-1.5 font-sans text-xs font-medium text-muted-foreground', className)}
      {...props}
    />
  );
}

export function SelectSeparator({
  className,
  ...props
}: Omit<ComponentProps<typeof BaseSelect.Separator>, 'className'> & { className?: string }) {
  return (
    <BaseSelect.Separator
      data-slot="select-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

/** An option as `{ value, label }`, or a bare string when the two are equal. */
export type SelectOption = string | { value: string; label: ReactNode };

const optionValue = (option: SelectOption) => (typeof option === 'string' ? option : option.value);
const optionLabel = (option: SelectOption) => (typeof option === 'string' ? option : option.label);

export interface FilterSelectProps {
  /** Inline label rendered before the control. */
  label?: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'default';
  className?: string;
  /** Width of the trigger. Toolbar filters need a fixed width to stop jitter. */
  triggerClassName?: string;
  'data-testid'?: string;
}

/**
 * FilterSelect — the configured single-select both products' table toolbars
 * want: an inline label, a flat option list, a string value.
 *
 * It exists so that the fifty filter dropdowns across the two apps are not
 * fifty hand-assembled `Select` compositions that drift apart. Anything more
 * elaborate than a flat list should compose `Select` directly instead of
 * adding a prop here.
 */
export function FilterSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  size = 'sm',
  className,
  triggerClassName,
  'data-testid': testId,
}: FilterSelectProps) {
  const labelId = useId();

  return (
    <div
      data-slot="filter-select"
      className={cn('flex items-center gap-2 font-sans text-sm', className)}
    >
      {label ? (
        <span id={labelId} className="whitespace-nowrap text-muted-foreground">
          {label}
        </span>
      ) : null}
      <Select
        value={value}
        onValueChange={(next) => onValueChange(next as string)}
        /*
         * `items` is load-bearing, not a convenience: it is how Base UI maps
         * the selected *value* back to its label for the trigger display.
         * Without it `SelectValue` renders the raw value, so an option of
         * `{ value: 'degraded', label: 'Needs attention' }` shows "degraded".
         */
        items={options.map((option) => ({
          value: optionValue(option),
          label: optionLabel(option),
        }))}
      >
        <SelectTrigger
          size={size}
          className={cn('w-40', triggerClassName)}
          data-testid={testId}
          /*
           * The inline label has to be *associated*, not merely adjacent.
           * Rendering "Status" beside the control and stopping there is what
           * both products do, and it leaves the trigger with an accessible
           * name of whatever value happens to be selected — so a row of four
           * filters announces "All, All, Synced, All" with no way to tell
           * which is which.
           */
          aria-labelledby={label ? labelId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={optionValue(option)} value={optionValue(option)}>
              {optionLabel(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
