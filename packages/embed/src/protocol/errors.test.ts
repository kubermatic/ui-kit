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

import {
  BOUNDARY_ERROR_CODES,
  EMBED_ERROR_CODES,
  KdpEmbedError,
  PLATFORM_ERROR_CODES,
  TRANSPORT_ERROR_CODES,
  errorKind,
  isKdpEmbedError,
  isKnownErrorCode,
} from './errors.js';

describe('error codes', () => {
  it('lists the codes per kind', () => {
    expect(BOUNDARY_ERROR_CODES).toEqual(['out-of-scope', 'not-declared', 'not-consented']);
    expect(PLATFORM_ERROR_CODES).toEqual([
      'forbidden',
      'not-found',
      'conflict',
      'invalid',
      'upstream',
    ]);
    expect(TRANSPORT_ERROR_CODES).toEqual([
      'timeout',
      'disconnected',
      'protocol',
      'invalid-payload',
    ]);
  });

  it('puts every code in exactly one kind', () => {
    expect(new Set(EMBED_ERROR_CODES).size).toBe(EMBED_ERROR_CODES.length);
    expect(EMBED_ERROR_CODES).toHaveLength(
      BOUNDARY_ERROR_CODES.length + PLATFORM_ERROR_CODES.length + TRANSPORT_ERROR_CODES.length,
    );
  });

  it.each(EMBED_ERROR_CODES)('knows %s', (code) => {
    expect(isKnownErrorCode(code)).toBe(true);
  });

  it('does not know codes from later versions', () => {
    expect(isKnownErrorCode('rate-limited')).toBe(false);
    expect(isKnownErrorCode('')).toBe(false);
  });
});

describe('errorKind', () => {
  it.each(BOUNDARY_ERROR_CODES)('maps %s to boundary', (code) => {
    expect(errorKind(code)).toBe('boundary');
  });

  it.each(PLATFORM_ERROR_CODES)('maps %s to platform', (code) => {
    expect(errorKind(code)).toBe('platform');
  });

  it.each(TRANSPORT_ERROR_CODES)('maps %s to transport', (code) => {
    expect(errorKind(code)).toBe('transport');
  });

  it('maps an unknown code to unknown', () => {
    expect(errorKind('rate-limited')).toBe('unknown');
  });
});

describe('KdpEmbedError', () => {
  it('is an Error with code, message, kind and details', () => {
    const error = new KdpEmbedError('not-found', 'Database orders not found', { name: 'orders' });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('KdpEmbedError');
    expect(error.code).toBe('not-found');
    expect(error.message).toBe('Database orders not found');
    expect(error.kind).toBe('platform');
    expect(error.isBoundary).toBe(false);
    expect(error.details).toEqual({ name: 'orders' });
  });

  it('describes every known code when no message is given', () => {
    for (const code of EMBED_ERROR_CODES) {
      expect(new KdpEmbedError(code).message).not.toBe('');
    }
  });

  it('leaves details out when none are given', () => {
    expect('details' in new KdpEmbedError('timeout')).toBe(false);
  });

  it.each(BOUNDARY_ERROR_CODES)('reports %s as a boundary refusal', (code) => {
    expect(new KdpEmbedError(code).isBoundary).toBe(true);
  });
});

describe('KdpEmbedError.fromFailure', () => {
  it('turns a not-consented failure into a boundary error', () => {
    const error = KdpEmbedError.fromFailure({ code: 'not-consented', message: 'No consent' });
    expect(isKdpEmbedError(error)).toBe(true);
    expect(error.code).toBe('not-consented');
    expect(error.kind).toBe('boundary');
    expect(error.message).toBe('No consent');
  });

  it('keeps the details the host sent', () => {
    const details = { field: 'spec.size' };
    expect(KdpEmbedError.fromFailure({ code: 'invalid', message: 'bad', details }).details).toEqual(
      details,
    );
  });

  it('turns a failure without code and message into a described protocol error', () => {
    const error = KdpEmbedError.fromFailure({});
    expect(error.code).toBe('protocol');
    expect(error.kind).toBe('transport');
    expect(error.message).not.toBe('');
  });

  it.each<[string, unknown]>([
    ['undefined', undefined],
    ['an empty code', { code: '', message: 'x' }],
    ['a numeric code', { code: 404, message: 'x' }],
  ])('uses protocol for %s', (_, failure) => {
    expect(KdpEmbedError.fromFailure(failure as never).code).toBe('protocol');
  });

  it('describes the code when the message is empty or not a string', () => {
    expect(KdpEmbedError.fromFailure({ code: 'conflict', message: '' }).message).not.toBe('');
    expect(KdpEmbedError.fromFailure({ code: 'conflict', message: 42 }).message).not.toBe('');
  });

  it('keeps an unknown code from a later version, with kind unknown and its message', () => {
    const error = KdpEmbedError.fromFailure({ code: 'rate-limited', message: 'Slow down' });
    expect(error.code).toBe('rate-limited');
    expect(error.kind).toBe('unknown');
    expect(error.isBoundary).toBe(false);
    expect(error.message).toBe('Slow down');
  });

  it('describes an unknown code without a message, naming the code', () => {
    expect(KdpEmbedError.fromFailure({ code: 'rate-limited' }).message).toContain('rate-limited');
  });
});

describe('isKdpEmbedError', () => {
  it('tells KdpEmbedError apart from other errors', () => {
    expect(isKdpEmbedError(new KdpEmbedError('timeout'))).toBe(true);
    expect(isKdpEmbedError(new Error('timeout'))).toBe(false);
    expect(isKdpEmbedError({ code: 'timeout', message: 'x' })).toBe(false);
  });
});
