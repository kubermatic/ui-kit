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
'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Loader2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import { Button } from './button.js';
import { Field } from './field.js';
import { Input } from './input.js';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `destructive` colours the confirm button and is the default for deletes. */
  tone?: 'default' | 'destructive';
  /** Icon on the confirm button. Replaced by a spinner while `busy`. */
  confirmIcon?: ReactNode;
  /** Disables both buttons and spins the confirm one. */
  busy?: boolean;
  /**
   * Requires the exact string to be typed before confirm is enabled — the
   * "type the cluster name to delete it" guard.
   */
  verification?: {
    /** The value that must be typed. Usually the resource's name. */
    value: string;
    /** Field label. Defaults to naming what has to be typed. */
    label?: ReactNode;
  };
  children?: ReactNode;
}

/**
 * ConfirmDialog — "are you sure", with an optional typed confirmation.
 *
 * Base UI's **AlertDialog**, not `Dialog`: an alert dialog does not close on an
 * outside click or on Escape, and its role is `alertdialog`, so the
 * description is announced immediately rather than only when focus reaches it.
 * For "delete this cluster" that is the difference between a confirmation and
 * a speed bump — one product's `ConfirmModal` is a plain dialog, so a stray
 * click on the backdrop dismisses it, which trains people to click through.
 *
 * The typed guard is *disabled-until-match* rather than the other's
 * validate-on-submit. Letting the confirm button stay enabled and then
 * rejecting the click means the destructive action is one keystroke away from
 * a mistyped name; disabling it means it is not reachable at all.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  confirmIcon,
  busy = false,
  verification,
  children,
}: ConfirmDialogProps) {
  return (
    <BaseAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop
          className={cn(
            'fixed inset-0 z-50 bg-foreground/50 transition-opacity',
            'data-starting-style:opacity-0 data-ending-style:opacity-0',
          )}
        />
        <BaseAlertDialog.Popup
          data-slot="confirm-dialog"
          className={cn(
            'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'flex w-[calc(100vw-2rem)] flex-col gap-4 sm:max-w-md',
            'rounded-lg border border-border bg-background p-6 text-foreground shadow-lg outline-none',
            'transition-[transform,scale,opacity]',
            'data-starting-style:scale-95 data-starting-style:opacity-0',
            'data-ending-style:scale-95 data-ending-style:opacity-0',
          )}
        >
          <ConfirmDialogBody
            onConfirm={onConfirm}
            title={title}
            description={description}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            tone={tone}
            confirmIcon={confirmIcon}
            busy={busy}
            verification={verification}
          >
            {children}
          </ConfirmDialogBody>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}

type ConfirmDialogBodyProps = Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>;

/**
 * The popup's contents, holding the typed-confirmation state.
 *
 * Split out so that closing the dialog *unmounts* the state rather than
 * resetting it. The obvious version is a `useEffect` watching `open` that
 * clears the field — which is a setState in an effect, i.e. a second render
 * pass on every close, and the lint rule that rejects it is right to. Base UI
 * unmounts the popup when the dialog closes, so a component that lives inside
 * it gets the reset for free and reopening always starts empty.
 */
function ConfirmDialogBody({
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone,
  confirmIcon,
  busy,
  verification,
  children,
}: ConfirmDialogBodyProps) {
  const [typed, setTyped] = useState('');

  const verified = !verification || typed === verification.value;
  const canConfirm = verified && !busy;

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <BaseAlertDialog.Title className="font-display text-lg font-bold text-heading">
          {title}
        </BaseAlertDialog.Title>
        {description ? (
          <BaseAlertDialog.Description className="font-sans text-sm text-muted-foreground">
            {description}
          </BaseAlertDialog.Description>
        ) : null}
      </div>

      {children}

      {verification ? (
        /*
         * The value to type is in the label, not the placeholder: a placeholder
         * disappears the moment you start typing, which is exactly when you
         * need to check what you are copying.
         */
        <Field label={verification.label ?? <>Type {verification.value} to confirm</>}>
          <Input
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            autoComplete="off"
            disabled={busy}
            data-testid="confirm-dialog-verification"
          />
        </Field>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <BaseAlertDialog.Close
          render={
            <Button variant="outline" disabled={busy}>
              {cancelLabel}
            </Button>
          }
        />
        <Button
          variant={tone === 'destructive' ? 'destructive' : 'default'}
          disabled={!canConfirm}
          onClick={onConfirm}
          data-testid="confirm-dialog-confirm"
        >
          {busy ? <Loader2 className="animate-spin" /> : confirmIcon}
          {confirmLabel}
        </Button>
      </div>
    </>
  );
}
