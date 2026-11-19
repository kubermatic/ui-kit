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

import { afterEach, describe, expect, it, vi } from 'vitest';

import { KdpEmbedError } from '../protocol/errors.js';
import { REQUEST, type KdpObject, isResponseMessage } from '../protocol/messages.js';
import { type MockHost, type MockHostOptions, createMockHost } from './mock-host.js';

const a: KdpObject = { metadata: { name: 'a', namespace: 'default' }, spec: { model: 'm' } };
const b: KdpObject = { metadata: { name: 'b', namespace: 'other' }, spec: { model: 'n' } };

let host: MockHost;

function start(options?: MockHostOptions): MockHost {
  host = createMockHost(options);
  return host;
}

async function rejection(promise: Promise<unknown>): Promise<KdpEmbedError> {
  const error: unknown = await promise.then(
    () => undefined,
    (e: unknown) => e,
  );
  expect(error).toBeInstanceOf(KdpEmbedError);
  return error as KdpEmbedError;
}

afterEach(() => {
  host.close();
});

describe('createMockHost', () => {
  it('connects a client with a default context', () => {
    const { client } = start();
    expect(client.status).toBe('connected');
    expect(client.context).toEqual({
      workspace: 'demo',
      service: { id: 'demo', name: 'Demo' },
      kinds: [],
      user: { name: 'user@example.com' },
      theme: 'light',
    });
  });

  it('merges a partial context over the defaults', () => {
    const { client } = start({ context: { workspace: 'acme', theme: 'dark' } });
    expect(client.context.workspace).toBe('acme');
    expect(client.context.theme).toBe('dark');
    expect(client.context.service.id).toBe('demo');
  });

  it('lists seeded objects, filtered by namespace when given', async () => {
    const { client } = start({ objects: { LLMAccess: [a, b] } });
    await expect(client.listObjects('LLMAccess')).resolves.toEqual([a, b]);
    await expect(client.listObjects('LLMAccess', 'default')).resolves.toEqual([a]);
    await expect(client.listObjects('Other')).resolves.toEqual([]);
  });

  it('does not change the seed arrays', async () => {
    const seed = [a];
    const { client } = start({ objects: { LLMAccess: seed } });
    await client.deleteObject('LLMAccess', 'a');
    expect(seed).toEqual([a]);
  });

  it('gets an object by name and namespace', async () => {
    const { client } = start({ objects: { LLMAccess: [a, b] } });
    await expect(client.getObject('LLMAccess', 'b')).resolves.toEqual(b);
    await expect(client.getObject('LLMAccess', 'a', 'default')).resolves.toEqual(a);
    const error = await rejection(client.getObject('LLMAccess', 'a', 'other'));
    expect(error.code).toBe('not-found');
  });

  it('creates objects and rejects a duplicate with conflict', async () => {
    const { client } = start({ objects: { LLMAccess: [a] } });
    const c: KdpObject = { metadata: { name: 'c' }, spec: {} };

    await expect(client.createObject('LLMAccess', c, 'default')).resolves.toEqual({
      metadata: { name: 'c', namespace: 'default' },
      spec: {},
    });
    await expect(client.createObject('New', c)).resolves.toEqual(c);
    expect(host.objects.LLMAccess?.map((o) => o.metadata.name)).toEqual(['a', 'c']);
    expect(host.objects.New).toEqual([c]);

    const error = await rejection(client.createObject('LLMAccess', a));
    expect(error.code).toBe('conflict');
  });

  it('applies a JSON merge patch', async () => {
    const seeded: KdpObject = {
      metadata: { name: 'a', labels: { keep: 'y', drop: 'y' } },
      spec: { model: 'm', limits: { tokens: 1 } },
    };
    const { client } = start({ objects: { LLMAccess: [seeded] } });

    const patched = await client.patchObject('LLMAccess', 'a', {
      metadata: { labels: { drop: null, add: 'z' } },
      spec: { limits: { tokens: 2 }, extra: [1] },
      status: { phase: 'Ready' },
    });

    const expected = {
      metadata: { name: 'a', labels: { keep: 'y', add: 'z' } },
      spec: { model: 'm', limits: { tokens: 2 }, extra: [1] },
      status: { phase: 'Ready' },
    };
    expect(patched).toEqual(expected);
    expect(host.objects.LLMAccess).toEqual([expected]);
  });

  it('rejects a patch for a missing object or one that removes the metadata', async () => {
    const { client } = start({ objects: { LLMAccess: [a] } });
    expect((await rejection(client.patchObject('LLMAccess', 'x', {}))).code).toBe('not-found');
    expect((await rejection(client.patchObject('LLMAccess', 'a', { metadata: null }))).code).toBe(
      'invalid',
    );
    expect((await rejection(client.patchObject('LLMAccess', 'a', 'text'))).code).toBe('invalid');
    expect(host.objects.LLMAccess).toEqual([a]);
  });

  it('deletes objects', async () => {
    const { client } = start({ objects: { LLMAccess: [a, b] } });
    await expect(client.deleteObject('LLMAccess', 'a', 'default')).resolves.toBeNull();
    expect(host.objects.LLMAccess).toEqual([b]);
    expect((await rejection(client.deleteObject('LLMAccess', 'a'))).code).toBe('not-found');
  });

  it('returns configured related objects, or an empty list', async () => {
    const secret: KdpObject = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: { name: 'a-key', namespace: 'default' },
    };
    const { client } = start({ related: { 'LLMAccess/a/connection-details': [secret] } });
    await expect(
      client.getRelated('LLMAccess', 'a', 'connection-details', 'default'),
    ).resolves.toEqual([secret]);
    await expect(client.getRelated('LLMAccess', 'a', 'other')).resolves.toEqual([]);
  });

  it('returns seeded field options as copies, or an empty list', async () => {
    const seed = [
      { value: 'llama', label: 'Llama' },
      { value: 'mistral', label: 'Mistral' },
    ];
    const { client } = start({ fieldOptions: { LLMAccess: { 'spec.llmModels[].id': seed } } });

    const options = await client.getFieldOptions('LLMAccess', 'spec.llmModels[].id');
    expect(options).toEqual(seed);
    options[0]!.label = 'changed';
    options.pop();
    await expect(
      client.getFieldOptions('LLMAccess', 'spec.llmModels[].id', 'default'),
    ).resolves.toEqual(seed);
    expect(seed[0]!.label).toBe('Llama');
    await expect(client.getFieldOptions('LLMAccess', 'spec.other')).resolves.toEqual([]);
    await expect(client.getFieldOptions('Other', 'spec.llmModels[].id')).resolves.toEqual([]);
  });

  it('answers can with true by default', async () => {
    const { client } = start();
    await expect(client.can('delete', 'LLMAccess')).resolves.toBe(true);
  });

  it('answers can with a configured boolean or function', async () => {
    const { client } = start({ can: false });
    await expect(client.can('get', 'LLMAccess')).resolves.toBe(false);
    host.close();

    const can = vi.fn(({ verb }: { verb: string }) => verb === 'get');
    start({ can });
    await expect(host.client.can('get', 'LLMAccess', 'default')).resolves.toBe(true);
    await expect(host.client.can('delete', 'LLMAccess')).resolves.toBe(false);
    expect(can).toHaveBeenCalledWith({ verb: 'get', kind: 'LLMAccess', namespace: 'default' });
  });

  it('forces a failure per operation', async () => {
    const { client } = start({
      fail: { createObject: 'forbidden', getFieldOptions: 'upstream', can: 'something-new' },
      fieldOptions: { LLMAccess: { 'spec.llmModels[].id': [{ value: 'llama', label: 'Llama' }] } },
    });

    const error = await rejection(client.createObject('LLMAccess', a));
    expect(error.code).toBe('forbidden');
    expect(error.kind).toBe('platform');
    expect(error.message).not.toBe('');
    expect((await rejection(client.can('get', 'LLMAccess'))).code).toBe('something-new');
    expect((await rejection(client.getFieldOptions('LLMAccess', 'spec.llmModels[].id'))).code).toBe(
      'upstream',
    );
    await expect(client.listObjects('LLMAccess')).resolves.toEqual([]);
  });

  it('reports a throwing can function as upstream', async () => {
    const { client } = start({
      can: () => {
        throw new Error('boom');
      },
    });
    const error = await rejection(client.can('get', 'LLMAccess'));
    expect(error.code).toBe('upstream');
    expect(error.message).toContain('boom');
  });

  it('answers an unknown operation with protocol and ignores other messages', async () => {
    const channels: MessageChannel[] = [];
    vi.stubGlobal(
      'MessageChannel',
      class extends MessageChannel {
        constructor() {
          super();
          channels.push(this);
        }
      },
    );
    start();
    vi.unstubAllGlobals();
    const page = channels[0]!.port2;

    const response = new Promise<unknown>((resolve) => {
      page.addEventListener('message', (event: MessageEvent) => resolve(event.data));
    });
    page.postMessage({ type: 'something-else' });
    page.postMessage({ type: REQUEST, id: 99, operation: 'watchObjects', params: {} });

    const message = await response;
    expect(isResponseMessage(message) && !message.ok && message.failure.code).toBe('protocol');
    expect(message).toMatchObject({ id: 99 });
  });

  it('notifies theme changes', async () => {
    const { client } = start();
    const theme = new Promise((resolve) => client.on('theme', resolve));
    host.notifyTheme('dark');
    await expect(theme).resolves.toBe('dark');
    expect(client.context.theme).toBe('dark');
  });

  it('disconnects the client on close', async () => {
    const { client } = start();
    const disconnected = new Promise<void>((resolve) => client.on('disconnected', resolve));
    host.close();
    await disconnected;
    expect(client.status).toBe('disconnected');
    expect((await rejection(client.listObjects('LLMAccess'))).code).toBe('disconnected');
  });
});
