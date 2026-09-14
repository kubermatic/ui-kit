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

import { X } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';

import { cn } from '../../lib/utils.js';
import { Input } from './input.js';

export interface TagInputProps {
  value: readonly string[];
  onValueChange: (tags: string[]) => void;
  placeholder?: string;
  /**
   * Keys that commit the pending text. Comma is included because pasting a
   * comma-separated list is how people actually enter several at once.
   */
  commitKeys?: readonly string[];
  /** Rejects a tag already present rather than adding a duplicate. */
  allowDuplicates?: boolean;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

/**
 * TagInput — free-text tokens, as chips.
 *
 * Backspace on an empty input removes the last chip, which is the behaviour
 * every tag field has and the one people try first. Each chip's remove button
 * is named after its tag for the same reason as in `KeyValueEditor`.
 *
 * Blur commits the pending text too. Losing what you typed because you clicked
 * "Save" instead of pressing Enter is the single most common complaint about
 * this control.
 */
export function TagInput({
  value,
  onValueChange,
  placeholder = 'Add a tag…',
  commitKeys = ['Enter', ','],
  allowDuplicates = false,
  disabled,
  className,
  'data-testid': testId,
}: TagInputProps) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const tag = draft.trim();
    setDraft('');
    if (!tag) return;
    if (!allowDuplicates && value.includes(tag)) return;
    onValueChange([...value, tag]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (commitKeys.includes(event.key)) {
      // The comma would otherwise land in the input as text.
      event.preventDefault();
      commit();
      return;
    }
    if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      onValueChange(value.slice(0, -1));
    }
  };

  return (
    <div data-slot="tag-input" className={cn('flex w-full flex-col gap-2', className)}>
      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-secondary py-0.5 pr-1 pl-2 font-sans text-xs font-medium text-secondary-foreground"
            >
              {tag}
              {disabled ? null : (
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() => onValueChange(value.filter((t) => t !== tag))}
                  className="flex size-5 items-center justify-center rounded-sm outline-none hover:bg-background/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <X className="size-3" />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={placeholder}
        disabled={disabled}
        data-testid={testId}
      />
    </div>
  );
}
