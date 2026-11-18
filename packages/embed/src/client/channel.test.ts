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
import { REQUEST } from '../protocol/messages.js';
import { type FakeHost, createFakeHost } from '../test/fake-host.js';
import { type Channel, createChannel } from './channel.js';

let host: FakeHost;
let channel: Channel;
const onTheme = vi.fn();
const onClose = vi.fn();

// A request the test never settles; it rejects with `disconnected` when the channel closes.
function pendingForever(request: Promise<unknown>): void {
  request.catch(() => undefined);
}

function open(requestTimeoutMs = 1_000): Channel {
  host = createFakeHost();
  channel = createChannel(host.port, { requestTimeoutMs, onTheme, onClose });
  return channel;
}

afterEach(() => {
  channel.close();
  host.dispose();
  onTheme.mockReset();
  onClose.mockReset();
});

describe('createChannel', () => {
  it('sends requests with IDs that increment per channel', async () => {
    open();
    pendingForever(channel.request('can', { verb: 'get', kind: 'Database' }));
    pendingForever(channel.request('listObjects', { kind: 'Database' }));
    expect(await host.nextRequest()).toEqual({
      type: REQUEST,
      id: 1,
      operation: 'can',
      params: { verb: 'get', kind: 'Database' },
    });
    expect((await host.nextRequest()).id).toBe(2);

    const otherHost = createFakeHost();
    const other = createChannel(otherHost.port, { requestTimeoutMs: 1_000, onTheme, onClose });
    pendingForever(other.request('can', { verb: 'get', kind: 'Database' }));
    expect((await otherHost.nextRequest()).id).toBe(1);
    other.close();
    otherHost.dispose();
  });

  it('matches out-of-order responses to their requests', async () => {
    open();
    const slow = channel.request('listObjects', { kind: 'Database' });
    const fast = channel.request('can', { verb: 'delete', kind: 'Database' });
    const first = await host.nextRequest();
    const second = await host.nextRequest();
    host.respond(second.id, false);
    host.respond(first.id, [{ metadata: { name: 'a' } }]);
    await expect(fast).resolves.toBe(false);
    await expect(slow).resolves.toEqual([{ metadata: { name: 'a' } }]);
  });

  it('ignores messages that are not protocol messages', async () => {
    open();
    const result = channel.request('can', { verb: 'get', kind: 'Database' });
    const { id } = await host.nextRequest();
    host.send({ type: 'webpackOk' });
    host.send({ type: 'kdp.embed.response', id, ok: 'yes' });
    host.send(null);
    host.respond(id, true);
    await expect(result).resolves.toBe(true);
  });

  it('rejects with the host’s failure', async () => {
    open();
    const result = channel.request('getObject', { kind: 'Database', name: 'a' });
    const { id } = await host.nextRequest();
    host.fail(id, { code: 'not-found', message: 'No such database', details: { name: 'a' } });
    const error = await result.catch((e: unknown) => e);
    expect(error).toBeInstanceOf(KdpEmbedError);
    expect(error).toMatchObject({
      code: 'not-found',
      message: 'No such database',
      details: { name: 'a' },
    });
  });

  it('rejects with invalid-payload when the params cannot be cloned', async () => {
    open();
    const result = channel.request('createObject', {
      kind: 'Database',
      object: { metadata: {}, callback: () => undefined },
    });
    await expect(result).rejects.toMatchObject({ code: 'invalid-payload' });
  });

  it('times out a request and ignores its late response', async () => {
    open(20);
    const result = channel.request('listObjects', { kind: 'Database' });
    const { id } = await host.nextRequest();
    await expect(result).rejects.toMatchObject({ code: 'timeout', kind: 'transport' });

    host.respond(id, []);
    const next = channel.request('can', { verb: 'get', kind: 'Database' });
    const second = await host.nextRequest();
    host.respond(second.id, true);
    await expect(next).resolves.toBe(true);
  });

  it('forwards theme notifications', async () => {
    open();
    const delivered = new Promise((resolve) => onTheme.mockImplementation(resolve));
    host.notifyTheme('dark');
    await expect(delivered).resolves.toBe('dark');
  });

  it('closes on a closing notification and rejects pending requests', async () => {
    open();
    const result = channel.request('listObjects', { kind: 'Database' });
    await host.nextRequest();
    const closed = new Promise((resolve) => onClose.mockImplementation(resolve));
    host.notifyClosing();
    await closed;
    await expect(result).rejects.toMatchObject({ code: 'disconnected' });
    expect(channel.closed).toBe(true);
  });

  it('closes once and rejects later requests', async () => {
    open();
    expect(channel.closed).toBe(false);
    channel.close();
    channel.close();
    expect(onClose).toHaveBeenCalledTimes(1);
    await expect(channel.request('can', { verb: 'get', kind: 'Database' })).rejects.toMatchObject({
      code: 'disconnected',
    });
  });
});
