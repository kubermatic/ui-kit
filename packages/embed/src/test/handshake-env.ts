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

/*
 * What the `unit` project (jsdom 30 on Node 24) offers for handshake tests,
 * checked with a throwaway test:
 *
 * - `MessageChannel` is Node's native one, leaking through as a global (jsdom
 *   does not define its own). Messages flow port1 -> port2 asynchronously, so
 *   channel and mock-host tests can use it directly.
 * - `window.postMessage(msg, '*', [port])` delivers a `message` event, but
 *   drops the transfer list (`event.ports` is empty), and sets `event.source`
 *   to `null` and `event.origin` to `''`. A page cannot be handed a port this
 *   way, and the `source === window.parent` check would never pass.
 * - In the unit project `window.parent === window`, so `connect()` sees
 *   "not embedded" unless that is faked.
 * - Dispatching `new MessageEvent('message', { source, origin, ports: [port] })`
 *   on `window` does work: `ports[0]` is the very Node port passed in and it
 *   still carries messages, and `source` and `origin` are kept as given.
 *
 * Strategy (design D4): handshake tests drive `connect()` through the
 * `environment` seam. The fake environment supplies a `parent` whose
 * `postMessage` records announcements, its own message listeners and timers
 * (or fake timers), and delivers accept and refuse messages as `MessageEvent`s
 * with chosen `source`/`origin` and a real `MessageChannel` port in
 * `ports[0]`. Real `window.postMessage` is not used for the handshake.
 */
export {};
