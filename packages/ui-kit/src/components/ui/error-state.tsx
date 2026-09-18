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

import { AlertCircle } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import { Button } from './button.js';
import { Text } from './text.js';

export interface ErrorStateProps extends Omit<ComponentProps<'div'>, 'title'> {
  title?: ReactNode;
  /**
   * What went wrong. An `Error` is reduced to its message — passing the object
   * is fine and does not stringify to `[object Object]`.
   */
  error?: unknown;
  /** Renders a retry button when given. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Extra actions — "Go back", "Contact support". */
  action?: ReactNode;
}

/** The human-readable part of anything a `catch` or a query hook produces. */
export function errorMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && 'message' in error) {
    const { message } = error as { message?: unknown };
    if (typeof message === 'string') return message;
  }
  return undefined;
}

/**
 * ErrorState — a whole region failed to load.
 *
 * The counterpart to `Alert tone="error"`, which is for a message *beside*
 * content that is still there. This replaces the content.
 *
 * `role="alert"` so it is announced when it replaces a spinner, and the retry
 * button is a real button rather than the clickable div both products use, so
 * it is reachable by keyboard.
 */
export function ErrorState({
  className,
  title = 'Something went wrong',
  error,
  onRetry,
  retryLabel = 'Retry',
  action,
  children,
  ...props
}: ErrorStateProps) {
  const message = errorMessage(error);

  return (
    <div
      data-slot="error-state"
      role="alert"
      className={cn(
        'flex min-h-60 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-destructive-tone px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      <AlertCircle aria-hidden="true" className="size-8 text-destructive-tone" />

      <Text variant="subline" className="text-balance">
        {title}
      </Text>

      {message ? (
        <Text variant="small" tone="muted" className="max-w-md break-words text-pretty">
          {message}
        </Text>
      ) : null}

      {children}

      {onRetry || action ? (
        <div className="mt-2 flex items-center gap-2">
          {onRetry ? (
            <Button variant="outline" size="sm" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}
