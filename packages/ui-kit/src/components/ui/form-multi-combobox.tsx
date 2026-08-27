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

import { useRef } from 'react';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';

interface FormMultiComboboxProps {
  items: string[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
}

export function FormMultiCombobox({
  items,
  value,
  onValueChange,
  placeholder = 'Select...',
  emptyMessage = 'No items found.',
  disabled,
  className,
  hasError,
}: FormMultiComboboxProps) {
  const anchor = useComboboxAnchor();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative">
      <Combobox
        multiple
        autoHighlight
        items={items}
        value={value}
        onValueChange={onValueChange}
      >
        <ComboboxChips
          ref={anchor}
          className={className}
          aria-invalid={hasError || undefined}
        >
          <ComboboxValue>
            {value.map((v: string) => (
              <ComboboxChip key={v}>{v}</ComboboxChip>
            ))}
            <ComboboxChipsInput
              /*
               * The placeholder is hidden once chips exist, so it cannot be the
               * input's accessible name in the state the field spends most of
               * its life in. Naming it unconditionally keeps the control
               * announced whether or not anything is selected.
               */
              aria-label={placeholder}
              placeholder={value.length === 0 ? placeholder : undefined}
              disabled={disabled}
            />
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor} container={containerRef}>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                <span className="truncate">{item}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
