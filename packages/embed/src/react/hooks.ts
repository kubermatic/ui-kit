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
import { createContext, useContext } from 'react';

import type { KdpClient } from '../client/client.js';
import type { ConnectOutcome } from '../client/connect.js';
import type { EmbedContext, Theme } from '../protocol/messages.js';

type Failed<O extends ConnectOutcome> = O extends { status: 'connected' }
  ? never
  : { state: O['status']; client?: undefined; context?: undefined; outcome: O };

export type KdpConnection =
  | { state: 'connecting'; client?: undefined; context?: undefined; outcome?: undefined }
  | {
      /**
       * `disconnected` once the Dashboard closed the connection or the client was closed. `client`
       * and `context` stay readable then; their calls reject with `disconnected`.
       */
      state: 'connected' | 'disconnected';
      client: KdpClient;
      /** The client's context; follows theme changes. */
      context: EmbedContext;
      /** The handshake's result; unset for an injected client. */
      outcome?: Extract<ConnectOutcome, { status: 'connected' }>;
    }
  | Failed<ConnectOutcome>;

export type KdpState = KdpConnection['state'];

export const KdpContext = createContext<KdpConnection | undefined>(undefined);

/** The connection to the Dashboard. Must be used under a `KdpProvider`. */
export function useKdp(): KdpConnection {
  const connection = useContext(KdpContext);
  if (!connection) throw new Error('useKdp() and useKdpTheme() must be used inside a KdpProvider');
  return connection;
}

/** The Dashboard's current theme, rerendering on changes. `undefined` until connected. */
export function useKdpTheme(): Theme | undefined {
  return useKdp().context?.theme;
}
