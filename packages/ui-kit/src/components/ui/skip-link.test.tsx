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
import { describe, expect, it } from 'vitest';

import { SkipLink } from './skip-link';

describe('SkipLink', () => {
  it('points at the main region', () => {
    render(<SkipLink />);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });

  it('takes a different target', () => {
    render(<SkipLink target="dashboard" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '#dashboard');
  });

  /*
   * Visually hidden until focused, rather than `display: none` — a hidden
   * element is not focusable, so the usual `sr-only` has to be undone on
   * `:focus`, which is what the `focus:not-sr-only` utility does.
   */
  it('is hidden until focused, not removed', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('sr-only');
    expect(link).toHaveClass('focus:not-sr-only');
  });
});
