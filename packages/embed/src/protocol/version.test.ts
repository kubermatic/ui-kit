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

import { PROTOCOL_VERSION, isCompatible, parseProtocolVersion } from './version.js';

describe('PROTOCOL_VERSION', () => {
  it('is 1.0', () => {
    expect(PROTOCOL_VERSION).toBe('1.0');
  });
});

describe('parseProtocolVersion', () => {
  it('parses major.minor', () => {
    expect(parseProtocolVersion('1.3')).toEqual({ major: 1, minor: 3 });
    expect(parseProtocolVersion('12.04')).toEqual({ major: 12, minor: 4 });
  });

  it.each(['1', 'v1.0', '1.0.0', '1.', '.1', '', ' 1.0', '1.0 ', '1.x', '-1.0'])(
    'rejects %j',
    (value) => {
      expect(parseProtocolVersion(value)).toBeNull();
    },
  );

  it.each([1, 1.0, null, undefined, {}, ['1.0']])('rejects non-string %j', (value) => {
    expect(parseProtocolVersion(value)).toBeNull();
  });
});

describe('isCompatible', () => {
  it('is true when only the minor differs', () => {
    expect(isCompatible('1.0', '1.3')).toBe(true);
    expect(isCompatible('1.3', '1.0')).toBe(true);
  });

  it('is false when the major differs', () => {
    expect(isCompatible('2.0', '1.3')).toBe(false);
    expect(isCompatible('1.3', '2.0')).toBe(false);
  });

  it.each<unknown>(['1', 'v1.0', 1, 1.0])('is false when either side sends %j', (malformed) => {
    expect(isCompatible('1.0', malformed)).toBe(false);
    expect(isCompatible(malformed, '1.0')).toBe(false);
  });

  it('is false when both sides are malformed, even if equal', () => {
    expect(isCompatible('v1.0', 'v1.0')).toBe(false);
  });
});
