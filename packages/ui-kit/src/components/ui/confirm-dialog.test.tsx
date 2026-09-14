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

import { ConfirmDialog } from './confirm-dialog';

const base = {
  open: true,
  onOpenChange: vi.fn(),
  onConfirm: vi.fn(),
  title: 'Delete cluster',
};

describe('ConfirmDialog', () => {
  /*
   * `alertdialog`, not `dialog`: it does not close on an outside click or on
   * Escape, and the description is announced immediately. One product's
   * `ConfirmModal` is a plain dialog, so a stray backdrop click dismisses it —
   * which trains people to click through confirmations.
   */
  it('is an alert dialog', () => {
    render(<ConfirmDialog {...base} description="This cannot be undone." />);
    expect(screen.getByRole('alertdialog', { name: 'Delete cluster' })).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
  });

  it('confirms when there is nothing to verify', async () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...base} onConfirm={onConfirm} />);

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('renders nothing when closed', () => {
    render(<ConfirmDialog {...base} open={false} />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  describe('typed verification', () => {
    /*
     * Disabled-until-match rather than validate-on-submit. Leaving the
     * button enabled and rejecting the click means the destructive action is
     * one keystroke away from a mistyped name.
     */
    it('keeps confirm unreachable until the value matches', async () => {
      const onConfirm = vi.fn();
      render(
        <ConfirmDialog {...base} onConfirm={onConfirm} verification={{ value: 'prod-eu-1' }} />,
      );

      const confirm = screen.getByTestId('confirm-dialog-confirm');
      expect(confirm).toBeDisabled();

      await userEvent.type(screen.getByTestId('confirm-dialog-verification'), 'prod-eu');
      expect(confirm).toBeDisabled();

      await userEvent.type(screen.getByTestId('confirm-dialog-verification'), '-1');
      expect(confirm).toBeEnabled();

      await userEvent.click(confirm);
      expect(onConfirm).toHaveBeenCalledOnce();
    });

    it('puts the value to type in the label, where it stays visible', () => {
      render(<ConfirmDialog {...base} verification={{ value: 'prod-eu-1' }} />);
      expect(screen.getByText(/Type prod-eu-1 to confirm/)).toBeInTheDocument();
    });

    /*
     * The field lives inside the popup, which Base UI unmounts on close — so
     * the reset is structural rather than an effect watching `open`.
     */
    it('starts empty again when reopened', async () => {
      const { rerender } = render(
        <ConfirmDialog {...base} verification={{ value: 'prod-eu-1' }} />,
      );

      await userEvent.type(screen.getByTestId('confirm-dialog-verification'), 'prod-eu-1');
      expect(screen.getByTestId('confirm-dialog-confirm')).toBeEnabled();

      rerender(<ConfirmDialog {...base} open={false} verification={{ value: 'prod-eu-1' }} />);
      rerender(<ConfirmDialog {...base} open verification={{ value: 'prod-eu-1' }} />);

      expect(screen.getByTestId('confirm-dialog-verification')).toHaveValue('');
      expect(screen.getByTestId('confirm-dialog-confirm')).toBeDisabled();
    });
  });

  it('locks both buttons while busy', () => {
    render(<ConfirmDialog {...base} busy />);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });
});

describe('ConfirmDialog presentation', () => {
  it('takes a destructive tone and an icon on the confirm button', () => {
    render(
      <ConfirmDialog
        {...base}
        tone="destructive"
        confirmLabel="Delete"
        confirmIcon={<span data-testid="icon">x</span>}
      />,
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-dialog-confirm')).toHaveClass('bg-destructive');
  });

  it('renders extra children above the buttons', () => {
    render(
      <ConfirmDialog {...base}>
        <p>3 dependent resources will be orphaned.</p>
      </ConfirmDialog>,
    );
    expect(screen.getByText('3 dependent resources will be orphaned.')).toBeInTheDocument();
  });

  it('takes a custom verification label', () => {
    render(
      <ConfirmDialog
        {...base}
        verification={{ value: 'prod', label: 'Confirm the cluster name' }}
      />,
    );
    expect(screen.getByText('Confirm the cluster name')).toBeInTheDocument();
  });
});
