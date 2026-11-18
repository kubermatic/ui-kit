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

import type { ConnectOptions, ConnectOutcome, KdpClient, Theme } from '@kubermatic/embed';
import * as react from '@kubermatic/embed/react';
import type { KdpConnection, KdpProviderProps, KdpState } from '@kubermatic/embed/react';

describe('@kubermatic/embed/react', () => {
  it('exports the provider and hooks', () => {
    expect(Object.keys(react).sort()).toEqual(['KdpProvider', 'useKdp', 'useKdpTheme']);
  });

  it('exports the binding types', () => {
    expectTypeOf<KdpState>().toEqualTypeOf<'connecting' | ConnectOutcome['status']>();
    expectTypeOf<KdpConnection['client']>().toEqualTypeOf<KdpClient | undefined>();
    expectTypeOf<KdpProviderProps['options']>().toEqualTypeOf<ConnectOptions | undefined>();
    expectTypeOf(react.useKdpTheme).returns.toEqualTypeOf<Theme | undefined>();
  });
});
