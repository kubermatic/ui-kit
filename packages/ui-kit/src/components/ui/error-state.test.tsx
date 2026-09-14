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
import { describe, expect, it, vi } from 'vitest';

import { ErrorState, errorMessage } from './error-state';

describe('errorMessage', () => {
  it('passes a string through', () => {
    expect(errorMessage('boom')).toBe('boom');
  });

  it('reads an Error message', () => {
    expect(errorMessage(new Error('the API said no'))).toBe('the API said no');
  });

  /* Axios and the fetch wrappers both throw plain objects with a message. */
  it('reads a message off a plain object', () => {
    expect(errorMessage({ message: 'timeout' })).toBe('timeout');
  });

  it('is undefined for anything with no message to show', () => {
    expect(errorMessage(undefined)).toBeUndefined();
    expect(errorMessage(null)).toBeUndefined();
    expect(errorMessage({ status: 500 })).toBeUndefined();
    // A falsy string is nothing to display, not the string "0".
    expect(errorMessage('')).toBeUndefined();
  });
});

describe('ErrorState', () => {
  /*
   * The state replaces a spinner after an async failure, so it appears without
   * any user action. Without a live region nothing is announced and the page
   * simply seems to stop loading.
   */
  it('is an alert', () => {
    render(<ErrorState error="nope" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows the message and a working retry', async () => {
    const onRetry = vi.fn();
    render(<ErrorState error={new Error('connection refused')} onRetry={onRetry} />);

    expect(screen.getByText('connection refused')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('has no retry button when there is nothing to retry', () => {
    render(<ErrorState error="nope" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('ErrorState slots', () => {
  it('takes a custom title, extra children and an action', () => {
    render(
      <ErrorState
        title="Could not reach the cluster"
        error="i/o timeout"
        action={<button type="button">Go back</button>}
      >
        <p>Check the kubeconfig.</p>
      </ErrorState>,
    );

    expect(screen.getByText('Could not reach the cluster')).toBeInTheDocument();
    expect(screen.getByText('Check the kubeconfig.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
  });

  it('renders without a message when the error has none', () => {
    render(<ErrorState error={{ status: 500 }} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('takes a custom retry label', () => {
    render(<ErrorState error="x" onRetry={() => {}} retryLabel="Try again" />);
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});

describe('errorMessage edge cases', () => {
  it('ignores a non-string message property', () => {
    // An axios error whose `message` is an object, which happens with some
    // validation middlewares.
    expect(errorMessage({ message: { detail: 'nope' } })).toBeUndefined();
  });
});
