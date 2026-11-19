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

import { afterEach, describe, expect, it, vi } from 'vitest';

import { windowEnvironment } from './environment.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('windowEnvironment', () => {
  it('describes the current window', () => {
    const env = windowEnvironment()!;
    expect(env.self).toBe(window);
    expect(env.parent).toBe(window.parent);
  });

  it('adds and removes message listeners on the window', () => {
    const env = windowEnvironment()!;
    const listener = vi.fn();
    env.addEventListener('message', listener);
    window.dispatchEvent(new MessageEvent('message', { data: 1 }));
    env.removeEventListener('message', listener);
    window.dispatchEvent(new MessageEvent('message', { data: 2 }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0]![0] as MessageEvent).data).toBe(1);
  });

  it('uses the global timers', () => {
    vi.useFakeTimers();
    const env = windowEnvironment()!;
    const once = vi.fn();
    const repeated = vi.fn();
    const cancelled = vi.fn();

    env.setTimeout(once, 100);
    const interval = env.setInterval(repeated, 100);
    env.clearTimeout(env.setTimeout(cancelled, 50));
    vi.advanceTimersByTime(300);
    env.clearInterval(interval);
    vi.advanceTimersByTime(300);

    expect(once).toHaveBeenCalledTimes(1);
    expect(repeated).toHaveBeenCalledTimes(3);
    expect(cancelled).not.toHaveBeenCalled();
  });

  it('is undefined without a window', () => {
    vi.stubGlobal('window', undefined);
    try {
      expect(windowEnvironment()).toBeUndefined();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
