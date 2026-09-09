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

import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });

  it('accepts arrays and conditional objects', () => {
    expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c');
  });

  /*
   * The reason `cn` exists rather than `clsx` alone: a consumer's className
   * has to be able to beat a variant's, and plain concatenation leaves both
   * in the list with the winner decided by stylesheet order.
   */
  it('lets a later conflicting utility win', () => {
    expect(cn('bg-primary', 'bg-muted')).toBe('bg-muted');
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('keeps utilities that only look conflicting', () => {
    // Different properties, and a variant is not the base utility.
    expect(cn('bg-primary', 'hover:bg-muted')).toBe('bg-primary hover:bg-muted');
  });
});
