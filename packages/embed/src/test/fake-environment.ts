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
import { type Mock, vi } from 'vitest';

import type { HandshakeEnvironment } from '../client/environment.js';

export const DASHBOARD_ORIGIN = 'https://kdp.example.com';

export interface DeliverInit {
  source?: unknown;
  origin?: string;
  ports?: MessagePort[];
}

/**
 * A framed page's window for handshake tests (see handshake-env.ts). Timers go through the
 * global functions at call time, so `vi.useFakeTimers()` controls them.
 */
export interface FakeEnvironment extends HandshakeEnvironment {
  readonly parent: { postMessage: Mock<(message: unknown, targetOrigin: string) => void> };
  readonly listenerCount: number;
  /** Delivers a `message` event as the parent would, from `DASHBOARD_ORIGIN` by default. */
  deliver(data: unknown, init?: DeliverInit): void;
}

export function createFakeEnvironment(): FakeEnvironment {
  const listeners = new Set<(event: MessageEvent) => void>();
  const parent = { postMessage: vi.fn<(message: unknown, targetOrigin: string) => void>() };

  return {
    self: {},
    parent,
    get listenerCount() {
      return listeners.size;
    },
    addEventListener: (_, listener) => listeners.add(listener),
    removeEventListener: (_, listener) => listeners.delete(listener),
    setTimeout: (callback, ms) => setTimeout(callback, ms),
    clearTimeout: (timer) => clearTimeout(timer),
    setInterval: (callback, ms) => setInterval(callback, ms),
    clearInterval: (timer) => clearInterval(timer),
    deliver(data, { source = parent, origin = DASHBOARD_ORIGIN, ports = [] } = {}) {
      // Only the fields `connect` reads; jsdom's MessageEvent would insist on a real window.
      const event = { type: 'message', data, source, origin, ports } as unknown as MessageEvent;
      for (const listener of [...listeners]) listener(event);
    },
  };
}
