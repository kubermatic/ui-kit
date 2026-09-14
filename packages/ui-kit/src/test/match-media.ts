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
 * A controllable `matchMedia`, because jsdom does not implement one.
 *
 * The obvious stub returns a fixed `matches: false`, which quietly makes half
 * the theming code untestable: `system` can then only ever resolve to light,
 * so neither the dark branch nor the response to an OS preference change is
 * ever executed. This one can be flipped from a test.
 */

type MediaQueryListener = (event: MediaQueryListEvent) => void;

let prefersDark = false;
const listeners = new Set<MediaQueryListener>();

export function installMatchMedia(): void {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      // Read at call time, not at install time, so a later flip is visible to
      // the next `getSnapshot`.
      get matches() {
        return prefersDark;
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: MediaQueryListener) => {
        listeners.add(listener);
      },
      removeEventListener: (_type: string, listener: MediaQueryListener) => {
        listeners.delete(listener);
      },
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

/** Flip the simulated OS preference and notify subscribers. */
export function setPrefersDark(value: boolean): void {
  prefersDark = value;
  for (const listener of listeners) {
    listener({ matches: value } as MediaQueryListEvent);
  }
}

export function resetMatchMedia(): void {
  prefersDark = false;
  listeners.clear();
}
