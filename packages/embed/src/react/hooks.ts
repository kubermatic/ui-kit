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
import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';

import type { KdpClient } from '../client/client.js';
import type { ConnectOutcome } from '../client/connect.js';
import type { EmbedContext, Theme } from '../protocol/messages.js';

export type KdpState = 'connecting' | ConnectOutcome['status'];

export interface KdpConnection {
  state: KdpState;
  /** Set while `state` is `connected`. */
  client?: KdpClient;
  /** The client's context; follows theme changes. Set while `state` is `connected`. */
  context?: EmbedContext;
  /** The handshake's result. Unset while connecting and for an injected client. */
  outcome?: ConnectOutcome;
  /**
   * True once the Dashboard closed the connection or the client was closed. `state` stays
   * `connected` so that the client and context remain available; their calls reject with
   * `disconnected`.
   */
  disconnected: boolean;
}

export const KdpContext = createContext<KdpConnection | undefined>(undefined);

/** The connection to the Dashboard. Must be used under a `KdpProvider`. */
export function useKdp(): KdpConnection {
  const connection = useContext(KdpContext);
  if (!connection) throw new Error('useKdp() and useKdpTheme() must be used inside a KdpProvider');
  return connection;
}

/** The Dashboard's current theme, rerendering on changes. `undefined` until connected. */
export function useKdpTheme(): Theme | undefined {
  const { client } = useKdp();
  const subscribe = useCallback(
    (onChange: () => void) => client?.on('theme', onChange) ?? (() => {}),
    [client],
  );
  const getTheme = () => client?.context.theme;
  return useSyncExternalStore(subscribe, getTheme, getTheme);
}
