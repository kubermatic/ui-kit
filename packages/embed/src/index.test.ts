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

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, expectTypeOf, it } from 'vitest';

import * as embed from '@kubermatic/embed';
import type {
  ConnectOutcome,
  EmbedContext,
  EmbedErrorKind,
  KdpClient,
  KdpObject,
} from '@kubermatic/embed';

describe('@kubermatic/embed', () => {
  it('exports exactly the author-facing runtime API', () => {
    expect(Object.keys(embed).sort()).toEqual(
      [
        'BOUNDARY_ERROR_CODES',
        'EMBED_ERROR_CODES',
        'KdpEmbedError',
        'PLATFORM_ERROR_CODES',
        'PROTOCOL_VERSION',
        'TRANSPORT_ERROR_CODES',
        'connect',
        'errorKind',
        'isKdpEmbedError',
      ].sort(),
    );
  });

  it('does not export the client factory, the environment seam or host code', () => {
    for (const name of [
      'createClient',
      'createChannel',
      'connectWith',
      'windowEnvironment',
      'createHost',
      'createHostTransport',
      'PermissionCache',
      'createPermissionCache',
    ]) {
      expect(embed).not.toHaveProperty(name);
    }
  });

  it('exports the public types', () => {
    expectTypeOf<
      Extract<ConnectOutcome, { status: 'connected' }>['client']
    >().toEqualTypeOf<KdpClient>();
    expectTypeOf<KdpClient['context']>().toEqualTypeOf<EmbedContext>();
    expectTypeOf<ReturnType<KdpClient['getRelated']>>().toEqualTypeOf<Promise<KdpObject[]>>();
    expectTypeOf(embed.errorKind).returns.toEqualTypeOf<EmbedErrorKind>();
  });

  it('does not import React outside the ./react entry', () => {
    const src = import.meta.dirname;
    const shipped = readdirSync(src, { recursive: true, encoding: 'utf8' }).filter(
      (file) =>
        /\.tsx?$/.test(file) &&
        !/\.test\.tsx?$/.test(file) &&
        !file.startsWith('react/') &&
        !file.startsWith('test/'),
    );
    expect(shipped).toContain('testing/mock-host.ts');
    for (const file of shipped) {
      expect(readFileSync(join(src, file), 'utf8'), file).not.toMatch(/from ['"]react/);
    }
  });
});
