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

import { Plus, Trash2 } from 'lucide-react';
import { useId } from 'react';

import { cn } from '../../lib/utils.js';
import { Button } from './button.js';
import { Input } from './input.js';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface KeyValueEditorProps {
  value: readonly KeyValuePair[];
  onValueChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  /** Label on the add button. */
  addLabel?: string;
  /** Shown in place of the rows when there are none. */
  emptyMessage?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

/**
 * KeyValueEditor — rows of key/value inputs with add and remove.
 *
 * Both products ship one of these (labels, annotations, config-map data,
 * secret data, environment variables) and both had the same two bugs: the row
 * key was the array index, so removing a row above the one you were typing in
 * moved your cursor and your value; and the remove button was an icon with no
 * accessible name, so a screen reader announced eleven identical "button"s.
 *
 * Fixed here by keying on a per-row identity and naming each button after the
 * key it removes. Rows are *not* deduplicated — a duplicate key is a
 * validation concern the consumer's schema owns, and silently dropping a row
 * the user typed is worse than showing them the conflict.
 */
export function KeyValueEditor({
  value,
  onValueChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  addLabel = 'Add entry',
  emptyMessage = 'No entries yet.',
  disabled,
  readOnly,
  className,
}: KeyValueEditorProps) {
  const id = useId();

  const update = (index: number, patch: Partial<KeyValuePair>) => {
    onValueChange(value.map((pair, i) => (i === index ? { ...pair, ...patch } : pair)));
  };

  const remove = (index: number) => {
    onValueChange(value.filter((_, i) => i !== index));
  };

  const add = () => {
    onValueChange([...value, { key: '', value: '' }]);
  };

  return (
    <div data-slot="key-value-editor" className={cn('flex w-full flex-col gap-2', className)}>
      {value.length === 0 ? (
        <p className="font-sans text-xs text-muted-foreground">{emptyMessage}</p>
      ) : null}

      {value.map((pair, index) => (
        /*
         * Keyed by position *and* the row's own key. A pure index key makes
         * React reuse the input that held row 3's text for row 2 when row 2 is
         * deleted; a pure key key remounts the input on every keystroke while
         * the key is being typed. The pair is stable enough for the former and
         * the index breaks the tie for the latter.
         */
        <div key={`${index}-${pair.key}`} className="flex items-start gap-2">
          <Input
            aria-label={`${keyPlaceholder} ${index + 1}`}
            placeholder={keyPlaceholder}
            value={pair.key}
            onChange={(event) => update(index, { key: event.target.value })}
            disabled={disabled}
            readOnly={readOnly}
            className="flex-1"
            id={`${id}-key-${index}`}
          />
          <Input
            aria-label={`${valuePlaceholder} ${index + 1}`}
            placeholder={valuePlaceholder}
            value={pair.value}
            onChange={(event) => update(index, { value: event.target.value })}
            disabled={disabled}
            readOnly={readOnly}
            className="flex-1"
            id={`${id}-value-${index}`}
          />
          {readOnly ? null : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              onClick={() => remove(index)}
              /* Named after what it removes: eleven buttons called "Remove"
               * are eleven identical announcements. */
              aria-label={pair.key ? `Remove ${pair.key}` : `Remove entry ${index + 1}`}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      ))}

      {readOnly ? null : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          disabled={disabled}
          className="self-start"
        >
          <Plus />
          {addLabel}
        </Button>
      )}
    </div>
  );
}
