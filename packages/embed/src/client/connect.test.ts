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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ACCEPT, ANNOUNCE, type EmbedContext, REFUSE } from '../protocol/messages.js';
import { PROTOCOL_VERSION } from '../protocol/version.js';
import {
  DASHBOARD_ORIGIN,
  type FakeEnvironment,
  createFakeEnvironment,
} from '../test/fake-environment.js';
import { type FakeHost, createFakeHost } from '../test/fake-host.js';
import { type ConnectOutcome, connect, connectWith } from './connect.js';

const context: EmbedContext = {
  workspace: 'acme:team',
  service: { id: 'svc-1', name: 'LLM' },
  kinds: [{ group: 'llm.example.com', kind: 'LLMAccess' }],
  object: { group: 'llm.example.com', kind: 'LLMAccess', name: 'a', namespace: 'default' },
  user: { name: 'alice' },
  theme: 'dark',
};

const accept = { type: ACCEPT, protocolVersion: '1.3', context };
const refuse = { type: REFUSE, protocolVersion: '2.0', reason: 'version-mismatch' };

let env: FakeEnvironment;
let host: FakeHost;
let outcome: ConnectOutcome | undefined;

function start(options?: Parameters<typeof connectWith>[1]): Promise<ConnectOutcome> {
  const promise = connectWith(env, options);
  void promise.then((value) => (outcome = value));
  return promise;
}

/** Lets the promise callbacks run, so `outcome` reflects whether the handshake has settled. */
async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

function expectCleanedUp(): void {
  expect(env.listenerCount).toBe(0);
  expect(vi.getTimerCount()).toBe(0);
}

beforeEach(() => {
  vi.useFakeTimers();
  env = createFakeEnvironment();
  host = createFakeHost();
  outcome = undefined;
});

afterEach(() => {
  if (outcome?.status === 'connected') outcome.client.close();
  host.dispose();
  vi.useRealTimers();
});

