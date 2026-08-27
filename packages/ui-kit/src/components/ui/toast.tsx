/*
 * Copyright 2026 The Kubermatic ui-kit Authors.
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

import * as React from 'react';
import {
  Toast as ToastPrimitive,
  type ToastManagerPromiseOptions,
  type ToastManagerUpdateOptions,
} from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Toasts, on Base UI.
 *
 * The kit previously wrapped `sonner`, which meant a consuming app had to
 * install sonner itself and import `toast` from it — a second package on the
 * boundary, and one more version for three products to disagree about. Base UI
 * is already the engine for every other primitive here, so this removes an
 * external surface rather than adding one.
 *
 * `toast` is a module-level manager, so it can be called from anywhere —
 * an event handler, a mutation callback, a plain function outside React —
 * exactly like sonner's. `<Toaster />` is rendered once near the app root and
 * is what gives those calls somewhere to land.
 */

const TYPES = [
  'default',
  'success',
  'info',
  'warning',
  'error',
  'loading',
] as const;

/** The visual levels a toast can take. `loading` does not auto-dismiss. */
export type ToastType = (typeof TYPES)[number];

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border border-l-4 bg-popover p-4 text-popover-foreground shadow-lg transition-all data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:translate-x-4 data-starting-style:translate-x-4',
  {
    variants: {
      type: {
        /*
         * Every level keeps the neutral popover surface and signals through the
         * left border and the icon instead of a tinted background.
         *
         * That is a contrast decision, not only an aesthetic one. `bg-popover` /
         * `text-popover-foreground` is a pairing the token set already proves at
         * WCAG AA in both themes; a tinted surface per level would be five new
         * pairings to prove, and axe runs over every story at `test: 'error'`.
         * Borders carry no contrast requirement, so the level stays legible
         * without putting the body text at risk.
         */
        default: 'border-l-border',
        success: 'border-l-success',
        info: 'border-l-info',
        warning: 'border-l-warning',
        error: 'border-l-destructive',
        loading: 'border-l-muted-foreground',
      },
    },
    defaultVariants: {
      type: 'default',
    },
  },
);

const ICONS: Record<ToastType, React.ReactNode> = {
  default: null,
  success: <CircleCheckIcon className="text-success size-4 shrink-0" />,
  info: <InfoIcon className="text-info size-4 shrink-0" />,
  warning: <TriangleAlertIcon className="text-warning size-4 shrink-0" />,
  error: <OctagonXIcon className="text-destructive size-4 shrink-0" />,
  loading: (
    <Loader2Icon className="text-muted-foreground size-4 shrink-0 animate-spin" />
  ),
};

function isToastType(value: string | undefined): value is ToastType {
  return TYPES.includes(value as ToastType);
}

/* -------------------------------------------------------------- the manager */

/*
 * Created at module scope, so `toast(...)` works without a hook and without the
 * caller being inside the provider — which is the whole ergonomic point.
 */
const manager = ToastPrimitive.createToastManager();

/** Options accepted by every `toast.*` call. Mirrors Base UI's add options. */
export type ToastOptions = Omit<
  Parameters<typeof manager.add>[0],
  'title' | 'type'
>;

function add(type: ToastType, title: React.ReactNode, options?: ToastOptions) {
  return manager.add({ ...options, title, type });
}

/**
 * Normalises the string shorthand `promise()` accepts.
 *
 * Base UI expands a bare string into `{ description }`. Every other entry point
 * here expands one into `{ title }`, and the inconsistency is not cosmetic:
 * `Toast.Root` renders `role="dialog"` and takes its accessible name from the
 * title, so a description-only toast is an unnamed dialog. axe fails it, and a
 * screen reader announces a body with nothing identifying it.
 *
 * So `toast.promise(p, { loading: 'Creating…' })` puts that string where
 * `toast.loading('Creating…')` puts it.
 */
function asTitle(
  value: string | ToastManagerUpdateOptions<any>,
): ToastManagerUpdateOptions<any> {
  return typeof value === 'string' ? { title: value } : value;
}

