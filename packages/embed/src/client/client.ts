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
import type {
  EmbedContext,
  EmbedVerb,
  FieldOption,
  KdpObject,
  Theme,
} from '../protocol/messages.js';
import { createChannel } from './channel.js';

export const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;

export type ClientStatus = 'connected' | 'disconnected';

export interface KdpClientEvents {
  theme: (theme: Theme) => void;
  disconnected: () => void;
}

/**
 * A connection to the Dashboard. Every method rejects with a `KdpEmbedError`. An omitted
 * `namespace` is sent as omitted, and the Dashboard decides what it means.
 */
export interface KdpClient {
  readonly status: ClientStatus;
  /** The context from the handshake. `theme` follows the Dashboard's theme notifications. */
  readonly context: EmbedContext;
  readonly hostProtocolVersion: string;
  listObjects<T extends KdpObject = KdpObject>(kind: string, namespace?: string): Promise<T[]>;
  getObject<T extends KdpObject = KdpObject>(
    kind: string,
    name: string,
    namespace?: string,
  ): Promise<T>;
  createObject<T extends KdpObject = KdpObject>(
    kind: string,
    object: T,
    namespace?: string,
  ): Promise<T>;
  /** `patch` is a JSON merge patch (RFC 7386). */
  patchObject<T extends KdpObject = KdpObject>(
    kind: string,
    name: string,
    patch: unknown,
    namespace?: string,
  ): Promise<T>;
  deleteObject(kind: string, name: string, namespace?: string): Promise<null>;
  /**
   * The objects related to the object `name` of `kind` through the related-resource `identifier`;
   * may be empty.
   */
  getRelated<T extends KdpObject = KdpObject>(
    kind: string,
    name: string,
    identifier: string,
    namespace?: string,
  ): Promise<T[]>;
  /**
   * The choices the CRD declares for `field` of `kind`, e.g. `spec.llmModels[].id`, as the
   * Dashboard's forms show them; may be empty.
   */
  getFieldOptions(kind: string, field: string, namespace?: string): Promise<FieldOption[]>;
  /** Asks the Dashboard every time; answers are not cached. */
  can(verb: EmbedVerb, kind: string, namespace?: string): Promise<boolean>;
  /** Registers a listener and returns a function that removes it. */
  on<E extends keyof KdpClientEvents>(event: E, listener: KdpClientEvents[E]): () => void;
  /** Ends the connection and rejects pending requests with `disconnected`. Idempotent. */
  close(): void;
}

export interface ClientOptions {
  /** The port transferred with the host's accept message. */
  port: MessagePort;
  context: EmbedContext;
  hostProtocolVersion: string;
  requestTimeoutMs?: number;
}

function withNamespace<P extends object>(
  params: P,
  namespace: string | undefined,
): P & { namespace?: string } {
  return namespace === undefined ? params : { ...params, namespace };
}

export function createClient(options: ClientOptions): KdpClient {
  let context = options.context;
  const listeners: { [E in keyof KdpClientEvents]: Set<KdpClientEvents[E]> } = {
    theme: new Set(),
    disconnected: new Set(),
  };

  const channel = createChannel(options.port, {
    requestTimeoutMs: options.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS,
    onTheme(theme) {
      // A new object rather than a mutation, so that snapshot-based consumers see a change.
      context = { ...context, theme };
      for (const listener of [...listeners.theme]) listener(theme);
    },
    onClose() {
      const disconnected = [...listeners.disconnected];
      listeners.theme.clear();
      listeners.disconnected.clear();
      for (const listener of disconnected) listener();
    },
  });

  return {
    get status() {
      return channel.closed ? 'disconnected' : 'connected';
    },
    get context() {
      return context;
    },
    hostProtocolVersion: options.hostProtocolVersion,

    listObjects<T extends KdpObject = KdpObject>(kind: string, namespace?: string) {
      return channel.request('listObjects', withNamespace({ kind }, namespace)) as Promise<T[]>;
    },
    getObject<T extends KdpObject = KdpObject>(kind: string, name: string, namespace?: string) {
      return channel.request('getObject', withNamespace({ kind, name }, namespace)) as Promise<T>;
    },
    createObject<T extends KdpObject = KdpObject>(kind: string, object: T, namespace?: string) {
      return channel.request(
        'createObject',
        withNamespace({ kind, object }, namespace),
      ) as Promise<T>;
    },
    patchObject<T extends KdpObject = KdpObject>(
      kind: string,
      name: string,
      patch: unknown,
      namespace?: string,
    ) {
      return channel.request(
        'patchObject',
        withNamespace({ kind, name, patch }, namespace),
      ) as Promise<T>;
    },
    deleteObject(kind, name, namespace) {
      return channel.request('deleteObject', withNamespace({ kind, name }, namespace));
    },
    getRelated<T extends KdpObject = KdpObject>(
      kind: string,
      name: string,
      identifier: string,
      namespace?: string,
    ) {
      return channel.request(
        'getRelated',
        withNamespace({ kind, name, identifier }, namespace),
      ) as Promise<T[]>;
    },
    getFieldOptions(kind, field, namespace) {
      return channel.request('getFieldOptions', withNamespace({ kind, field }, namespace));
    },
    can(verb, kind, namespace) {
      return channel.request('can', withNamespace({ verb, kind }, namespace));
    },

    on(event, listener) {
      const set = listeners[event] as Set<typeof listener>;
      set.add(listener);
      return () => {
        set.delete(listener);
      };
    },
    close() {
      channel.close();
    },
  };
}
