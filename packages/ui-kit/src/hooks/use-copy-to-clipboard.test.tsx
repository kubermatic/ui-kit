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
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCopyToClipboard } from './use-copy-to-clipboard';

/** jsdom has no clipboard; install one we can control per test. */
function setClipboard(writeText: ((value: string) => Promise<void>) | undefined) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: writeText ? { writeText } : undefined,
  });
}

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    setClipboard(undefined);
  });

  it('writes the value and reports success', async () => {
    const writeText = vi.fn(async () => {});
    setClipboard(writeText);

    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy('kubectl get secrets');
    });

    expect(writeText).toHaveBeenCalledWith('kubectl get secrets');
    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('clears the copied flag after the reset delay', async () => {
    setClipboard(vi.fn(async () => {}));
    const { result } = renderHook(() => useCopyToClipboard({ resetAfter: 500 }));

    await act(async () => {
      await result.current.copy('x');
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.copied).toBe(false);
  });

  /*
   * The reason this hook exists. `navigator.clipboard` is undefined on an
   * insecure origin — every `http://<node-ip>:30080` port-forward — and both
   * products' versions call `.writeText` on it and throw past their caller, so
   * the icon never changes and nothing says why.
   */
  it('reports a missing clipboard API rather than throwing', async () => {
    setClipboard(undefined);
    const { result } = renderHook(() => useCopyToClipboard());

    let returned: boolean | undefined;
    await act(async () => {
      returned = await result.current.copy('x');
    });

    expect(returned).toBe(false);
    expect(result.current.copied).toBe(false);
    expect(result.current.error?.message).toContain('secure origin');
  });

  it('reports a rejected write', async () => {
    setClipboard(vi.fn(async () => Promise.reject(new Error('denied'))));
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy('x');
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error?.message).toBe('denied');
  });

  /*
   * Copying twice in quick succession must not let the first timer clear the
   * flag set by the second copy.
   */
  it('restarts the timer on a second copy', async () => {
    setClipboard(vi.fn(async () => {}));
    const { result } = renderHook(() => useCopyToClipboard({ resetAfter: 1000 }));

    await act(async () => {
      await result.current.copy('one');
    });
    act(() => {
      vi.advanceTimersByTime(800);
    });
    await act(async () => {
      await result.current.copy('two');
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // 1200ms since the first copy, but only 400ms since the second.
    expect(result.current.copied).toBe(true);
  });
});
