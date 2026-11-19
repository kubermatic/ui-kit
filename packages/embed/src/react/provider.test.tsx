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

import { act, render, renderHook, screen } from '@testing-library/react';
import { Component, type ReactNode, StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type ConnectOptions, type ConnectOutcome, connect } from '../client/connect.js';
import { type MockHost, createMockHost } from '../testing/mock-host.js';
import { useKdp, useKdpTheme } from './hooks.js';
import { KdpProvider } from './provider.js';

vi.mock('../client/connect.js', () => ({ connect: vi.fn() }));

const connectMock = vi.mocked(connect);

const ANY: ConnectOptions = { expectedOrigins: '*' };

interface Handshake {
  resolve(outcome: ConnectOutcome): void;
}

let handshakes: Handshake[];
let hosts: MockHost[];

function mockHost(...args: Parameters<typeof createMockHost>): MockHost {
  const host = createMockHost(...args);
  hosts.push(host);
  return host;
}

function connected(host: MockHost): ConnectOutcome {
  return { status: 'connected', client: host.client };
}

async function settle(index: number, outcome: ConnectOutcome) {
  await act(async () => {
    handshakes[index]!.resolve(outcome);
    await Promise.resolve();
  });
}

function Probe() {
  const { state, client, context, outcome } = useKdp();
  const theme = useKdpTheme();
  return (
    <output>
      {[
        state,
        client ? 'client' : 'no-client',
        context?.workspace ?? 'no-context',
        context?.theme ?? 'no-context-theme',
        theme ?? 'no-theme',
        outcome?.status ?? 'no-outcome',
      ].join(' ')}
    </output>
  );
}

const text = () => screen.getByRole('status').textContent;

class Boundary extends Component<{ children: ReactNode }, { error?: Error }> {
  override state: { error?: Error } = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override render() {
    return this.state.error ? <p role="alert">{this.state.error.message}</p> : this.props.children;
  }
}

beforeEach(() => {
  handshakes = [];
  hosts = [];
  connectMock.mockImplementation(
    () => new Promise<ConnectOutcome>((resolve) => handshakes.push({ resolve })),
  );
});

afterEach(() => {
  for (const host of hosts) host.close();
  connectMock.mockReset();
});

