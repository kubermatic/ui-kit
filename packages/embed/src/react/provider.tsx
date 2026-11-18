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
import { type ReactNode, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

import type { KdpClient } from '../client/client.js';
import { type ConnectOptions, type ConnectOutcome, connect } from '../client/connect.js';
import { type KdpConnection, KdpContext } from './hooks.js';

export interface KdpProviderProps {
  children?: ReactNode;
  /**
   * A client that is already connected, such as `createMockHost().client`. The provider then
   * skips the handshake and leaves closing the client to its owner.
   */
  client?: KdpClient;
  /** Passed to `connect()`. Read once, when the provider mounts. */
  options?: ConnectOptions;
}

function subscribeTo(client: KdpClient | undefined) {
  return (onChange: () => void) => {
    if (!client) return () => {};
    const offTheme = client.on('theme', onChange);
    const offDisconnected = client.on('disconnected', onChange);
    return () => {
      offTheme();
      offDisconnected();
    };
  };
}

/** Connects to the Dashboard on mount and closes the connection on unmount. */
export function KdpProvider({ children, client: injected, options }: KdpProviderProps) {
  const [outcome, setOutcome] = useState<ConnectOutcome>();
  const optionsRef = useRef(options);

  useEffect(() => {
    if (injected) return;
    let cancelled = false;
    let connected: KdpClient | undefined;
    void connect(optionsRef.current).then((result) => {
      if (result.status === 'connected') connected = result.client;
      // StrictMode runs this effect twice; the first handshake's client is closed, not used.
      if (cancelled) connected?.close();
      else setOutcome(result);
    });
    return () => {
      cancelled = true;
      connected?.close();
      setOutcome(undefined);
    };
  }, [injected]);

  const client = injected ?? (outcome?.status === 'connected' ? outcome.client : undefined);
  const subscribe = useMemo(() => subscribeTo(client), [client]);
  const getContext = () => client?.context;
  const getStatus = () => client?.status;
  const context = useSyncExternalStore(subscribe, getContext, getContext);
  const status = useSyncExternalStore(subscribe, getStatus, getStatus);

  const value = useMemo<KdpConnection>(
    () => ({
      state: injected ? 'connected' : (outcome?.status ?? 'connecting'),
      client,
      context,
      outcome: injected ? undefined : outcome,
      disconnected: status === 'disconnected',
    }),
    [injected, outcome, client, context, status],
  );

  return <KdpContext value={value}>{children}</KdpContext>;
}