describe('connectWith', () => {
  describe('announcing', () => {
    it('posts an announcement with only the type, version and instance ID, at once', () => {
      void start();
      expect(env.parent.postMessage).toHaveBeenCalledTimes(1);
      const [message, targetOrigin] = env.parent.postMessage.mock.calls[0]!;
      expect(message).toStrictEqual({
        type: ANNOUNCE,
        protocolVersion: PROTOCOL_VERSION,
        instanceId: expect.any(String),
      });
      expect((message as { instanceId: string }).instanceId).not.toBe('');
      expect(targetOrigin).toBe('*');
    });

    it('uses one instance ID for every repeat of a call, and a new one per call', () => {
      void start();
      vi.advanceTimersByTime(500);
      void start();
      const ids = env.parent.postMessage.mock.calls.map(
        ([message]) => (message as { instanceId: string }).instanceId,
      );
      expect(ids).toHaveLength(4);
      expect(ids[1]).toBe(ids[0]);
      expect(ids[2]).toBe(ids[0]);
      expect(ids[3]).not.toBe(ids[0]);
    });

    it('falls back to getRandomValues when randomUUID is unavailable', async () => {
      vi.stubGlobal('crypto', {
        getRandomValues: crypto.getRandomValues.bind(crypto),
        randomUUID: undefined,
      });
      try {
        const promise = start();
        env.deliver(accept, { ports: [host.port] });
        await expect(promise).resolves.toMatchObject({ status: 'connected' });

        const other = createFakeEnvironment();
        void connectWith(other);
        const [first, second] = [env, other].map(
          ({ parent }) =>
            (parent.postMessage.mock.calls[0]![0] as { instanceId: string }).instanceId,
        );
        expect(first).toMatch(/^[0-9a-f]{32}$/);
        expect(second).toMatch(/^[0-9a-f]{32}$/);
        expect(second).not.toBe(first);
      } finally {
        vi.unstubAllGlobals();
      }
    });

    it('repeats the announcement every 250 ms until settled', async () => {
      void start();
      vi.advanceTimersByTime(249);
      expect(env.parent.postMessage).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(1);
      expect(env.parent.postMessage).toHaveBeenCalledTimes(2);
      vi.advanceTimersByTime(500);
      expect(env.parent.postMessage).toHaveBeenCalledTimes(4);

      env.deliver(accept, { ports: [host.port] });
      await flush();
      vi.advanceTimersByTime(1_000);
      expect(env.parent.postMessage).toHaveBeenCalledTimes(4);
      expectCleanedUp();
    });

    it('completes when the parent starts listening after the first announcement', async () => {
      const promise = start();
      // The host missed the first announcement and answers the second.
      vi.advanceTimersByTime(250);
      expect(env.parent.postMessage).toHaveBeenCalledTimes(2);
      env.deliver(accept, { ports: [host.port] });
      await expect(promise).resolves.toMatchObject({ status: 'connected' });
    });
  });

  describe('outcomes', () => {
    it('resolves not-embedded at once for a top-level document', async () => {
      const top = { ...env, self: env.parent };
      await expect(connectWith(top)).resolves.toEqual({ status: 'not-embedded' });
      expect(env.parent.postMessage).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
    });

    it('resolves connected with a populated context and a working client', async () => {
      const promise = start({ requestTimeoutMs: 5_000 });
      env.deliver(accept, { ports: [host.port] });
      const result = await promise;
      expectCleanedUp();
      if (result.status !== 'connected') throw new Error(`unexpected ${result.status}`);
      expect(result.hostProtocolVersion).toBe('1.3');
      expect(result.client.hostProtocolVersion).toBe('1.3');
      expect(result.client.status).toBe('connected');
      expect(result.client.context).toEqual(context);

      const allowed = result.client.can('get', 'LLMAccess');
      const request = await host.nextRequest();
      host.respond(request.id, true);
      await expect(allowed).resolves.toBe(true);
    });

    it('passes the request timeout to the client', async () => {
      const promise = start({ requestTimeoutMs: 5_000 });
      env.deliver(accept, { ports: [host.port] });
      const result = await promise;
      if (result.status !== 'connected') throw new Error(`unexpected ${result.status}`);

      const list = result.client.listObjects('LLMAccess');
      const rejected = expect(list).rejects.toMatchObject({ code: 'timeout' });
      await host.nextRequest();
      vi.advanceTimersByTime(4_999);
      await flush();
      expect(result.client.status).toBe('connected');
      vi.advanceTimersByTime(1);
      await rejected;
    });

    it('defaults the request timeout to 30 seconds', async () => {
      const promise = start();
      env.deliver(accept, { ports: [host.port] });
      const result = await promise;
      if (result.status !== 'connected') throw new Error(`unexpected ${result.status}`);

      let settled = false;
      const list = result.client.listObjects('LLMAccess').catch((error: unknown) => {
        settled = true;
        throw error;
      });
      const rejected = expect(list).rejects.toMatchObject({ code: 'timeout' });
      vi.advanceTimersByTime(29_999);
      await flush();
      expect(settled).toBe(false);
      vi.advanceTimersByTime(1);
      await rejected;
    });

    it('resolves version-mismatch with the host version on a refusal, without waiting', async () => {
      const promise = start();
      env.deliver(refuse);
      await expect(promise).resolves.toEqual({
        status: 'version-mismatch',
        hostProtocolVersion: '2.0',
      });
      expectCleanedUp();
    });

    it('treats a refusal with a reason it does not know as a version mismatch', async () => {
      const promise = start();
      env.deliver({ ...refuse, protocolVersion: '1.7', reason: 'maintenance' });
      await expect(promise).resolves.toEqual({
        status: 'version-mismatch',
        hostProtocolVersion: '1.7',
      });
    });

    it.each(['2.0', '0.9', 'v1.0', '1'])(
      'resolves version-mismatch when a host accepts with incompatible version %s',
      async (version) => {
        const { port1, port2 } = new MessageChannel();
        const close = vi.spyOn(port2, 'close');
        const promise = start();
        env.deliver({ ...accept, protocolVersion: version }, { ports: [port2] });
        await expect(promise).resolves.toEqual({
          status: 'version-mismatch',
          hostProtocolVersion: version,
        });
        expect(close).toHaveBeenCalled();
        expectCleanedUp();
        port1.close();
      },
    );

    it('resolves version-mismatch for an incompatible accept without a port', async () => {
      const promise = start();
      env.deliver({ ...accept, protocolVersion: '2.0' });
      await expect(promise).resolves.toMatchObject({ status: 'version-mismatch' });
    });

    it('resolves timed-out after 10 seconds by default', async () => {
      const promise = start();
      vi.advanceTimersByTime(9_999);
      await flush();
      expect(outcome).toBeUndefined();
      vi.advanceTimersByTime(1);
      await expect(promise).resolves.toEqual({ status: 'timed-out' });
      expect(env.parent.postMessage).toHaveBeenCalledTimes(40);
      expectCleanedUp();
    });

    it('honours a custom handshake timeout', async () => {
      const promise = start({ handshakeTimeoutMs: 1_000 });
      vi.advanceTimersByTime(1_000);
      await expect(promise).resolves.toEqual({ status: 'timed-out' });
    });

    it('keeps waiting when an accept carries no port', async () => {
      void start();
      env.deliver(accept);
      await flush();
      expect(outcome).toBeUndefined();
      env.deliver(accept, { ports: [host.port] });
      await flush();
      expect(outcome?.status).toBe('connected');
    });

    it('ignores foreign messages on the window', async () => {
      void start({ handshakeTimeoutMs: 1_000 });
      env.deliver({ type: 'webpackOk' });
      env.deliver('kdp.embed.accept');
      env.deliver(null);
      env.deliver({ type: ANNOUNCE, protocolVersion: '1.0' });
      env.deliver({ type: ACCEPT, protocolVersion: '1.0' }, { ports: [host.port] });
      env.deliver({ type: REFUSE, protocolVersion: '2.0' });
      await flush();
      expect(outcome).toBeUndefined();
      vi.advanceTimersByTime(1_000);
      await flush();
      expect(outcome).toEqual({ status: 'timed-out' });
    });
  });

  describe('sources and origins', () => {
    it('ignores an accept from a window other than the parent', async () => {
      void start({ handshakeTimeoutMs: 1_000 });
      env.deliver(accept, { source: {}, ports: [host.port] });
      env.deliver(refuse, { source: null });
      await flush();
      expect(outcome).toBeUndefined();
      vi.advanceTimersByTime(1_000);
      await flush();
      expect(outcome).toEqual({ status: 'timed-out' });
    });

    it('accepts any origin from the parent when no origins are expected', async () => {
      const promise = start();
      env.deliver(accept, { origin: 'https://other.example.com', ports: [host.port] });
      await expect(promise).resolves.toMatchObject({ status: 'connected' });
    });

    it('ignores an accept from an unlisted origin and keeps waiting', async () => {
      void start({ expectedOrigins: [DASHBOARD_ORIGIN] });
      env.deliver(accept, { origin: 'https://evil.example.com', ports: [host.port] });
      env.deliver(refuse, { origin: 'https://evil.example.com' });
      await flush();
      expect(outcome).toBeUndefined();
      expect(env.listenerCount).toBe(1);

      env.deliver(accept, { origin: DASHBOARD_ORIGIN, ports: [host.port] });
      await flush();
      expect(outcome?.status).toBe('connected');
    });
  });
});

describe('connect', () => {
  it('resolves not-embedded in a top-level window', async () => {
    await expect(connect()).resolves.toEqual({ status: 'not-embedded' });
  });

  it('resolves not-embedded without a window', async () => {
    vi.stubGlobal('window', undefined);
    try {
      await expect(connect({ handshakeTimeoutMs: 1 })).resolves.toEqual({
        status: 'not-embedded',
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
