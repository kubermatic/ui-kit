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

import { describe, expect, expectTypeOf, it } from 'vitest';

import type { KdpClient, KdpObject, Theme } from '@kubermatic/embed';
import * as testing from '@kubermatic/embed/testing';
import type { MockCanCheck, MockHost, MockHostOptions } from '@kubermatic/embed/testing';

describe('@kubermatic/embed/testing', () => {
  it('exports only createMockHost at runtime', () => {
    expect(Object.keys(testing)).toEqual(['createMockHost']);
  });

  it('exports the mock host types', () => {
    expectTypeOf(testing.createMockHost).parameter(0).toEqualTypeOf<MockHostOptions | undefined>();
    expectTypeOf<MockHost['client']>().toEqualTypeOf<KdpClient>();
    expectTypeOf<MockHost['objects']>().toEqualTypeOf<Record<string, KdpObject[]>>();
    expectTypeOf<MockHost['notifyTheme']>().parameter(0).toEqualTypeOf<Theme>();
    expectTypeOf<MockCanCheck>().toHaveProperty('verb');
  });
});
