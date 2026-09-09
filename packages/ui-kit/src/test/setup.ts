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

import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

import { installMatchMedia, resetMatchMedia } from './match-media';

// Testing Library's auto-cleanup only registers with globals enabled, so do
// it explicitly.
afterEach(cleanup);

// ThemeProvider paints onto <html>, and the class is not removed on unmount
// (for an app-level provider, unmount means teardown). Left alone, a dark test
// would leak into whatever ran next and make the suite order-dependent.
afterEach(() => {
  document.documentElement.className = '';
  document.documentElement.removeAttribute('style');
});

// jsdom does not implement matchMedia; the theme hooks depend on it.
beforeEach(() => {
  resetMatchMedia();
  installMatchMedia();
});
