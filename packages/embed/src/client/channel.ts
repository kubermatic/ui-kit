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
import { KdpEmbedError } from '../protocol/errors.js';
import {
  REQUEST,
  type Operation,
  type OperationParams,
  type OperationResult,
  type Theme,
  isNotifyMessage,
  isResponseMessage,
} from '../protocol/messages.js';

interface Pending {
  resolve(result: unknown): void;
  reject(error: KdpEmbedError): void;
  timer: ReturnType<typeof setTimeout>;
}

export interface ChannelOptions {
  requestTimeoutMs: number;
  onTheme(theme: Theme): void;
  /** Called once, when the host sends `closing` or `close()` is called. */
  onClose(): void;
}

export interface Channel {
  readonly closed: boolean;
  request<O extends Operation>(
    operation: O,
    params: OperationParams<O>,
  ): Promise<OperationResult<O>>;
  close(): void;
}

/** The page's end of the port: matches responses to requests by ID and handles notifications. */
export function createChannel(port: MessagePort, options: ChannelOptions): Channel {
  const pending = new Map<number, Pending>();
  let nextId = 1;
  let closed = false;

  function onMessage(event: MessageEvent): void {
    const message: unknown = event.data;
    if (isResponseMessage(message)) {
      // Unknown IDs are responses that arrived after their deadline, or duplicates.
      const entry = pending.get(message.id);
      if (!entry) return;
      pending.delete(message.id);
      clearTimeout(entry.timer);
      if (message.ok) entry.resolve(message.result);
      else entry.reject(KdpEmbedError.fromFailure(message.failure));
    } else if (isNotifyMessage(message)) {
      if (message.event === 'theme') options.onTheme(message.theme);
      else close();
    }
  }

  function close(): void {
    if (closed) return;
    closed = true;
    port.removeEventListener('message', onMessage);
    port.close();
    for (const entry of pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(new KdpEmbedError('disconnected'));
    }
    pending.clear();
    options.onClose();
  }

  function request<O extends Operation>(
    operation: O,
    params: OperationParams<O>,
  ): Promise<OperationResult<O>> {
    if (closed) return Promise.reject(new KdpEmbedError('disconnected'));
    const id = nextId++;
    return new Promise((resolve, reject) => {
      try {
        port.postMessage({ type: REQUEST, id, operation, params });
      } catch (error) {
        // `postMessage` throws synchronously when the params are not structured-clonable.
        reject(new KdpEmbedError('invalid-payload', undefined, error));
        return;
      }
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new KdpEmbedError('timeout'));
      }, options.requestTimeoutMs);
      pending.set(id, { resolve, reject, timer });
    });
  }

  port.addEventListener('message', onMessage);
  port.start();

  return {
    get closed() {
      return closed;
    },
    request,
    close,
  };
}
