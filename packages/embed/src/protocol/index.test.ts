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

import {
  EMBED_ERROR_CODES,
  KdpEmbedError,
  OPERATIONS,
  PROTOCOL_VERSION,
  type EmbedContext,
  type FieldOption,
  type KdpObject,
  type OperationParams,
  type OperationResult,
  type RequestMessage,
  isCompatible,
  isRequestMessage,
} from '@kubermatic/embed/protocol';

describe('@kubermatic/embed/protocol', () => {
  it('exports the version, message and error API', () => {
    expect(isCompatible(PROTOCOL_VERSION, '1.9')).toBe(true);
    expect(OPERATIONS).toContain('getRelated');
    expect(OPERATIONS).toContain('getFieldOptions');
    expect(EMBED_ERROR_CODES).toContain('not-consented');
    expect(KdpEmbedError.fromFailure({ code: 'timeout' }).kind).toBe('transport');
    expect(
      isRequestMessage({ type: 'kdp.embed.request', id: 1, operation: 'can', params: {} }),
    ).toBe(true);
  });

  it('types the operation contract', () => {
    expectTypeOf<OperationResult<'can'>>().toEqualTypeOf<boolean>();
    expectTypeOf<OperationResult<'getRelated'>>().toEqualTypeOf<KdpObject[]>();
    expectTypeOf<OperationResult<'deleteObject'>>().toEqualTypeOf<null>();
    expectTypeOf<FieldOption>().toEqualTypeOf<{ value: string; label: string }>();
    expectTypeOf<OperationResult<'getFieldOptions'>>().toEqualTypeOf<FieldOption[]>();
    expectTypeOf<OperationParams<'getFieldOptions'>>().toEqualTypeOf<{
      kind: string;
      field: string;
      namespace?: string;
    }>();
    expectTypeOf<OperationParams<'can'>>().toEqualTypeOf<{
      verb: 'get' | 'list' | 'create' | 'patch' | 'delete';
      kind: string;
      namespace?: string;
    }>();
    expectTypeOf<RequestMessage<'getObject'>['params']>().toEqualTypeOf<{
      kind: string;
      name: string;
      namespace?: string;
    }>();
    expectTypeOf<EmbedContext>().not.toHaveProperty('declaredAccess');
    expectTypeOf<EmbedContext>().not.toHaveProperty('defaultNamespace');
  });
});
