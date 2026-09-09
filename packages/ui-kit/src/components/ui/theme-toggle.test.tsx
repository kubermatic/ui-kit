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
import { afterEach, describe, expect, it } from 'vitest';

import { ThemeProvider } from '../../hooks/use-theme';
import { ThemeToggle } from './theme-toggle';

const wrap = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>);

/*
 * `ThemeProvider` persists the choice, so a test that switches to dark leaves
 * it stored for the next one — the toggle would then start from dark and the
 * "switch to…" label would read the other way round.
 */
afterEach(() => {
  window.localStorage.clear();
});

describe('ThemeToggle', () => {
  /*
   * `system` matters more than it looks: without it a user whose OS switches
   * to dark in the evening is stuck at whatever they last picked, with no way
   * back to "follow the OS".
   */
  it('offers light, dark and system as one group', () => {
    wrap(<ThemeToggle />);

    expect(screen.getByRole('button', { name: 'Light' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dark' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'System' })).toBeInTheDocument();
  });

  it('marks the active choice as pressed', () => {
    wrap(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches the theme', async () => {
    wrap(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: 'Dark' }));
    expect(document.documentElement).toHaveClass('dark');
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
  });

  describe('button variant', () => {
    it('says which way it will switch', async () => {
      wrap(<ThemeToggle variant="button" />);

      // Resolves to light in the test environment.
      const toggle = screen.getByRole('button', { name: 'Switch to dark theme' });
      await userEvent.click(toggle);

      expect(document.documentElement).toHaveClass('dark');
      expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
    });
  });
});
