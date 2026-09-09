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

import { Spinner } from './spinner';

describe('Spinner', () => {
  /*
   * One product's spinner renders a bare icon, so a screen reader on a loading nav
   * section is told nothing at all — the region simply looks empty until the
   * data arrives.
   */
  it('is a polite live region carrying a label', () => {
    render(<Spinner label="Loading services" />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('Loading services');
  });

  it('hides the label visually by default', () => {
    render(<Spinner label="Loading" />);
    expect(screen.getByText('Loading')).toHaveClass('sr-only');
  });

  it('can show the label', () => {
    render(<Spinner label="Loading" showLabel />);
    expect(screen.getByText('Loading')).not.toHaveClass('sr-only');
  });

  it('takes a size', () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.querySelector('svg')).toHaveClass('size-10');
  });
});
