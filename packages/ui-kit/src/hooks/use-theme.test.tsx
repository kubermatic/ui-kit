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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { setPrefersDark } from '@/test/match-media';

import { ThemeProvider, useTheme } from './use-theme';

function ThemeProbe() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme}/{resolvedTheme}
    </button>
  );
}

describe('useTheme', () => {
  it('exposes the default theme and toggles it', async () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey={null}>
        <ThemeProbe />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('light/light');

    await userEvent.click(button);

    expect(button).toHaveTextContent('dark/dark');
  });

  it('applies the dark class to the document root', async () => {
    render(
      <ThemeProvider defaultTheme="dark" storageKey={null}>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(document.documentElement).toHaveClass('dark');

    await userEvent.click(screen.getByRole('button'));

    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('throws when used outside a provider', () => {
    // React logs the error boundary trace; the assertion is on the throw.
    expect(() => render(<ThemeProbe />)).toThrow(/must be used within a <ThemeProvider>/);
  });
});

describe('useTheme persistence', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('writes the chosen theme to localStorage', async () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <ThemeProbe />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole('button'));

    expect(window.localStorage.getItem('test-theme')).toBe('dark');
  });

  it('restores a stored theme on a fresh mount', () => {
    window.localStorage.setItem('test-theme', 'dark');

    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('dark/dark');
  });

  it('ignores a corrupt stored value rather than trusting it', () => {
    window.localStorage.setItem('test-theme', 'chartreuse');

    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('light/light');
  });

  /*
   * Safari private mode and sandboxed iframes throw on localStorage access
   * rather than returning null. A theme preference must not take the app down.
   */
  it('survives localStorage throwing', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <ThemeProbe />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('light/light');

    await userEvent.click(button);

    expect(button).toHaveTextContent('dark/dark');
  });
});

describe('useTheme system resolution', () => {
  it('resolves `system` against the OS preference', () => {
    setPrefersDark(true);

    render(
      <ThemeProvider defaultTheme="system" storageKey={null}>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('system/dark');
  });

  it('follows the OS preference while it is being followed', () => {
    render(
      <ThemeProvider defaultTheme="system" storageKey={null}>
        <ThemeProbe />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('system/light');

    act(() => setPrefersDark(true));

    expect(screen.getByRole('button')).toHaveTextContent('system/dark');
  });

  it('stops following it once an explicit theme is chosen', async () => {
    render(
      <ThemeProvider defaultTheme="system" storageKey={null}>
        <ThemeProbe />
      </ThemeProvider>,
    );

    // toggle() from resolved light -> explicit dark
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('dark/dark');

    // The OS flipping to light must not drag the explicit choice with it.
    act(() => setPrefersDark(false));

    expect(screen.getByRole('button')).toHaveTextContent('dark/dark');
  });
});

describe('ThemeProvider token overrides', () => {
  function TokenProbe() {
    return <div data-testid="scope">scoped</div>;
  }

  it('writes overrides as custom properties on the theme root', () => {
    render(
      <ThemeProvider
        defaultTheme="light"
        storageKey={null}
        tokens={{ light: { primary: '#123456' } }}
      >
        <TokenProbe />
      </ThemeProvider>,
    );

    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#123456');
  });

  it('applies the half matching the resolved theme', () => {
    render(
      <ThemeProvider
        defaultTheme="dark"
        storageKey={null}
        tokens={{ light: { primary: '#111111' }, dark: { primary: '#eeeeee' } }}
      >
        <TokenProbe />
      </ThemeProvider>,
    );

    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#eeeeee');
  });

  it('leaves unspecified roles alone — an override is a patch, not a replacement', () => {
    render(
      <ThemeProvider
        defaultTheme="light"
        storageKey={null}
        tokens={{ light: { primary: '#123456' } }}
      >
        <TokenProbe />
      </ThemeProvider>,
    );

    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('');
  });

  it('releases the properties on unmount', () => {
    const { unmount } = render(
      <ThemeProvider
        defaultTheme="light"
        storageKey={null}
        tokens={{ light: { primary: '#123456' } }}
      >
        <TokenProbe />
      </ThemeProvider>,
    );
    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#123456');

    unmount();

    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('');
  });

  it('scopes the class and the overrides to getThemeRoot', () => {
    const scope = document.createElement('div');
    document.body.appendChild(scope);

    render(
      <ThemeProvider
        defaultTheme="dark"
        storageKey={null}
        getThemeRoot={() => scope}
        tokens={{ dark: { primary: '#abcdef' } }}
      >
        <TokenProbe />
      </ThemeProvider>,
    );

    expect(scope).toHaveClass('dark');
    expect(scope.style.getPropertyValue('--primary')).toBe('#abcdef');
    // The document root must be untouched when a scope is given.
    expect(document.documentElement).not.toHaveClass('dark');
    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('');

    scope.remove();
  });
});
