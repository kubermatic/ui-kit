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

import { Check, Copy } from 'lucide-react';
import type { ReactNode } from 'react';

import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard.js';
import { cn } from '../../lib/utils.js';
import { Button, type ButtonProps } from './button.js';

export interface CopyButtonProps extends Omit<ButtonProps, 'children' | 'onClick'> {
  /** The text to copy. */
  value: string;
  /**
   * Accessible name, and the tooltip if you wrap this in one. Say what is
   * being copied — a page with six copy buttons otherwise announces "Copy"
   * six times.
   */
  label?: string;
  /** Name announced after a successful copy. */
  copiedLabel?: string;
  /** Renders the label as visible text beside the icon. */
  children?: ReactNode;
}

/**
 * CopyButton — copy a value, with the tick confirmation.
 *
 * The state change is announced, not only shown: `aria-live` on a
 * visually-hidden region, because swapping the icon tells a sighted user it
 * worked and tells a screen-reader user nothing. Both products' versions
 * change only the icon.
 *
 * The button stays enabled after copying. Disabling it — which is what one of
 * the two apps does for two seconds — takes focus off it and means you cannot
 * copy the same value twice in a row.
 */
export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  className,
  variant = 'ghost',
  size = 'icon',
  children,
  ...props
}: CopyButtonProps) {
  const { copy, copied, error } = useCopyToClipboard();

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={children ? size : 'icon'}
        aria-label={children ? undefined : label}
        className={cn(className)}
        onClick={() => void copy(value)}
        {...props}
      >
        {copied ? <Check /> : <Copy />}
        {children}
      </Button>
      {/*
       * A polite live region rather than `role="status"` on the button: the
       * button's own accessible name must stay stable, or a screen reader
       * re-announces the control every time the icon changes.
       */}
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : null}
        {error ? error.message : null}
      </span>
    </>
  );
}
