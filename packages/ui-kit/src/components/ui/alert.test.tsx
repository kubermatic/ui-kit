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

import { Alert } from './alert';

describe('Alert', () => {
  /*
   * `alert` is an assertive live region: it interrupts the screen reader
   * mid-sentence. Correct for "Saving failed", rude for "Changes saved".
   *
   * Both products render their error banner with no role at all, so a failure
   * that appears after an async call is never announced — the user presses
   * Save and hears nothing.
   */
  it('interrupts for problems and waits its turn otherwise', () => {
    const { rerender } = render(<Alert tone="error">Saving failed.</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(<Alert tone="warning">Cluster is degraded.</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(<Alert tone="success">Saved.</Alert>);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<Alert tone="info">Read the docs.</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders a title, a body and an action', () => {
    render(
      <Alert tone="error" title="Could not save" action={<button type="button">Retry</button>}>
        The API rejected the request.
      </Alert>,
    );

    expect(screen.getByText('Could not save')).toBeInTheDocument();
    expect(screen.getByText('The API rejected the request.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('hides the decorative icon and allows removing it', () => {
    const { container, rerender } = render(<Alert tone="info">hello</Alert>);
    expect(container.querySelector('[data-slot="alert-icon"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );

    rerender(
      <Alert tone="info" icon={null}>
        hello
      </Alert>,
    );
    expect(container.querySelector('[data-slot="alert-icon"]')).not.toBeInTheDocument();
  });
});

describe('Alert slots', () => {
  it('renders a body with no title', () => {
    render(<Alert tone="info">Just the body.</Alert>);
    expect(screen.getByText('Just the body.')).toBeInTheDocument();
  });

  it('renders a title with no body', () => {
    render(<Alert tone="success" title="Saved" />);
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('takes a replacement icon', () => {
    render(
      <Alert tone="info" icon={<span data-testid="custom">!</span>}>
        body
      </Alert>,
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });
});

describe('Alert default tone', () => {
  it('defaults to info', () => {
    const { container } = render(<Alert>body</Alert>);
    expect(container.querySelector('[data-slot="alert"]')).toHaveClass('border-primary-tone');
  });
});
