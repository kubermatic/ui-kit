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
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ToastProvider, Toaster, useToast } from './toast';

function Harness({ onReady }: { onReady?: (toast: ReturnType<typeof useToast>) => void }) {
  const toast = useToast();
  onReady?.(toast);
  return (
    <>
      <button type="button" onClick={() => toast.success('Secret created')}>
        success
      </button>
      <button
        type="button"
        onClick={() => toast.error('Could not save', { description: 'The API rejected it.' })}
      >
        error
      </button>
    </>
  );
}

const setup = (onReady?: (toast: ReturnType<typeof useToast>) => void) =>
  render(
    <ToastProvider>
      <Harness onReady={onReady} />
      <Toaster />
    </ToastProvider>,
  );

describe('useToast', () => {
  /*
   * `toast.success('…')` rather than `add({ type: 'success', title })`,
   * because that is what the ~200 call sites in the two apps already look
   * like — so migrating them is a change of import.
   */
  it('shows a toast with the tone helper', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'success' }));

    await waitFor(() => expect(screen.getAllByText('Secret created').length).toBeGreaterThan(0));
  });

  /*
   * Scoped to the visible toast, because Base UI renders the title and
   * description *twice*: once in the toast and once in a separate
   * visually-hidden `role="alert"` region that does the announcing. The visual
   * copy carries `aria-hidden`, which is what stops a screen reader reading it
   * both times — so an unscoped `getByText` legitimately finds two nodes.
   */
  it('shows a description', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'error' }));

    await waitFor(() => {
      const toast = document.querySelector('[data-slot="toast"]');
      expect(within(toast as HTMLElement).getByText('The API rejected it.')).toBeInTheDocument();
    });
  });

  /*
   * Found by attribute rather than by role: the whole visible toast carries
   * `aria-hidden` until the viewport is focused — Base UI's way of not
   * announcing the content twice — so its close button is outside the
   * accessibility tree and no role query reaches it. The label still has to be
   * there for when it *is* focused, which is what this asserts.
   */
  it('offers a named dismiss control', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'success' }));
    await waitFor(() => expect(screen.getAllByText('Secret created').length).toBeGreaterThan(0));

    const dismiss = document.querySelector<HTMLButtonElement>('[aria-label="Dismiss"]');
    expect(dismiss).not.toBeNull();

    await userEvent.click(dismiss!);
    await waitFor(() => expect(screen.queryByText('Secret created')).not.toBeInTheDocument());
  });

  /*
   * `error` and `warning` are queued at high priority, which is what makes
   * them assertive live regions. A failure announced only politely can sit
   * unread behind whatever the user was already being told.
   */
  it('queues problems assertively and the rest politely', () => {
    const add = vi.fn((_options: { type?: string; priority?: string }) => 'id');
    let api: ReturnType<typeof useToast> | undefined;
    setup((toast) => {
      api = toast;
    });

    api!.manager.add = add;
    api!.error('Could not save');
    api!.success('Saved');

    expect(add.mock.calls[0]?.[0]).toMatchObject({ type: 'error', priority: 'high' });
    expect(add.mock.calls[1]?.[0]).toMatchObject({ type: 'success', priority: 'low' });
  });

  it('renders nothing until something is queued', () => {
    setup();
    expect(screen.queryByText('Secret created')).not.toBeInTheDocument();
  });
});

describe('useToast extras', () => {
  it('renders an action and dismisses everything at once', async () => {
    let api: ReturnType<typeof useToast> | undefined;
    render(
      <ToastProvider>
        <Harness onReady={(toast) => (api = toast)} />
        <Toaster position="top-center" />
      </ToastProvider>,
    );

    const onClick = vi.fn();
    api!.info('Deleted', { action: { label: 'Undo', onClick }, timeout: 0 });
    api!.warning('Careful');

    await waitFor(() => expect(document.querySelector('[aria-label="Dismiss"]')).not.toBeNull());

    const undo = document.querySelector<HTMLButtonElement>(
      '[data-slot="toast"] button:not([aria-label])',
    );
    expect(undo).not.toBeNull();

    api!.dismiss();
    await waitFor(() => expect(screen.queryByText('Careful')).not.toBeInTheDocument());
  });
});

describe('Toast slots', () => {
  it('renders a title with no description', async () => {
    let api: ReturnType<typeof useToast> | undefined;
    render(
      <ToastProvider>
        <Harness onReady={(toast) => (api = toast)} />
        <Toaster />
      </ToastProvider>,
    );

    api!.success('Saved');
    await waitFor(() => expect(screen.getAllByText('Saved').length).toBeGreaterThan(0));

    const toast = document.querySelector('[data-slot="toast"]')!;
    // No description paragraph when none was given.
    expect(toast.querySelector('p')).toBeNull();
  });

  it.each(['top-right', 'top-center', 'bottom-right', 'bottom-center'] as const)(
    'places the stack %s',
    (position) => {
      render(
        <ToastProvider>
          <Harness />
          <Toaster position={position} />
        </ToastProvider>,
      );
      expect(document.querySelector('[data-slot="toaster"]')).toBeInTheDocument();
    },
  );
});
