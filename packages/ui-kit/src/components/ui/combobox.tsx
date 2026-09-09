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

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Check, ChevronDown, X } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

/** An option as `{ value, label }`, or a bare string when the two are equal. */
export type ComboboxOption = string | ComboboxItem;

export interface ComboboxItem {
  value: string;
  /**
   * Must be a string, not a node: it is what the input displays when the
   * option is selected and what the built-in filter matches against. Put
   * decoration in `renderItem` instead, which only affects the list.
   */
  label: string;
}

const toItem = (option: ComboboxOption): ComboboxItem =>
  typeof option === 'string' ? { value: option, label: option } : option;

export interface ComboboxProps {
  options: readonly ComboboxOption[];
  /** Selected value, or `null` for none. */
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  /** Shown in the popup when the query matches nothing. */
  emptyMessage?: ReactNode;
  /** Leading adornment inside the input — the cluster picker's server icon. */
  startAdornment?: ReactNode;
  /**
   * Decorates a row in the list. The selected-value display still uses
   * `label`, so this is where a status dot or a secondary line belongs.
   */
  renderItem?: (item: ComboboxItem) => ReactNode;
  /** Renders a clear button once something is selected. */
  clearable?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
  'data-testid'?: string;
  /**
   * Accessible name, for a combobox that is **not** inside a `Field`.
   *
   * One of this or `aria-labelledby` is required in that case. Base UI
   * generates the input's id, so there is no element for a caller to point a
   * `<label for>` at — and without a name the control is an unlabelled form
   * field, which is what the axe run reported when this prop did not exist.
   *
   * Inside a `Field` neither is needed: Base UI wires the field's label to the
   * generated id automatically.
   */
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/**
 * Combobox — a searchable single-select.
 *
 * Configured rather than exposed as parts, unlike `Select`. The compound form
 * is twenty-odd parts, and every use of it across both products is the same
 * shape: type to filter a flat list of names, pick one. One product's cluster
 * and namespace pickers are two hand-assembled Headless UI `Combobox`
 * compositions of about 70 lines each that differ only in whether a status dot
 * follows the name — which is what `renderItem` is for.
 *
 * Filtering is Base UI's, not ours: it matches with `Intl.Collator`, so
 * "uber" finds "über" and the comparison is not a `toLowerCase().includes()`
 * that gets accents and Turkish dotless i wrong.
 *
 * The public value is a string because that is what both apps store in their
 * URL and their Zustand stores. Base UI selects the option *object* (it needs
 * `label` for the input display), so the translation happens here rather than
 * in every caller.
 */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  emptyMessage = 'No matches.',
  startAdornment,
  renderItem,
  clearable = false,
  disabled,
  required,
  name,
  className,
  'data-testid': testId,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: ComboboxProps) {
  const items = useMemo(() => options.map(toItem), [options]);
  const selected = useMemo(
    () => items.find((item) => item.value === value) ?? null,
    [items, value],
  );
  const selectedLabel = selected?.label ?? '';

  /*
   * The input's text is controlled here, and re-synced whenever `value`
   * changes from outside.
   *
   * Base UI tracks the text a user has typed separately from the selection —
   * correctly, since typing filters rather than selects. But that means a
   * `value` changed by something *else* — a URL parameter, a sibling control
   * resetting this one — updates the selection while the stale query text
   * stays on screen. One product hits it by design: picking a cluster resets
   * the namespace picker, and navigating by a sidebar link clears both. The
   * product worked around it by remounting the whole combobox on a key.
   *
   * Adjusted during render against the previous prop rather than in an
   * effect, so there is no frame showing the wrong text; and keyed on `value`
   * rather than on `selected`, because the memo behind `selected` re-runs
   * whenever `options` is rebuilt and resetting the text on an unrelated
   * re-render would eat what the user is typing.
   */
  const [inputValue, setInputValue] = useState(selectedLabel);
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setInputValue(selectedLabel);
  }

  return (
    <BaseCombobox.Root
      items={items}
      value={selected}
      onValueChange={(next) => onValueChange(next ? next.value : null)}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      disabled={disabled}
      required={required}
      name={name}
    >
      <div
        data-slot="combobox"
        className={cn(
          'relative flex h-9 w-full items-center rounded-md border border-input bg-background',
          'shadow-xs transition-[color,box-shadow]',
          'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
          'has-disabled:cursor-not-allowed has-disabled:opacity-50',
          'has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/30',
          className,
        )}
      >
        {startAdornment ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 flex items-center text-muted-foreground [&_svg]:size-4"
          >
            {startAdornment}
          </span>
        ) : null}

        <BaseCombobox.Input
          data-testid={testId}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          className={cn(
            'h-full w-full min-w-0 rounded-md bg-transparent py-1 font-sans text-sm text-foreground',
            'outline-none placeholder:text-muted-foreground',
            startAdornment ? 'pl-9' : 'pl-3',
            clearable && value ? 'pr-14' : 'pr-9',
          )}
        />

        {clearable && value ? (
          <BaseCombobox.Clear
            aria-label="Clear selection"
            className="absolute right-8 flex size-6 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <X className="size-3.5" />
          </BaseCombobox.Clear>
        ) : null}

        <BaseCombobox.Trigger
          aria-label="Open list"
          className="absolute right-1 flex size-7 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <ChevronDown className="size-4" />
        </BaseCombobox.Trigger>
      </div>

      <ComboboxList emptyMessage={emptyMessage} renderItem={renderItem} />
    </BaseCombobox.Root>
  );
}

