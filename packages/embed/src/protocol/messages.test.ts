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
  ACCEPT,
  ANNOUNCE,
  NOTIFY,
  OPERATIONS,
  REFUSE,
  REQUEST,
  RESPONSE,
  type AcceptMessage,
  type EmbedContext,
  isAcceptMessage,
  isAnnounceMessage,
  isEmbedContext,
  isNotifyMessage,
  isOperation,
  isRefuseMessage,
  isRequestMessage,
  isResponseMessage,
  isTheme,
} from './messages.js';

const context: EmbedContext = {
  workspace: 'acme',
  service: { id: 'svc-1', name: 'Databases' },
  kinds: [{ group: 'db.example.com', kind: 'Database' }],
  user: { name: 'alice' },
  theme: 'light',
};

const foreign: unknown[] = [
  undefined,
  null,
  'kdp.embed.announce',
  42,
  [],
  { type: 'webpackOk' },
  { source: 'react-devtools-bridge', payload: {} },
  { type: 'kdp.embed.unknown' },
];

describe('message type constants', () => {
  it('are namespaced', () => {
    for (const type of [ANNOUNCE, ACCEPT, REFUSE, REQUEST, RESPONSE, NOTIFY]) {
      expect(type).toMatch(/^kdp\.embed\.[a-z]+$/);
    }
  });
});

describe('OPERATIONS', () => {
  it('lists the operation set', () => {
    expect(OPERATIONS).toEqual([
      'listObjects',
      'getObject',
      'createObject',
      'patchObject',
      'deleteObject',
      'getRelated',
      'getFieldOptions',
      'can',
    ]);
  });
});

describe('isOperation', () => {
  it.each(OPERATIONS)('accepts %s', (operation) => {
    expect(isOperation(operation)).toBe(true);
  });

  it('accepts getFieldOptions', () => {
    expect(isOperation('getFieldOptions')).toBe(true);
  });

  it.each(['listobjects', 'watch', 'toString', '', 1, null])('rejects %j', (value) => {
    expect(isOperation(value)).toBe(false);
  });
});

describe('isTheme', () => {
  it('accepts light and dark only', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('system')).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });
});

describe('isEmbedContext', () => {
  it('accepts a context with and without an object', () => {
    expect(isEmbedContext(context)).toBe(true);
    expect(
      isEmbedContext({
        ...context,
        object: { group: 'db.example.com', kind: 'Database', name: 'orders', namespace: 'prod' },
      }),
    ).toBe(true);
    expect(
      isEmbedContext({
        ...context,
        object: { group: 'db.example.com', kind: 'Database', name: 'orders' },
      }),
    ).toBe(true);
  });

  it.each<[string, unknown]>([
    ['not an object', 'acme'],
    ['workspace missing', { ...context, workspace: undefined }],
    ['service not an object', { ...context, service: 'svc-1' }],
    ['service id wrong type', { ...context, service: { id: 1, name: 'Databases' } }],
    ['service name missing', { ...context, service: { id: 'svc-1' } }],
    ['kinds not an array', { ...context, kinds: { group: 'g', kind: 'k' } }],
    ['kind entry partial', { ...context, kinds: [{ kind: 'Database' }] }],
    ['kind entry wrong type', { ...context, kinds: [{ group: 'g', kind: 1 }] }],
    ['object partial', { ...context, object: { group: 'g', kind: 'k' } }],
    [
      'object namespace wrong type',
      { ...context, object: { group: 'g', kind: 'k', name: 'n', namespace: 1 } },
    ],
    ['user missing', { ...context, user: undefined }],
    ['user name wrong type', { ...context, user: { name: null } }],
    ['theme unknown', { ...context, theme: 'system' }],
  ])('rejects a context with %s', (_, value) => {
    expect(isEmbedContext(value)).toBe(false);
  });
});

describe('isAnnounceMessage', () => {
  it('accepts a valid announcement', () => {
    expect(isAnnounceMessage({ type: ANNOUNCE, protocolVersion: '1.0', instanceId: 'a1' })).toBe(
      true,
    );
  });

  it.each(foreign)('rejects foreign %j', (value) => {
    expect(isAnnounceMessage(value)).toBe(false);
  });

  it('rejects partial and wrong-typed announcements', () => {
    expect(isAnnounceMessage({ type: ANNOUNCE })).toBe(false);
    expect(isAnnounceMessage({ type: ANNOUNCE, protocolVersion: 1, instanceId: 'a1' })).toBe(false);
    expect(isAnnounceMessage({ type: ACCEPT, protocolVersion: '1.0', instanceId: 'a1' })).toBe(
      false,
    );
  });

  it.each([
    ['missing', undefined],
    ['empty', ''],
    ['not a string', 1],
  ])('rejects an announcement whose instance ID is %s', (_, instanceId) => {
    expect(isAnnounceMessage({ type: ANNOUNCE, protocolVersion: '1.0', instanceId })).toBe(false);
  });
});

describe('isAcceptMessage', () => {
  const accept: AcceptMessage = { type: ACCEPT, protocolVersion: '1.0', context };

  it('accepts a valid accept message', () => {
    expect(isAcceptMessage(accept)).toBe(true);
  });

  it.each(foreign)('rejects foreign %j', (value) => {
    expect(isAcceptMessage(value)).toBe(false);
  });

  it('rejects partial and wrong-typed accept messages', () => {
    expect(isAcceptMessage({ type: ACCEPT, protocolVersion: '1.0' })).toBe(false);
    expect(isAcceptMessage({ ...accept, protocolVersion: undefined })).toBe(false);
    expect(isAcceptMessage({ ...accept, context: { ...context, theme: 'blue' } })).toBe(false);
    expect(isAcceptMessage({ ...accept, type: REFUSE })).toBe(false);
  });
});

