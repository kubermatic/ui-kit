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
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import type { KdpClient } from '../client/client.js';
import { type ConnectOptions, type ConnectOutcome, connect } from '../client/connect.js';
import { type KdpConnection, KdpContext } from './hooks.js';

export type KdpProviderProps = { children?: ReactNode } & (
  | {
      /**
       * A client that is already connected, such as `createMockHost().client`. The provider then
       * skips the handshake and leaves closing the client to its owner.
       */
      client: KdpClient;
      options?: undefined;
    }
  | {
      client?: undefined;
      /** Passed to `connect()`. Read once, when the provider mounts. */
      options: ConnectOptions;
    }
);

/** Connects to the Dashboard on mount and closes the connection on unmount. */
export function KdpProvider({ children, client: injected, options }: KdpProviderProps) {
  const [outcome, setOutcome] = useState<ConnectOutcome>();
  const optionsRef = useRef(options);

  useEffect(() => {
    if (injected) return;
    const controller = new AbortController();
    let connected: KdpClient | undefined;
    connect({ ...(optionsRef.current as ConnectOptions), signal: controller.signal }).then(
      (result) => {
        if (result.status === 'connected') connected = result.client;
        // A handshake that settled just before the cleanup ran; StrictMode makes this common.
        if (controller.signal.aborted) connected?.close();
        else setOutcome(result);
      },
      (error: unknown) => {
        // Thrown from the updater, so the nearest error boundary sees it.
        if (!controller.signal.aborted) {
          setOutcome(() => {
            throw error;
          });
        }
      },
    );
    return () => {
      controller.abort();
      connected?.close();
      setOutcome(undefined);
    };
  }, [injected]);

  const handshake = outcome?.status === 'connected' ? outcome : undefined;
  const client = injected ?? handshake?.client;
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!client) return () => {};
      const offs = [client.on('theme', onChange), client.on('disconnected', onChange)];
      return () => offs.forEach((off) => off());
    },
    [client],
  );
  const getContext = () => client?.context;
  const getStatus = () => client?.status;
  const context = useSyncExternalStore(subscribe, getContext, getContext);
  const status = useSyncExternalStore(subscribe, getStatus, getStatus);

  const value = useMemo<KdpConnection>(() => {
    if (client && context) {
      return {
        state: status === 'disconnected' ? 'disconnected' : 'connected',
        client,
        context,
        outcome: injected ? undefined : handshake,
      };
    }
    // TypeScript cannot pair `state` with the matching `outcome` member on its own.
    if (outcome && !handshake) return { state: outcome.status, outcome } as KdpConnection;
    return { state: 'connecting' };
  }, [client, context, status, outcome, injected, handshake]);

  return <KdpContext value={value}>{children}</KdpContext>;
}
