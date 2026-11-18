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

import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import { KdpEmbedError } from '../protocol/errors.js';
import type { EmbedContext, KdpObject, Theme } from '../protocol/messages.js';
import { type FakeHost, createFakeHost } from '../test/fake-host.js';
import { type KdpClient, createClient } from './client.js';

interface LLMAccess extends KdpObject {
  spec: { model: string };
}

const context: EmbedContext = {
  workspace: 'acme',
  service: { id: 'svc-1', name: 'LLM' },
  kinds: [{ group: 'llm.example.com', kind: 'LLMAccess' }],
  user: { name: 'alice' },
  theme: 'light',
};

const access: LLMAccess = { metadata: { name: 'a', namespace: 'default' }, spec: { model: 'm' } };

let host: FakeHost;
let client: KdpClient;

function open(requestTimeoutMs?: number): KdpClient {
  host = createFakeHost();
  client = createClient({ port: host.port, context, hostProtocolVersion: '1.2', requestTimeoutMs });
  return client;
}

async function answer(result: unknown) {
  const request = await host.nextRequest();
  host.respond(request.id, result);
  return request;
}

afterEach(() => {
  client.close();
  host.dispose();
});

describe('createClient', () => {
  it('exposes the handshake data', () => {
    open();
    expect(client.status).toBe('connected');
    expect(client.context).toEqual(context);
    expect(client.hostProtocolVersion).toBe('1.2');
  });

  it.each<[string, (c: KdpClient) => Promise<unknown>, string, object, unknown]>([
    ['listObjects', (c) => c.listObjects('LLMAccess'), 'listObjects', { kind: 'LLMAccess' }, []],
    [
      'listObjects in a namespace',
      (c) => c.listObjects('LLMAccess', 'default'),
      'listObjects',
      { kind: 'LLMAccess', namespace: 'default' },
      [access],
    ],
    [
      'getObject',
      (c) => c.getObject('LLMAccess', 'a', 'default'),
      'getObject',
      { kind: 'LLMAccess', name: 'a', namespace: 'default' },
      access,
    ],
    [
      'createObject',
      (c) => c.createObject('LLMAccess', access),
      'createObject',
      { kind: 'LLMAccess', object: access },
      access,
    ],
    [
      'patchObject',
      (c) => c.patchObject('LLMAccess', 'a', { spec: { model: 'n' } }, 'default'),
      'patchObject',
      { kind: 'LLMAccess', name: 'a', patch: { spec: { model: 'n' } }, namespace: 'default' },
      access,
    ],
    [
      'deleteObject',
      (c) => c.deleteObject('LLMAccess', 'a'),
      'deleteObject',
      { kind: 'LLMAccess', name: 'a' },
      null,
    ],
    [
      'getRelated',
      (c) => c.getRelated('LLMAccess', 'a', 'connection-details', 'default'),
      'getRelated',
      { kind: 'LLMAccess', name: 'a', identifier: 'connection-details', namespace: 'default' },
      [],
    ],
    [
      'can',
      (c) => c.can('delete', 'LLMAccess', 'default'),
      'can',
      { verb: 'delete', kind: 'LLMAccess', namespace: 'default' },
      true,
    ],
  ])('%s sends its operation and resolves with the result', async (_, call, op, params, result) => {
    open();
    const promise = call(client);
    const request = await answer(result);
    expect(request.operation).toBe(op);
    expect(request.params).toStrictEqual(params);
    await expect(promise).resolves.toEqual(result);
  });

  it('types object results by the given parameter', () => {
    // Type assertions only; never called, so no request is left pending.
    const check = (c: KdpClient) => {
      expectTypeOf(c.getObject<LLMAccess>('LLMAccess', 'a')).toEqualTypeOf<Promise<LLMAccess>>();
      expectTypeOf(c.listObjects<LLMAccess>('LLMAccess')).toEqualTypeOf<Promise<LLMAccess[]>>();
      expectTypeOf(c.createObject('LLMAccess', access)).toEqualTypeOf<Promise<LLMAccess>>();
      expectTypeOf(c.patchObject<LLMAccess>('LLMAccess', 'a', {})).toEqualTypeOf<
        Promise<LLMAccess>
      >();
      expectTypeOf(c.getRelated('LLMAccess', 'a', 'connection-details')).toEqualTypeOf<
        Promise<KdpObject[]>
      >();
      expectTypeOf(c.deleteObject('LLMAccess', 'a')).toEqualTypeOf<Promise<null>>();
      expectTypeOf(c.can('get', 'LLMAccess')).toEqualTypeOf<Promise<boolean>>();
      // @ts-expect-error -- the type parameter must be a KdpObject
      void c.getObject<{ name: string }>('LLMAccess', 'a');
      // @ts-expect-error -- not a verb
      void c.can('watch', 'LLMAccess');
    };
    expectTypeOf(check).toBeFunction();
  });

  it('settles concurrent calls with their own responses, in any order', async () => {
    open();
    const list = client.listObjects('LLMAccess');
    const allowed = client.can('delete', 'LLMAccess');
    const listRequest = await host.nextRequest();
    const canRequest = await host.nextRequest();
    host.respond(canRequest.id, true);
    host.respond(listRequest.id, [access]);
    await expect(allowed).resolves.toBe(true);
    await expect(list).resolves.toEqual([access]);
  });

  it('sends a request for every can() call', async () => {
    open();
    const first = client.can('delete', 'LLMAccess');
    await answer(true);
    await expect(first).resolves.toBe(true);
    const second = client.can('delete', 'LLMAccess');
    await answer(false);
    await expect(second).resolves.toBe(false);
    expect(host.requests.filter((r) => r.operation === 'can')).toHaveLength(2);
  });

  it('rejects a boundary refusal with a boundary error', async () => {
    open();
    const result = client.createObject('LLMAccess', access);
    const { id } = await host.nextRequest();
    host.fail(id, { code: 'not-consented', message: 'Ask the user' });
    const error = await result.catch((e: unknown) => e);
    expect(error).toBeInstanceOf(KdpEmbedError);
    expect(error).toMatchObject({ code: 'not-consented', kind: 'boundary' });
  });

  it('turns a malformed failure into a protocol error with a message', async () => {
    open();
    const result = client.getObject('LLMAccess', 'a');
    const { id } = await host.nextRequest();
    host.fail(id, {});
    const error = (await result.catch((e: unknown) => e)) as KdpEmbedError;
    expect(error.code).toBe('protocol');
    expect(error.message).not.toBe('');
  });

  it('rejects with timeout when the host does not answer, and ignores the late answer', async () => {
    open(20);
    const result = client.listObjects('LLMAccess');
    const { id } = await host.nextRequest();
    await expect(result).rejects.toMatchObject({ code: 'timeout' });
    host.respond(id, [access]);
    const next = client.can('get', 'LLMAccess');
    await answer(true);
    await expect(next).resolves.toBe(true);
    expect(client.status).toBe('connected');
  });

  it('updates the theme and calls theme listeners until they are removed', async () => {
    open();
    const listener = vi.fn();
    const unsubscribe = client.on('theme', listener);
    const seen = new Promise<Theme>((resolve) => client.on('theme', resolve));
    const before = client.context;

    host.notifyTheme('dark');
    await expect(seen).resolves.toBe('dark');
    expect(listener).toHaveBeenCalledWith('dark');
    expect(client.context.theme).toBe('dark');
    expect(client.context).not.toBe(before);
    expect(client.context).toEqual({ ...context, theme: 'dark' });

    unsubscribe();
    const again = new Promise<Theme>((resolve) => client.on('theme', resolve));
    host.notifyTheme('light');
    await expect(again).resolves.toBe('light');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('disconnects when the host sends closing with a request pending', async () => {
    open();
    const onDisconnected = vi.fn();
    client.on('disconnected', onDisconnected);
    const disconnected = new Promise<void>((resolve) => client.on('disconnected', resolve));
    const pending = client.listObjects('LLMAccess');
    await host.nextRequest();

    host.notifyClosing();
    await disconnected;
    await expect(pending).rejects.toMatchObject({ code: 'disconnected' });
    expect(client.status).toBe('disconnected');
    expect(onDisconnected).toHaveBeenCalledTimes(1);

    client.close();
    expect(onDisconnected).toHaveBeenCalledTimes(1);
  });

  it('closes idempotently and rejects calls made afterwards', async () => {
    open();
    const onDisconnected = vi.fn();
    const removed = vi.fn();
    client.on('disconnected', onDisconnected);
    client.on('disconnected', removed)();
    const pending = client.can('get', 'LLMAccess');

    client.close();
    client.close();
    expect(client.status).toBe('disconnected');
    expect(onDisconnected).toHaveBeenCalledTimes(1);
    expect(removed).not.toHaveBeenCalled();
    await expect(pending).rejects.toMatchObject({ code: 'disconnected' });
    await expect(client.listObjects('LLMAccess')).rejects.toMatchObject({ code: 'disconnected' });
    await expect(client.can('get', 'LLMAccess')).rejects.toMatchObject({ code: 'disconnected' });
  });
});
