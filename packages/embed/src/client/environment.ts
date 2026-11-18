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

type Timer = ReturnType<typeof setTimeout>;
type MessageListener = (event: MessageEvent) => void;

/**
 * The window access the handshake needs. Tests supply their own, because jsdom cannot transfer a
 * port through `window.postMessage` and its window is its own parent. Not part of the public API.
 */
export interface HandshakeEnvironment {
  readonly self: unknown;
  readonly parent: { postMessage(message: unknown, targetOrigin: string): void };
  addEventListener(type: 'message', listener: MessageListener): void;
  removeEventListener(type: 'message', listener: MessageListener): void;
  setTimeout(callback: () => void, ms: number): Timer;
  clearTimeout(timer: Timer): void;
  setInterval(callback: () => void, ms: number): Timer;
  clearInterval(timer: Timer): void;
}

/** The environment of the current window, or `undefined` outside a browser (e.g. during SSR). */
export function windowEnvironment(): HandshakeEnvironment | undefined {
  if (typeof window === 'undefined') return undefined;
  const win = window;
  return {
    self: win,
    parent: win.parent,
    addEventListener: (type, listener) => win.addEventListener(type, listener),
    removeEventListener: (type, listener) => win.removeEventListener(type, listener),
    setTimeout: (callback, ms) => setTimeout(callback, ms),
    clearTimeout: (timer) => clearTimeout(timer),
    setInterval: (callback, ms) => setInterval(callback, ms),
    clearInterval: (timer) => clearInterval(timer),
  };
}
