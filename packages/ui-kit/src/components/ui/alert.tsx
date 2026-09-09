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

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

/**
 * Outlined, not tinted — the same constraint `StatusBadge` documents. A pale
 * wash means an opacity composite, and a composite is a colour outside the
 * token set whose contrast nothing measures. So the tone is carried by the
 * border and the icon, both of which are measured against `--background`, and
 * the body text stays `--foreground`.
 *
 * The upside is that the message itself is always at 18.9:1 rather than at
 * whatever a tint left it.
 */
export const alertVariants = cva(
  [
    'relative grid w-full gap-x-3 gap-y-1 rounded-md border-2 bg-background px-4 py-3',
    'font-sans text-sm text-foreground',
    'has-[[data-slot=alert-icon]]:grid-cols-[auto_1fr] has-[[data-slot=alert-icon]]:items-start',
  ],
  {
    variants: {
      tone: {
        info: 'border-primary [&_[data-slot=alert-icon]]:text-primary',
        success: 'border-success [&_[data-slot=alert-icon]]:text-success',
        warning: 'border-warning [&_[data-slot=alert-icon]]:text-warning',
        error: 'border-destructive [&_[data-slot=alert-icon]]:text-destructive',
      },
    },
    defaultVariants: { tone: 'info' },
  },
);

const defaultIcon = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
} as const satisfies Record<AlertTone, unknown>;

export interface AlertProps
  extends Omit<ComponentProps<'div'>, 'title'>, VariantProps<typeof alertVariants> {
  /** Bold first line. */
  title?: ReactNode;
  /** Replaces the tone's default icon. `null` removes it. */
  icon?: ReactNode;
  /** Right-aligned slot — a "Retry" or "Dismiss" button. */
  action?: ReactNode;
}

/**
 * Alert — an inline message about the page, not about a field.
 *
 * `role="alert"` on the error and warning tones only. `alert` is an assertive
 * live region: it interrupts the screen reader mid-sentence, which is correct
 * for "Saving failed" and rude for "Your changes were saved". The quiet tones
 * get `role="status"`.
 *
 * Both products render their error banner with no role at all, so a failure
 * that appears after an async call is never announced — a screen reader user
 * presses Save and hears nothing.
 */
export function Alert({
  className,
  tone = 'info',
  title,
  icon,
  action,
  children,
  ...props
}: AlertProps) {
  const Icon = defaultIcon[tone ?? 'info'];
  const resolvedIcon = icon === undefined ? <Icon /> : icon;

  return (
    <div
      data-slot="alert"
      role={tone === 'error' || tone === 'warning' ? 'alert' : 'status'}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      {resolvedIcon ? (
        <span
          data-slot="alert-icon"
          aria-hidden="true"
          className="row-span-2 flex items-center pt-0.5 [&_svg]:size-4"
        >
          {resolvedIcon}
        </span>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? (
          <div data-slot="alert-title" className="leading-none font-semibold">
            {title}
          </div>
        ) : null}
        {children ? (
          <div data-slot="alert-description" className="text-sm [&_p]:leading-relaxed">
            {children}
          </div>
        ) : null}
      </div>

      {action ? (
        <div data-slot="alert-action" className="flex shrink-0 items-start">
          {action}
        </div>
      ) : null}
    </div>
  );
}