function asTitleResult<Value>(
  value:
    | string
    | ToastManagerUpdateOptions<any>
    | ((result: Value) => string | ToastManagerUpdateOptions<any>),
) {
  return typeof value === 'function'
    ? (result: Value) =>
        asTitle(
          (value as (result: Value) => string | ToastManagerUpdateOptions<any>)(
            result,
          ),
        )
    : asTitle(value);
}

/**
 * Show a toast.
 *
 * ```ts
 * toast('Snapshot scheduled');
 * toast.error('Failed to attach volume', { description: 'quota exceeded' });
 * toast.promise(createSnapshot(), { loading: '…', success: 'Done', error: 'Failed' });
 * ```
 */
const toast = Object.assign(
  (title: React.ReactNode, options?: ToastOptions) =>
    add('default', title, options),
  {
    success: (title: React.ReactNode, options?: ToastOptions) =>
      add('success', title, options),
    info: (title: React.ReactNode, options?: ToastOptions) =>
      add('info', title, options),
    warning: (title: React.ReactNode, options?: ToastOptions) =>
      add('warning', title, options),
    error: (title: React.ReactNode, options?: ToastOptions) =>
      add('error', title, options),
    /** Does not auto-dismiss — Base UI skips the timer for `loading`. */
    loading: (title: React.ReactNode, options?: ToastOptions) =>
      add('loading', title, options),
    /**
     * Swaps a loading toast for a success or error one when the promise
     * settles. Base UI assigns the three types itself, so the levels line up
     * with the ones above without this having to restate them.
     */
    promise: <Value,>(
      promise: Promise<Value>,
      options: ToastManagerPromiseOptions<Value, any>,
    ) =>
      manager.promise(promise, {
        loading: asTitle(options.loading),
        success: asTitleResult<Value>(options.success),
        error: asTitleResult<any>(options.error),
      }),
    /** Dismiss one toast by id, or all of them when called with no argument. */
    dismiss: manager.close,
    update: manager.update,
  },
);

/* ------------------------------------------------------------- the renderer */

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((item) => {
    const type = isToastType(item.type) ? item.type : 'default';

    return (
      <ToastPrimitive.Root
        key={item.id}
        toast={item}
        data-slot="toast"
        /*
         * Base UI labels the dialog from its title. A toast built by hand with
         * only a description would have no accessible name at all, so fall back
         * rather than emit an unnamed dialog — `asTitle` keeps this from firing
         * on anything the `toast.*` API produces.
         */
        aria-label={item.title ? undefined : 'Notification'}
        className={cn(toastVariants({ type }))}
      >
        {ICONS[type]}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastPrimitive.Title
            data-slot="toast-title"
            className="text-sm leading-tight font-medium"
          />
          <ToastPrimitive.Description
            data-slot="toast-description"
            className="text-muted-foreground text-sm leading-snug"
          />
          {item.actionProps ? (
            <ToastPrimitive.Action
              data-slot="toast-action"
              className="text-primary mt-1 self-start text-sm font-medium underline-offset-4 hover:underline"
            />
          ) : null}
        </div>

        <ToastPrimitive.Close
          data-slot="toast-close"
          aria-label="Close notification"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
        >
          <XIcon className="size-4" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    );
  });
}

export interface ToasterProps {
  /** Milliseconds before a toast auto-dismisses. `0` disables it. */
  timeout?: number;
  /** How many toasts are shown at once before older ones are marked limited. */
  limit?: number;
  /** Extra classes for the viewport — use to move it off the bottom-right. */
  className?: string;
}

/**
 * Mount once, near the app root. Everything `toast()` produces renders here.
 *
 * Unlike the sonner wrapper this replaces, it takes no `theme` prop and reads
 * no theme library. Toasts are styled from the same tokens as everything else,
 * so they follow the `.dark` class the app already toggles — which works
 * whether or not that app uses next-themes.
 */
function Toaster({ timeout, limit, className }: ToasterProps) {
  return (
    <ToastPrimitive.Provider
      toastManager={manager}
      timeout={timeout}
      limit={limit}
    >
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          data-slot="toast-viewport"
          className={cn(
            'fixed right-4 bottom-4 z-100 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2',
            // The viewport spans a region the user may need to click through.
            'pointer-events-none',
            className,
          )}
        >
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

export { Toaster, toast, toastVariants };
export type ToastVariantProps = VariantProps<typeof toastVariants>;
