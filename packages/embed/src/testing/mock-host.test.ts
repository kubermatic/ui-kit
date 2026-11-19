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
const LLM_ACCESS = { group: 'ai.kdp.k8c.io', kind: 'LLMAccess' };

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
    await expect(client.listObjects('LLMAccess', 'empty')).resolves.toEqual([]);
  });

  it('offers the seeded kinds in the core group when the context names none', () => {
    const { client } = start({
      objects: { LLMAccess: [] },
      related: { 'LLMKey/a/x': [] },
      fieldOptions: { LLMModel: {} },
    });
    expect(client.context.kinds).toEqual([
      { group: '', kind: 'LLMAccess' },
      { group: '', kind: 'LLMKey' },
      { group: '', kind: 'LLMModel' },
    ]);
  });

  it('refuses kinds outside the context with out-of-scope, as the Dashboard does', async () => {
    const { client } = start({ context: { kinds: [LLM_ACCESS] }, objects: { Other: [a] } });
    for (const call of [
      client.listObjects('Other'),
      client.getObject('Other', 'a', 'default'),
      client.createObject('Other', a),
      client.patchObject('Other', 'a', {}, 'default'),
      client.deleteObject('Other', 'a', 'default'),
      client.getRelated('Other', 'a', 'x', 'default'),
      client.getFieldOptions('Other', 'spec.x'),
    ]) {
      expect((await rejection(call)).code).toBe('out-of-scope');
    }
    await expect(client.can('get', 'Other')).resolves.toBe(false);
    await expect(client.listObjects('LLMAccess')).resolves.toEqual([]);
  });

  it('refuses a kind offered in two groups with invalid', async () => {
    const { client } = start({
      context: { kinds: [LLM_ACCESS, { group: 'other.example.com', kind: 'LLMAccess' }] },
    });
    expect((await rejection(client.listObjects('LLMAccess'))).code).toBe('invalid');
    expect((await rejection(client.can('get', 'LLMAccess'))).code).toBe('invalid');
  });

  it('requires a namespace for one object of a namespaced kind', async () => {
    const { client } = start({ objects: { LLMAccess: [a] } });
    for (const call of [
      client.getObject('LLMAccess', 'a'),
      client.createObject('LLMAccess', { metadata: { name: 'c' } }),
      client.patchObject('LLMAccess', 'a', {}),
      client.deleteObject('LLMAccess', 'a'),
      client.getRelated('LLMAccess', 'a', 'x'),
    ]) {
      const error = await rejection(call);
      expect(error.code).toBe('invalid');
      expect(error.message).toBe('Kind LLMAccess needs a namespace');
    }
    expect(host.objects.LLMAccess).toEqual([a]);
  });

  it('refuses a namespace for a cluster-scoped kind', async () => {
    const cluster: KdpObject = { metadata: { name: 'c' } };
    const { client } = start({ objects: { Region: [cluster] }, clusterScoped: ['Region'] });
    await expect(client.getObject('Region', 'c')).resolves.toEqual(cluster);
    await expect(client.listObjects('Region')).resolves.toEqual([cluster]);
    await expect(client.createObject('Region', { metadata: { name: 'd' } })).resolves.toEqual({
      apiVersion: 'v1',
      kind: 'Region',
      metadata: { name: 'd' },
    });
    for (const call of [
      client.listObjects('Region', 'default'),
      client.getObject('Region', 'c', 'default'),
      client.can('get', 'Region', 'default'),
    ]) {
      const error = await rejection(call);
      expect(error.code).toBe('invalid');
      expect(error.message).toBe('Kind Region is cluster-scoped');
    }
  });

  it('does not change the seed arrays', async () => {
    const seed = [a];
    const { client } = start({ objects: { LLMAccess: seed } });
    await client.deleteObject('LLMAccess', 'a', 'default');
    expect(seed).toEqual([a]);
  });

  it('gets an object by name and namespace', async () => {
    const { client } = start({ objects: { LLMAccess: [a, b] } });
    await expect(client.getObject('LLMAccess', 'b', 'other')).resolves.toEqual(b);
    await expect(client.getObject('LLMAccess', 'a', 'default')).resolves.toEqual(a);
    const error = await rejection(client.getObject('LLMAccess', 'a', 'other'));
    expect(error.code).toBe('not-found');
  });

  it('creates objects and rejects a duplicate with conflict', async () => {
    const { client } = start({ objects: { LLMAccess: [a] } });
    const c: KdpObject = { metadata: { name: 'c' }, spec: {} };

    const stamped = { apiVersion: 'v1', kind: 'LLMAccess' };
    await expect(client.createObject('LLMAccess', c, 'default')).resolves.toEqual({
      ...stamped,
      metadata: { name: 'c', namespace: 'default' },
      spec: {},
    });
    await expect(
      client.createObject('LLMAccess', { metadata: { name: 'd', namespace: 'x' } }),
    ).resolves.toEqual({ ...stamped, metadata: { name: 'd', namespace: 'x' } });
    await expect(
      client.createObject('LLMAccess', { metadata: { name: 'e', namespace: '' } }, 'default'),
    ).resolves.toEqual({ ...stamped, metadata: { name: 'e', namespace: 'default' } });
    expect(host.objects.LLMAccess?.map((o) => o.metadata.name)).toEqual(['a', 'c', 'd', 'e']);

    expect((await rejection(client.createObject('LLMAccess', a))).code).toBe('conflict');
    const differ = await rejection(client.createObject('LLMAccess', a, 'other'));
    expect(differ.code).toBe('invalid');
    expect(differ.message).toBe('The namespace parameter and metadata.namespace differ');
  });

  it('creates an object sent without metadata', async () => {
    const { client } = start({
      clusterScoped: ['Region'],
      context: { kinds: [{ group: '', kind: 'Region' }] },
    });
    await expect(client.createObject('Region', {} as KdpObject)).resolves.toEqual({
      apiVersion: 'v1',
      kind: 'Region',
      metadata: {},
    });
  });

  it('stamps kind and apiVersion as the Dashboard does', async () => {
    const seeded: KdpObject = { ...a, apiVersion: 'ai.kdp.k8c.io/v1alpha1', kind: 'LLMAccess' };
    const { client } = start({
      context: { kinds: [LLM_ACCESS, { group: 'ai.kdp.k8c.io', kind: 'LLMModel' }] },
      objects: { LLMAccess: [seeded] },
    });

    await expect(
      client.createObject('LLMAccess', { kind: 'Other', metadata: { name: 'x' } }, 'default'),
    ).resolves.toMatchObject({ apiVersion: 'ai.kdp.k8c.io/v1alpha1', kind: 'LLMAccess' });
    await expect(
      client.createObject('LLMModel', { metadata: { name: 'm' } }, 'default'),
    ).resolves.toMatchObject({ apiVersion: 'ai.kdp.k8c.io/v1', kind: 'LLMModel' });
    await expect(
      client.createObject(
        'LLMModel',
        { apiVersion: 'ai.kdp.k8c.io/v1alpha1', metadata: { name: 'n' } },
        'default',
      ),
    ).resolves.toMatchObject({ apiVersion: 'ai.kdp.k8c.io/v1alpha1' });
    await expect(
      client.createObject(
        'LLMModel',
        { apiVersion: 'other.example.com/v1', metadata: { name: 'o' } },
        'default',
      ),
    ).resolves.toMatchObject({ apiVersion: 'ai.kdp.k8c.io/v1' });
  });

  it.each<[string, (client: MockHost['client']) => Promise<unknown>]>([
    ['an empty name', (c) => c.getObject('LLMAccess', '', 'default')],
    ['a dot name', (c) => c.deleteObject('LLMAccess', '..', 'default')],
    ['a namespace that is not a DNS label', (c) => c.listObjects('LLMAccess', 'Team_A')],
    [
      'a metadata.namespace that is not a DNS label',
      (c) => c.createObject('LLMAccess', { metadata: { name: 'x', namespace: '../x' } }),
    ],
    ['a non-object to create', (c) => c.createObject('LLMAccess', [] as never)],
    ['non-object metadata', (c) => c.createObject('LLMAccess', { metadata: 'x' } as never)],
    ['a non-object patch', (c) => c.patchObject('LLMAccess', 'a', 'x', 'default')],
    ['an unknown verb', (c) => c.can('watch' as never, 'LLMAccess')],
    ['a malformed field path', (c) => c.getFieldOptions('LLMAccess', 'spec.a b')],
  ])('refuses %s with invalid-payload, as the Dashboard does', async (_, call) => {
    const { client } = start({
      objects: { LLMAccess: [a] },
      fail: { createObject: 'forbidden' },
    });
    expect((await rejection(call(client))).code).toBe('invalid-payload');
  });

  it('applies a JSON merge patch', async () => {
    const seeded: KdpObject = {
      metadata: { name: 'a', labels: { keep: 'y', drop: 'y' } },
      spec: { model: 'm', limits: { tokens: 1 } },
    };
    const { client } = start({ objects: { Region: [seeded] }, clusterScoped: ['Region'] });

    const patched = await client.patchObject('Region', 'a', {
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
    expect(host.objects.Region).toEqual([expected]);
  });

  it('rejects a patch for a missing object or one that removes the metadata', async () => {
    const { client } = start({ objects: { LLMAccess: [a] } });
    const patch = (name: string, value: unknown) =>
      rejection(client.patchObject('LLMAccess', name, value, 'default'));
    expect((await patch('x', {})).code).toBe('not-found');
    expect((await patch('a', { metadata: null })).code).toBe('invalid');
    expect((await patch('a', 'text')).code).toBe('invalid-payload');
    expect(host.objects.LLMAccess).toEqual([a]);
  });

  it('deletes objects', async () => {
    const { client } = start({ objects: { LLMAccess: [a, b] } });
    await expect(client.deleteObject('LLMAccess', 'a', 'default')).resolves.toBeNull();
    expect(host.objects.LLMAccess).toEqual([b]);
    expect((await rejection(client.deleteObject('LLMAccess', 'a', 'default'))).code).toBe(
      'not-found',
    );
  });

  it('returns configured related objects, or an empty list', async () => {
    const secret: KdpObject = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: { name: 'a-key', namespace: 'default' },
    };
    const { client } = start({
      objects: { LLMAccess: [{ metadata: { name: 'a', namespace: 'default' } }] },
      related: { 'LLMAccess/a/connection-details': [secret] },
    });
    await expect(
      client.getRelated('LLMAccess', 'a', 'connection-details', 'default'),
    ).resolves.toEqual([secret]);
    await expect(client.getRelated('LLMAccess', 'a', 'other', 'default')).resolves.toEqual([]);
    expect((await rejection(client.getRelated('LLMAccess', 'b', 'other', 'default'))).code).toBe(
      'not-found',
    );
  });

  it('returns seeded field options as copies, or fails with not-found', async () => {
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
    expect((await rejection(client.getFieldOptions('LLMAccess', 'spec.other'))).code).toBe(
      'not-found',
    );
  });

  it('answers can with true by default', async () => {
    const { client } = start({ context: { kinds: [LLM_ACCESS] } });
    await expect(client.can('delete', 'LLMAccess')).resolves.toBe(true);
  });

  it('answers can with a configured boolean or function', async () => {
    const { client } = start({ context: { kinds: [LLM_ACCESS] }, can: false });
    await expect(client.can('get', 'LLMAccess')).resolves.toBe(false);
    host.close();

    const can = vi.fn(({ verb }: { verb: string }) => verb === 'get');
    start({ context: { kinds: [LLM_ACCESS] }, can });
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
      context: { kinds: [LLM_ACCESS] },
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
