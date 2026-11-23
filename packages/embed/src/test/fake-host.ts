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
  NOTIFY,
  RESPONSE,
  type Failure,
  type RequestMessage,
  type Theme,
  isRequestMessage,
} from '../protocol/messages.js';

/**
 * The host's end of a real `MessageChannel`, for channel and client tests. `port` is the page's
 * end; requests the page sends are queued until a test takes them with `nextRequest()`.
 */
export interface FakeHost {
  readonly port: MessagePort;
  readonly requests: RequestMessage[];
  nextRequest(): Promise<RequestMessage>;
  respond(id: number, result: unknown): void;
  fail(id: number, failure: Partial<Failure>): void;
  notifyTheme(theme: Theme): void;
  notifyClosing(): void;
  send(message: unknown): void;
  dispose(): void;
}

export function createFakeHost(): FakeHost {
  const { port1, port2 } = new MessageChannel();
  const requests: RequestMessage[] = [];
  const queue: RequestMessage[] = [];
  const waiters: ((request: RequestMessage) => void)[] = [];

  port1.addEventListener('message', (event: MessageEvent) => {
    const message: unknown = event.data;
    if (!isRequestMessage(message)) return;
    requests.push(message);
    const waiter = waiters.shift();
    if (waiter) waiter(message);
    else queue.push(message);
  });
  port1.start();

  const send = (message: unknown) => port1.postMessage(message);

  return {
    port: port2,
    requests,
    nextRequest() {
      const queued = queue.shift();
      if (queued) return Promise.resolve(queued);
      return new Promise((resolve) => waiters.push(resolve));
    },
    respond: (id, result) => send({ type: RESPONSE, id, ok: true, result }),
    fail: (id, failure) => send({ type: RESPONSE, id, ok: false, failure }),
    notifyTheme: (theme) => send({ type: NOTIFY, event: 'theme', theme }),
    notifyClosing: () => send({ type: NOTIFY, event: 'closing' }),
    send,
    dispose() {
      port1.close();
      port2.close();
    },
  };
}