describe('KdpProvider', () => {
  it('reports connecting and no client before the handshake completes', () => {
    render(
      <KdpProvider options={{ ...ANY, handshakeTimeoutMs: 500 }}>
        <Probe />
      </KdpProvider>,
    );
    expect(text()).toBe('connecting no-client no-context no-context-theme no-theme no-outcome');
    expect(connectMock).toHaveBeenCalledExactlyOnceWith({
      ...ANY,
      handshakeTimeoutMs: 500,
      signal: expect.any(AbortSignal),
    });
  });

  it('reports connected with the client and context after the handshake', async () => {
    const host = mockHost({ context: { workspace: 'acme' } });
    render(
      <KdpProvider options={ANY}>
        <Probe />
      </KdpProvider>,
    );
    await settle(0, connected(host));
    expect(text()).toBe('connected client acme light light connected');
  });

  it('reports an outcome other than connected', async () => {
    render(
      <KdpProvider options={ANY}>
        <Probe />
      </KdpProvider>,
    );
    await settle(0, { status: 'not-embedded' });
    expect(text()).toBe('not-embedded no-client no-context no-context-theme no-theme not-embedded');
  });

  it('closes the client on unmount', async () => {
    const host = mockHost();
    const { unmount } = render(
      <KdpProvider options={ANY}>
        <Probe />
      </KdpProvider>,
    );
    await settle(0, connected(host));
    unmount();
    expect(host.client.status).toBe('disconnected');
  });

  it('uses an injected client without a handshake and leaves it open on unmount', () => {
    const host = mockHost();
    const { unmount } = render(
      <KdpProvider client={host.client}>
        <Probe />
      </KdpProvider>,
    );
    expect(text()).toBe('connected client demo light light no-outcome');
    expect(connectMock).not.toHaveBeenCalled();
    unmount();
    expect(host.client.status).toBe('connected');
  });

  it('rerenders on theme changes', async () => {
    const host = mockHost();
    render(
      <KdpProvider client={host.client}>
        <Probe />
      </KdpProvider>,
    );
    const changed = new Promise((resolve) => host.client.on('theme', resolve));
    await act(async () => {
      host.notifyTheme('dark');
      await changed;
    });
    expect(text()).toBe('connected client demo dark dark no-outcome');
  });

  it('reports a disconnect by the host', async () => {
    const host = mockHost();
    render(
      <KdpProvider client={host.client}>
        <Probe />
      </KdpProvider>,
    );
    const closed = new Promise((resolve) => host.client.on('disconnected', () => resolve(null)));
    await act(async () => {
      host.close();
      await closed;
    });
    expect(text()).toBe('disconnected client demo light light no-outcome');
  });

  it('keeps a single open channel under StrictMode', async () => {
    const first = mockHost({ context: { workspace: 'first' } });
    const second = mockHost({ context: { workspace: 'second' } });
    render(
      <StrictMode>
        <KdpProvider options={ANY}>
          <Probe />
        </KdpProvider>
      </StrictMode>,
    );
    expect(connectMock).toHaveBeenCalledTimes(2);

    await settle(0, connected(first));
    await settle(1, connected(second));

    expect(first.client.status).toBe('disconnected');
    expect(second.client.status).toBe('connected');
    expect(text()).toBe('connected client second light light connected');
  });

  it('aborts a pending handshake on unmount', () => {
    const { unmount } = render(
      <KdpProvider options={ANY}>
        <Probe />
      </KdpProvider>,
    );
    const { signal } = connectMock.mock.calls[0]![0];
    expect(signal?.aborted).toBe(false);
    unmount();
    expect(signal?.aborted).toBe(true);
  });

  it('aborts the first handshake under StrictMode', () => {
    render(
      <StrictMode>
        <KdpProvider options={ANY}>
          <Probe />
        </KdpProvider>
      </StrictMode>,
    );
    const [first, second] = connectMock.mock.calls.map(([options]) => options.signal);
    expect(first?.aborted).toBe(true);
    expect(second?.aborted).toBe(false);
  });

  it('keeps the aborted StrictMode handshake out of the error boundary', async () => {
    connectMock.mockImplementation(
      ({ signal }) =>
        new Promise((_, reject) =>
          signal?.addEventListener('abort', () => reject(signal.reason as Error)),
        ),
    );
    render(
      <StrictMode>
        <Boundary>
          <KdpProvider options={ANY}>
            <Probe />
          </KdpProvider>
        </Boundary>
      </StrictMode>,
    );
    await act(() => Promise.resolve());
    expect(screen.queryByRole('alert')).toBeNull();
    expect(text()).toMatch(/^connecting /);
  });

  it('passes a failed handshake to the error boundary', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    connectMock.mockRejectedValue(new TypeError('connect() needs expectedOrigins'));
    render(
      <Boundary>
        <KdpProvider options={ANY}>
          <Probe />
        </KdpProvider>
      </Boundary>,
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('connect() needs expectedOrigins');
    vi.restoreAllMocks();
  });

  it('starts over when an injected client is removed', async () => {
    const host = mockHost({ context: { workspace: 'handshake' } });
    const injected = mockHost({ context: { workspace: 'injected' } });
    const { rerender } = render(
      <KdpProvider options={ANY}>
        <Probe />
      </KdpProvider>,
    );
    await settle(0, connected(host));
    rerender(
      <KdpProvider client={injected.client}>
        <Probe />
      </KdpProvider>,
    );
    expect(text()).toBe('connected client injected light light no-outcome');
    expect(host.client.status).toBe('disconnected');
    rerender(
      <KdpProvider options={ANY}>
        <Probe />
      </KdpProvider>,
    );
    expect(text()).toBe('connecting no-client no-context no-context-theme no-theme no-outcome');
  });

  it('ignores a discarded handshake that did not connect', async () => {
    render(
      <StrictMode>
        <KdpProvider options={ANY}>
          <Probe />
        </KdpProvider>
      </StrictMode>,
    );
    await settle(0, { status: 'timed-out' });
    expect(text()).toContain('connecting');
  });
});

describe('useKdp', () => {
  it('throws outside a KdpProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useKdp())).toThrow(/inside a KdpProvider/);
    expect(() => renderHook(() => useKdpTheme())).toThrow(/inside a KdpProvider/);
    vi.restoreAllMocks();
  });
});
