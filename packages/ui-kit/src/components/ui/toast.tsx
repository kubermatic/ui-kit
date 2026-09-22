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

import { Toast as BaseToast } from '@base-ui/react/toast';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useMemo, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

/** The tone of a toast, carried in Base UI's `type` field. */
export type ToastTone = 'info' | 'success' | 'warning' | 'error';

const TONE_ICON = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
} as const satisfies Record<ToastTone, unknown>;

/*
 * Outlined rather than tinted, for the reason `Alert` documents: a wash is an
 * opacity composite, and a composite is a colour outside the token set.
 */
const TONE_CLASSES = {
  info: 'border-primary-tone [&_[data-slot=toast-icon]]:text-primary-tone',
  success: 'border-success [&_[data-slot=toast-icon]]:text-success',
  warning: 'border-warning [&_[data-slot=toast-icon]]:text-warning',
  error: 'border-destructive-tone [&_[data-slot=toast-icon]]:text-destructive-tone',
} as const satisfies Record<ToastTone, string>;

const isTone = (value: string | undefined): value is ToastTone =>
  value === 'info' || value === 'success' || value === 'warning' || value === 'error';

/**
 * ToastProvider — holds the queue. Mount once, above anything that toasts.
 *
 * `limit` defaults to 3 rather than Base UI's 5: a Kubernetes dashboard that
 * fails a list call for six namespaces will try to toast six times, and a
 * stack tall enough to cover the button you were aiming at is worse than a
 * truncated one.
 */
export function ToastProvider({
  limit = 3,
  timeout = 5000,
  ...props
}: ComponentProps<typeof BaseToast.Provider>) {
  return <BaseToast.Provider limit={limit} timeout={timeout} {...props} />;
}

export interface ToasterProps {
  /** Corner the stack grows from. */
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
  className?: string;
}

const POSITION_CLASSES = {
  'top-right': 'top-4 right-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'right-4 bottom-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
} as const;

/**
 * Toaster — renders the queue. One per app, inside `ToastProvider`.
 *
 * The viewport is a labelled region rather than a bare div, so a keyboard user
 * can reach the toasts with F6 and a screen reader announces what the region
 * is. Base UI handles the announcement of each toast: `error` and `warning`
 * are queued at `high` priority by `useToast` below, which makes them
 * assertive, and the quiet ones are polite.
 */
export function Toaster({ position = 'bottom-right', className }: ToasterProps) {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport
        data-slot="toaster"
        className={cn(
          'fixed z-100 flex w-[calc(100vw-2rem)] flex-col gap-2 sm:w-90',
          POSITION_CLASSES[position],
          className,
        )}
      >
        <ToastList />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();

  return toasts.map((toast) => {
    const tone: ToastTone = isTone(toast.type) ? toast.type : 'info';
    const Icon = TONE_ICON[tone];

    return (
      <BaseToast.Root
        key={toast.id}
        toast={toast}
        data-slot="toast"
        data-tone={tone}
        className={cn(
          'grid grid-cols-[auto_1fr_auto] items-start gap-x-3 gap-y-1',
          'rounded-md border-2 bg-background p-4 text-foreground shadow-lg',
          'transition-[transform,opacity]',
          'data-starting-style:translate-x-full data-starting-style:opacity-0',
          'data-ending-style:translate-x-full data-ending-style:opacity-0',
          TONE_CLASSES[tone],
        )}
      >
        <span
          data-slot="toast-icon"
          aria-hidden="true"
          className="row-span-2 pt-0.5 [&_svg]:size-4"
        >
          <Icon />
        </span>

        <div className="col-start-2 flex min-w-0 flex-col gap-1">
          {toast.title ? (
            <BaseToast.Title className="font-sans text-sm leading-none font-semibold" />
          ) : null}
          {toast.description ? (
            <BaseToast.Description className="font-sans text-sm break-words text-muted-foreground" />
          ) : null}
          {toast.actionProps ? (
            <BaseToast.Action
              className={cn(
                'mt-1 w-fit rounded-sm font-sans text-sm font-medium text-primary-tone underline-offset-4',
                'outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50',
              )}
            />
          ) : null}
        </div>

        <BaseToast.Close
          aria-label="Dismiss"
          className={cn(
            'col-start-3 row-start-1 flex size-6 cursor-pointer items-center justify-center rounded-sm',
            'text-muted-foreground transition-colors outline-none',
            'hover:bg-secondary hover:text-secondary-foreground',
            'focus-visible:ring-[3px] focus-visible:ring-ring/50',
          )}
        >
          <X className="size-3.5" />
        </BaseToast.Close>
      </BaseToast.Root>
    );
  });
}

export interface ToastOptions {
  description?: ReactNode;
  /** `0` keeps it up until dismissed. */
  timeout?: number;
  /** A single action — "Undo", "View". */
  action?: { label: string; onClick: () => void };
  id?: string;
}

export interface UseToastResult {
  info: (title: ReactNode, options?: ToastOptions) => string;
  success: (title: ReactNode, options?: ToastOptions) => string;
  warning: (title: ReactNode, options?: ToastOptions) => string;
  error: (title: ReactNode, options?: ToastOptions) => string;
  /** Closes one toast, or all of them when called with no id. */
  dismiss: (id?: string) => void;
  /** The underlying manager, for `promise()` and `update()`. */
  manager: ReturnType<typeof BaseToast.useToastManager>;
}

/**
 * useToast — the calling convention both products already use.
 *
 * `toast.success('Secret created')` rather than
 * `add({ type: 'success', title: … })`, because that is what the ~200 call
 * sites in the two apps look like today (one has a Zustand store with exactly
 * this shape, the other calls Sonner). Keeping the shape means migrating
 * them is a change of import.
 *
 * `error` and `warning` are queued at `high` priority, which is what makes
 * them assertive live regions. A failure that is only announced politely can
 * sit unread behind whatever the user was already being told.
 */
export function useToast(): UseToastResult {
  const manager = BaseToast.useToastManager();

  return useMemo(() => {
    const create =
      (tone: ToastTone) =>
      (title: ReactNode, options: ToastOptions = {}) =>
        manager.add({
          title,
          description: options.description,
          type: tone,
          timeout: options.timeout,
          id: options.id,
          priority: tone === 'error' || tone === 'warning' ? 'high' : 'low',
          actionProps: options.action
            ? { children: options.action.label, onClick: options.action.onClick }
            : undefined,
        });

    return {
      info: create('info'),
      success: create('success'),
      warning: create('warning'),
      error: create('error'),
      dismiss: (id?: string) => manager.close(id),
      manager,
    };
  }, [manager]);
}