describe('isRefuseMessage', () => {
  it('accepts a valid refusal', () => {
    expect(
      isRefuseMessage({ type: REFUSE, protocolVersion: '1.0', reason: 'version-mismatch' }),
    ).toBe(true);
  });

  it('accepts a reason added by a later host', () => {
    expect(isRefuseMessage({ type: REFUSE, protocolVersion: '1.4', reason: 'busy' })).toBe(true);
  });

  it.each(foreign)('rejects foreign %j', (value) => {
    expect(isRefuseMessage(value)).toBe(false);
  });

  it('rejects partial and wrong-typed refusals', () => {
    expect(isRefuseMessage({ type: REFUSE, protocolVersion: '1.0' })).toBe(false);
    expect(isRefuseMessage({ type: REFUSE, reason: 'version-mismatch' })).toBe(false);
    expect(isRefuseMessage({ type: REFUSE, protocolVersion: '1.0', reason: '' })).toBe(false);
    expect(isRefuseMessage({ type: REFUSE, protocolVersion: '1.0', reason: 3 })).toBe(false);
  });
});

describe('isRequestMessage', () => {
  const request = { type: REQUEST, id: 1, operation: 'listObjects', params: { kind: 'Database' } };

  it('accepts a valid request', () => {
    expect(isRequestMessage(request)).toBe(true);
  });

  it('accepts a well-formed request for an operation it does not know', () => {
    expect(isRequestMessage({ ...request, operation: 'watch' })).toBe(true);
  });

  it.each(foreign)('rejects foreign %j', (value) => {
    expect(isRequestMessage(value)).toBe(false);
  });

  it.each<[string, unknown]>([
    ['no id', { ...request, id: undefined }],
    ['a string id', { ...request, id: '1' }],
    ['a NaN id', { ...request, id: Number.NaN }],
    ['an infinite id', { ...request, id: Number.POSITIVE_INFINITY }],
    ['no operation', { ...request, operation: undefined }],
    ['a numeric operation', { ...request, operation: 3 }],
    ['no params', { ...request, params: undefined }],
    ['null params', { ...request, params: null }],
    ['array params', { ...request, params: [] }],
    ['string params', { ...request, params: 'kind=Database' }],
    ['the response type', { ...request, type: RESPONSE }],
  ])('rejects a request with %s', (_, value) => {
    expect(isRequestMessage(value)).toBe(false);
  });
});

describe('isResponseMessage', () => {
  it('accepts a success, including a null result', () => {
    expect(isResponseMessage({ type: RESPONSE, id: 1, ok: true, result: [] })).toBe(true);
    expect(isResponseMessage({ type: RESPONSE, id: 2, ok: true, result: null })).toBe(true);
  });

  it('accepts a failure, even one without a code or message', () => {
    expect(
      isResponseMessage({
        type: RESPONSE,
        id: 1,
        ok: false,
        failure: { code: 'not-found', message: 'gone' },
      }),
    ).toBe(true);
    expect(isResponseMessage({ type: RESPONSE, id: 1, ok: false, failure: {} })).toBe(true);
  });

  it.each(foreign)('rejects foreign %j', (value) => {
    expect(isResponseMessage(value)).toBe(false);
  });

  it.each<[string, unknown]>([
    ['no id', { type: RESPONSE, ok: true, result: 1 }],
    ['a string id', { type: RESPONSE, id: '1', ok: true, result: 1 }],
    ['no ok flag', { type: RESPONSE, id: 1, result: 1 }],
    ['a truthy but non-boolean ok', { type: RESPONSE, id: 1, ok: 'yes', result: 1 }],
    ['ok and no result', { type: RESPONSE, id: 1, ok: true }],
    ['not ok and no failure', { type: RESPONSE, id: 1, ok: false }],
    ['not ok and a string failure', { type: RESPONSE, id: 1, ok: false, failure: 'boom' }],
    ['not ok and a null failure', { type: RESPONSE, id: 1, ok: false, failure: null }],
    ['the request type', { type: REQUEST, id: 1, ok: true, result: 1 }],
  ])('rejects a response with %s', (_, value) => {
    expect(isResponseMessage(value)).toBe(false);
  });
});

describe('isNotifyMessage', () => {
  it('accepts theme and closing notifications', () => {
    expect(isNotifyMessage({ type: NOTIFY, event: 'theme', theme: 'dark' })).toBe(true);
    expect(isNotifyMessage({ type: NOTIFY, event: 'closing' })).toBe(true);
  });

  it.each(foreign)('rejects foreign %j', (value) => {
    expect(isNotifyMessage(value)).toBe(false);
  });

  it('rejects partial, wrong-typed and unknown notifications', () => {
    expect(isNotifyMessage({ type: NOTIFY, event: 'theme' })).toBe(false);
    expect(isNotifyMessage({ type: NOTIFY, event: 'theme', theme: 'sepia' })).toBe(false);
    expect(isNotifyMessage({ type: NOTIFY })).toBe(false);
    expect(isNotifyMessage({ type: NOTIFY, event: 'reload' })).toBe(false);
    expect(isNotifyMessage({ type: REQUEST, event: 'closing' })).toBe(false);
  });
});

describe('messages carry data only', () => {
  it('survive structured cloning unchanged', () => {
    const messages = [
      { type: ANNOUNCE, protocolVersion: '1.0' },
      { type: ACCEPT, protocolVersion: '1.0', context },
      { type: REQUEST, id: 1, operation: 'can', params: { verb: 'get', kind: 'Database' } },
      { type: RESPONSE, id: 1, ok: true, result: true },
      { type: NOTIFY, event: 'closing' },
    ];
    for (const message of messages) {
      expect(structuredClone(message)).toEqual(message);
    }
  });
});
