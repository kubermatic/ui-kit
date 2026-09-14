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
import type { Theme } from '../hooks/use-theme.js';

/**
 * No `'use client'` here, deliberately. This module is meant to be called
 * from a Server Component or a document template — the string it returns is
 * inlined into the HTML, and the code inside it never goes through React.
 */

export interface ThemeScriptOptions {
  /**
   * Must match the `storageKey` given to `ThemeProvider`. Defaults to the
   * provider's own default.
   */
  storageKey?: string;
  /** Used when nothing is stored. Defaults to `system`. */
  defaultTheme?: Theme;
}

/** Kept in one place so the provider and the script cannot disagree. */
export const DEFAULT_STORAGE_KEY = 'kubermatic-theme';

/**
 * The blocking script that prevents a flash of the wrong theme.
 *
 * `ThemeProvider` applies `.dark` in an effect, which is the earliest React
 * can do it — by then the server-rendered markup has already painted, so a
 * user who chose dark sees a white flash on every navigation to a fresh
 * document. The only fix is to run before first paint, which means a
 * synchronous script in `<head>`, above the stylesheets. `next-themes` does
 * the same thing for the same reason.
 *
 * Shipping it as a function rather than a snippet in the README is the point:
 * the script has to agree with the provider about the storage key, the
 * accepted values and the class name, and a copy pasted into four products
 * will not stay in agreement.
 *
 * ```tsx
 * // app/layout.tsx
 * <head>
 *   <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
 * </head>
 * ```
 *
 * It is safe to inline: the only interpolated value is `storageKey`, which is
 * passed through `JSON.stringify`, and the script writes nothing to the page.
 * If you serve a `script-src` CSP, give the tag the same nonce as your other
 * inline scripts.
 */
export function themeScript({
  storageKey = DEFAULT_STORAGE_KEY,
  defaultTheme = 'system',
}: ThemeScriptOptions = {}): string {
  const key = JSON.stringify(storageKey);
  const fallback = JSON.stringify(defaultTheme);

  /*
   * ES5, no optional chaining, and wrapped in try/catch on purpose: this runs
   * before any bundle, unpolyfilled, and a throw here would block the parser
   * and leave the page unstyled. Safari private mode and sandboxed iframes
   * throw on `localStorage` access rather than returning null.
   */
  return `!function(){try{var s=localStorage.getItem(${key});var t=s==="light"||s==="dark"||s==="system"?s:${fallback};var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light"}catch(_){}}()`;
}
