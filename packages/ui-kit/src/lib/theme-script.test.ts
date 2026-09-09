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

/**
 * The script is a string, so nothing typechecks it. These tests run it the way
 * the browser will — evaluated against a real document — because the failure
 * mode otherwise is a syntax error that ships to production and takes the
 * whole `<head>` with it.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { setPrefersDark } from '../test/match-media.js';

import { DEFAULT_STORAGE_KEY, themeScript } from './theme-script.js';

/**
 * Evaluate the snippet exactly as an inline `<script>` would.
 *
 * `no-implied-eval` is correct in general and wrong here: the artefact under
 * test *is* a string of source, and checking it any other way would be
 * checking something other than what ships.
 */
function run(script: string): void {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
  new Function(script)();
}

afterEach(() => {
  localStorage.clear();
});

describe('themeScript', () => {
  it('applies a stored dark preference before React runs', () => {
    localStorage.setItem(DEFAULT_STORAGE_KEY, 'dark');
    run(themeScript());

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('applies a stored light preference over a dark system setting', () => {
    setPrefersDark(true);
    localStorage.setItem(DEFAULT_STORAGE_KEY, 'light');
    run(themeScript());

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('resolves `system` against the media query', () => {
    setPrefersDark(true);
    localStorage.setItem(DEFAULT_STORAGE_KEY, 'system');
    run(themeScript());

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('falls back to the system preference when nothing is stored', () => {
    setPrefersDark(true);
    run(themeScript());

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('honours an explicit defaultTheme when nothing is stored', () => {
    setPrefersDark(false);
    run(themeScript({ defaultTheme: 'dark' }));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('ignores a stored value that is not a theme', () => {
    localStorage.setItem(DEFAULT_STORAGE_KEY, 'aubergine');
    setPrefersDark(true);
    run(themeScript({ defaultTheme: 'light' }));

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('reads the storage key it is given', () => {
    localStorage.setItem('tenant-theme', 'dark');
    run(themeScript({ storageKey: 'tenant-theme' }));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  /*
   * The key is interpolated into source that runs before anything else on the
   * page, so it goes through JSON.stringify. A key containing a quote must
   * produce a script that still parses.
   */
  it('escapes the storage key rather than concatenating it', () => {
    const script = themeScript({ storageKey: '";document.title="pwned' });
    expect(() => run(script)).not.toThrow();
    expect(document.title).not.toBe('pwned');
  });

  /*
   * Safari private mode and sandboxed iframes throw on storage access. A throw
   * here would abort parsing of the document head.
   */
  it('survives unavailable storage', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    try {
      expect(() => run(themeScript())).not.toThrow();
    } finally {
      getItem.mockRestore();
    }
  });
});
