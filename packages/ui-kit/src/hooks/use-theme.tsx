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
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import { DEFAULT_STORAGE_KEY } from '../lib/theme-script.js';
import type { ThemeTokenName } from '../styles/tokens.js';

export type Theme = 'light' | 'dark' | 'system';
/** The theme actually painted, once `system` has been resolved. */
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const MEDIA_QUERY = '(prefers-color-scheme: dark)';

function subscribeToSystem(onChange: () => void): () => void {
  const query = window.matchMedia(MEDIA_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
}

/** On the server there is no preference to read; assume light and correct on hydration. */
function getServerSystemTheme(): ResolvedTheme {
  return 'light';
}

/*
 * The persisted theme, exposed as an external store.
 *
 * Reading localStorage in a `useState` initialiser is the usual shortcut and
 * it is wrong under SSR: the server renders `defaultTheme` while the client's
 * hydration render returns the stored value, so any component rendering from
 * `useTheme()` produces markup React did not expect. `useSyncExternalStore`
 * takes an explicit server snapshot, and subscribing buys cross-tab sync for
 * free.
 */
const storageListeners = new Set<() => void>();

function subscribeToStoredTheme(onChange: () => void): () => void {
  storageListeners.add(onChange);
  // `storage` fires only in *other* tabs — exactly the cross-tab case.
  // Same-tab writes notify through the set above.
  window.addEventListener('storage', onChange);
  return () => {
    storageListeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** Used when persistence is disabled, so the subscription is inert. */
const subscribeToNothing = () => () => {};

function readStoredTheme(storageKey: string): Theme | null {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : null;
  } catch {
    // Sandboxed iframes and Safari private mode throw on access rather than
    // returning null. A theme preference is not worth taking the app down for.
    return null;
  }
}

function writeStoredTheme(storageKey: string, theme: Theme): void {
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
    // See readStoredTheme — persistence is best-effort.
  }
  for (const listener of storageListeners) listener();
}

/**
 * The semantic roles a consumer may override, and a partial palette of them.
 *
 * Re-exported rather than declared: the role list is the token contract, and
 * it lives in `styles/tokens.ts` alongside what each role is for and which
 * pairs are contrast-checked. Declaring it twice is how the type and the
 * stylesheet drift apart.
 */
export type { ThemeTokenName } from '../styles/tokens.js';

/** A partial palette: any subset of roles, in any CSS-valid value. */
export type ThemeTokens = Partial<Record<ThemeTokenName, string>>;

/**
 * A runtime theme. Both halves are optional — supply only `light` and the dark
 * palette keeps the built-in values.
 */
export interface ThemeOverrides {
  light?: ThemeTokens;
  dark?: ThemeTokens;
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Theme used before anything is stored. Defaults to `system`. */
  defaultTheme?: Theme;
  /**
   * localStorage key. Set to `null` to disable persistence.
   *
   * If you also inline `themeScript()`, pass the same key to both.
   */
  storageKey?: string | null;
  /**
   * Resolves the element that receives the `.dark` class. Defaults to
   * `<html>`. A getter rather than an element so the target is looked up
   * inside the effect, once refs are attached.
   */
  getThemeRoot?: () => HTMLElement | null;
  /**
   * Runtime palette overrides, written as inline custom properties on the
   * theme root.
   *
   * This works because `@theme inline` compiles utilities straight to
   * `var(--primary)` rather than through a `--color-primary` indirection, so a
   * value set on any ancestor cascades to every utility beneath it.
   */
  tokens?: ThemeOverrides;
}

/**
 * Owns the theme for a tree: resolves `system`, persists the choice, and
 * toggles the `.dark` class that `theme.css` keys its palette off.
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = DEFAULT_STORAGE_KEY,
  getThemeRoot,
  tokens,
}: ThemeProviderProps) {
  /*
   * Storage is the source of truth when it is available; session state is the
   * fallback. Both are kept in step, because if localStorage is unreadable —
   * Safari private mode, a sandboxed iframe — session state is the only thing
   * holding the user's choice, and without it the theme silently becomes
   * unchangeable rather than merely unpersisted.
   */
  const [sessionTheme, setSessionTheme] = useState<Theme>(defaultTheme);

  const theme = useSyncExternalStore(
    storageKey ? subscribeToStoredTheme : subscribeToNothing,
    () => (storageKey ? (readStoredTheme(storageKey) ?? sessionTheme) : sessionTheme),
    () => defaultTheme,
  );

  // Subscribing beats mirroring into state: no effect, no cascading render.
  const systemTheme = useSyncExternalStore(subscribeToSystem, getSystemTheme, getServerSystemTheme);

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  // The one genuine side effect: push the resolved theme onto the DOM.
  useEffect(() => {
    const target = getThemeRoot?.() ?? document.documentElement;
    if (!target) return;

    target.classList.toggle('dark', resolvedTheme === 'dark');
    target.style.colorScheme = resolvedTheme;
  }, [resolvedTheme, getThemeRoot]);

  /*
   * Serialised rather than passed by identity: consumers overwhelmingly pass an
   * object literal, which would be a new reference every render and re-run this
   * effect on each one.
   */
  const activeTokensJson = JSON.stringify(
    (resolvedTheme === 'dark' ? tokens?.dark : tokens?.light) ?? {},
  );

  useEffect(() => {
    const target = getThemeRoot?.() ?? document.documentElement;
    if (!target) return;

    const entries = Object.entries(JSON.parse(activeTokensJson) as Record<string, string>);
    for (const [name, value] of entries) {
      target.style.setProperty(`--${name}`, value);
    }

    // Roles must be released when they change or the provider unmounts;
    // otherwise a removed override would linger on the element.
    return () => {
      for (const [name] of entries) {
        target.style.removeProperty(`--${name}`);
      }
    };
  }, [activeTokensJson, getThemeRoot]);

  const setTheme = useCallback(
    (next: Theme) => {
      setSessionTheme(next);
      if (storageKey) writeStoredTheme(storageKey, next);
    },
    [storageKey],
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Read and change the current theme. Must be used under a `ThemeProvider`. */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return context;
}