/*
 * The popup, shared by both controls below. Extracted so that single- and
 * multi-select cannot drift into two different-looking lists — the difference
 * between them belongs in the control, not in the options.
 */
function ComboboxList({
  emptyMessage,
  renderItem,
}: {
  emptyMessage: ReactNode;
  renderItem?: (item: ComboboxItem) => ReactNode;
}) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner sideOffset={4} className="z-50 outline-none">
        <BaseCombobox.Popup
          data-slot="combobox-content"
          className={cn(
            'max-h-[min(20rem,var(--available-height))] w-[var(--anchor-width)] overflow-y-auto',
            'rounded-md border border-border bg-background p-1 text-foreground shadow-md outline-none',
            'origin-[var(--transform-origin)] transition-[transform,scale,opacity]',
            'data-starting-style:scale-95 data-starting-style:opacity-0',
            'data-ending-style:scale-95 data-ending-style:opacity-0',
          )}
        >
          <BaseCombobox.Empty className="px-2 py-3 text-center font-sans text-sm text-muted-foreground">
            {emptyMessage}
          </BaseCombobox.Empty>
          <BaseCombobox.List>
            {(item: ComboboxItem) => (
              <BaseCombobox.Item
                key={item.value}
                value={item}
                className={cn(
                  'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2',
                  'font-sans text-sm outline-none select-none',
                  'data-highlighted:bg-secondary data-highlighted:text-secondary-foreground',
                  'data-disabled:pointer-events-none data-disabled:opacity-50',
                )}
              >
                <span className="flex flex-1 items-center gap-2 truncate">
                  {renderItem ? renderItem(item) : item.label}
                </span>
                <BaseCombobox.ItemIndicator className="absolute right-2 flex items-center">
                  <Check className="size-4" />
                </BaseCombobox.ItemIndicator>
              </BaseCombobox.Item>
            )}
          </BaseCombobox.List>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

export interface MultiComboboxProps {
  options: readonly ComboboxOption[];
  /** Selected values, in the order they were picked. */
  value: readonly string[];
  onValueChange: (values: string[]) => void;
  /** Shown only while nothing is selected; the chips speak for themselves after that. */
  placeholder?: string;
  emptyMessage?: ReactNode;
  renderItem?: (item: ComboboxItem) => ReactNode;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
  'data-testid'?: string;
  /** See `Combobox` — required unless the control is inside a `Field`. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/**
 * MultiCombobox — a searchable multi-select, selections shown as chips.
 *
 * Base UI's combobox has a `multiple` mode and `Chips`/`Chip`/`ChipRemove`
 * parts, so this is the same primitive as `Combobox` wearing a different
 * control. That is worth saying because the alternative was tempting:
 * One product's namespace picker is a hand-rolled 180-line listbox with its
 * own outside-click effect, its own filter, and chips that are `<span>`s — so
 * they are not focusable, cannot be removed from the keyboard, and are
 * invisible to a screen reader walking the control. Chips here are Base UI's:
 * arrow keys move between them, Backspace removes the last one.
 *
 * Separate from `Combobox` rather than a `multiple` prop on it: the value type
 * differs (`string[]` against `string | null`), and a discriminated union
 * across two dozen props reads far worse at the call site than two names do.
 */
export function MultiCombobox({
  options,
  value,
  onValueChange,
  placeholder,
  emptyMessage = 'No matches.',
  renderItem,
  disabled,
  required,
  name,
  className,
  'data-testid': testId,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: MultiComboboxProps) {
  const items = useMemo(() => options.map(toItem), [options]);
  const selected = useMemo(
    () => value.map((v) => items.find((item) => item.value === v) ?? { value: v, label: v }),
    [items, value],
  );

  return (
    <BaseCombobox.Root
      multiple
      items={items}
      value={selected}
      onValueChange={(next: ComboboxItem[]) => onValueChange(next.map((item) => item.value))}
      disabled={disabled}
      required={required}
      name={name}
    >
      <BaseCombobox.Chips
        data-slot="multi-combobox"
        className={cn(
          'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1',
          'shadow-xs transition-[color,box-shadow]',
          'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
          'has-disabled:cursor-not-allowed has-disabled:opacity-50',
          'has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/30',
          className,
        )}
      >
        {selected.map((item) => (
          <BaseCombobox.Chip
            key={item.value}
            className={cn(
              'flex items-center gap-1 rounded-sm bg-secondary py-0.5 pr-1 pl-2',
              'font-sans text-xs font-medium text-secondary-foreground',
              'data-highlighted:bg-primary data-highlighted:text-primary-foreground',
            )}
          >
            {item.label}
            <BaseCombobox.ChipRemove
              aria-label={`Remove ${item.label}`}
              className="flex size-4 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <X className="size-3" />
            </BaseCombobox.ChipRemove>
          </BaseCombobox.Chip>
        ))}

        <BaseCombobox.Input
          data-testid={testId}
          placeholder={selected.length === 0 ? placeholder : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          className={cn(
            'h-7 min-w-24 flex-1 bg-transparent px-1 font-sans text-sm text-foreground',
            'outline-none placeholder:text-muted-foreground',
          )}
        />
      </BaseCombobox.Chips>

      <ComboboxList emptyMessage={emptyMessage} renderItem={renderItem} />
    </BaseCombobox.Root>
  );
}
