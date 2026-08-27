/*
 * Copyright 2026 The Kubermatic ui-kit Authors.
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
  Fragment,
  useCallback,
  useMemo,
  useRef,
  type FocusEvent,
  type MouseEvent,
} from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cn } from '@/lib/utils';
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from '@/components/ui/combobox';

export interface ComboboxOption {
  value: string;
  label: string;
  // Rendered next to the label in the list only, so it never leaks into the
  // text input the way a decorated label would.
  hint?: string;
}

/** A headed section of options; an empty label renders the options unheaded. */
export interface ComboboxOptionGroup {
  label: string;
  options: ComboboxOption[];
}

interface FormComboboxBaseProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
  id?: string;
  'aria-describedby'?: string;
}

type FormComboboxProps = FormComboboxBaseProps &
  (
    | { items: string[] | ComboboxOption[]; groups?: never }
    | { items?: never; groups: ComboboxOptionGroup[] }
  );

/** The grouped shape the underlying combobox expects. */
interface ComboboxItemGroup {
  value: string;
  items: ComboboxOption[];
}

const UNGROUPED_KEY = '__ungrouped';

const isItemEqual = (a: ComboboxOption, b: ComboboxOption) =>
  a.value === b.value;
const itemToString = (option: ComboboxOption | null) => option?.label ?? '';

// The input doubles as display and filter; without select-all on focus, typing
// appends to the selected label and the filter matches nothing.
function useSelectOnFocus() {
  const focusFromPointerRef = useRef(false);

  const onMouseDown = useCallback((event: MouseEvent<HTMLInputElement>) => {
    focusFromPointerRef.current =
      document.activeElement !== event.currentTarget;
  }, []);

  const onFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => event.currentTarget.select(),
    [],
  );

  // WebKit ends a mouse-initiated focus by collapsing the selection to the
  // click position on mouseup, which undoes the select above. Suppressing that
  // default for the click that moved focus in, and only that one, leaves caret
  // placement on every later click untouched.
  const onMouseUp = useCallback((event: MouseEvent<HTMLInputElement>) => {
    if (!focusFromPointerRef.current) {
      return;
    }
    focusFromPointerRef.current = false;
    event.preventDefault();
  }, []);

  return useMemo(
    () => ({ onFocus, onMouseDown, onMouseUp }),
    [onFocus, onMouseDown, onMouseUp],
  );
}

// The hint is visible text in the list, so the search has to reach it: option
// sets exist whose labels repeat and that are told apart by the hint alone.
const optionSearchText = (option: ComboboxOption) =>
  option.hint ? `${option.label} ${option.hint}` : option.label;

function renderOption(option: ComboboxOption) {
  return (
    <ComboboxItem key={option.value} value={option}>
      <span className="truncate">{option.label}</span>
      {option.hint && (
        <span className="text-muted-foreground shrink-0 text-xs">
          {option.hint}
        </span>
      )}
    </ComboboxItem>
  );
}

function renderGroup(group: ComboboxItemGroup) {
  // An unlabelled group would be an anonymous region to a screen reader, so
  // its options are rendered as plain list entries instead.
  if (!group.value) {
    return (
      <Fragment key={UNGROUPED_KEY}>{group.items.map(renderOption)}</Fragment>
    );
  }

  return (
    <ComboboxGroup key={group.value} items={group.items}>
      <ComboboxLabel>{group.value}</ComboboxLabel>
      <ComboboxCollection>{renderOption}</ComboboxCollection>
    </ComboboxGroup>
  );
}

export function FormCombobox({
  items,
  groups,
  value,
  onValueChange,
  placeholder = 'Select...',
  disabled,
  className,
  hasError,
  id,
  'aria-describedby': ariaDescribedBy,
}: FormComboboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectOnFocus = useSelectOnFocus();

  // Base UI's collator-backed matching: diacritic-, case- and
  // punctuation-insensitive, so "csi rbd" still finds "csi-rbd". Its `value`
  // option is deliberately omitted: the root already bypasses filtering while
  // the query still equals the selected label, so the option would only widen
  // that to queries the user typed themselves.
  const filter = ComboboxPrimitive.useFilter();
  const matchesQuery = useCallback(
    (option: ComboboxOption, query: string) =>
      filter.contains(option, query, optionSearchText),
    [filter],
  );

  const groupedItems = useMemo<ComboboxItemGroup[] | null>(
    () =>
      groups?.map((group) => ({ value: group.label, items: group.options })) ??
      null,
    [groups],
  );

  const options = useMemo<ComboboxOption[]>(
    () =>
      groups
        ? groups.flatMap((group) => group.options)
        : (items ?? []).map((item) =>
            typeof item === 'string' ? { value: item, label: item } : item,
          ),
    [groups, items],
  );

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) ?? null,
    [options, value],
  );

  const handleValueChange = useCallback(
    (option: ComboboxOption | null) => onValueChange(option?.value ?? ''),
    [onValueChange],
  );

  return (
    <div ref={containerRef} className="relative">
      <Combobox
        value={selectedOption}
        items={groupedItems ?? options}
        onValueChange={handleValueChange}
        isItemEqualToValue={isItemEqual}
        itemToStringValue={itemToString}
        filter={matchesQuery}
      >
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('w-full', className)}
          showClear={!!value}
          aria-invalid={hasError || undefined}
          aria-describedby={ariaDescribedBy}
          {...selectOnFocus}
        />
        <ComboboxContent container={containerRef}>
          <ComboboxEmpty>No results found.</ComboboxEmpty>
          <ComboboxList>
            {groupedItems ? renderGroup : renderOption}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
