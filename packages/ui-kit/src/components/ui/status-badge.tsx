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
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * The statuses a resource can be in, as a closed set.
 *
 * Both products invented their own list — one has
 * `synced | degraded | error | pending | info`, the other colours a circle from
 * condition strings — and both then hardcoded Tailwind palette colours
 * (`bg-green-50 text-green-700`) that no theme can reach and nothing measures.
 *
 * The names here are about *meaning*, not colour, so a product mapping
 * "Synced", "Ready" and "Available" all onto `success` keeps one visual
 * language.
 */
export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'pending' | 'neutral';

/**
 * There is deliberately **no tinted variant.**
 *
 * The obvious design is a pale wash — `bg-success/10` with `text-success` —
 * and it is not available, because an opacity tint composites to a colour
 * outside the token set: `--success` at 10% over the dark palette's background
 * is a value nothing measures, and the foreground's contrast against it is not
 * the foreground's contrast against `--background`. The axe run caught exactly
 * this on the Showcase story once already.
 *
 * So: `solid` is a measured surface/foreground pair, and `outline` is a
 * measured foreground on `--background` with a border of the same role. Both
 * are provably AA in both palettes; a tint would only look like it was.
 */
export const statusBadgeVariants = cva(
  [
    'inline-flex w-fit shrink-0 items-center justify-center gap-1.5 rounded-full border px-2 py-0.5',
    'font-sans text-xs font-medium whitespace-nowrap',
    "[&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3",
  ],
  {
    variants: {
      tone: {
        success: '',
        warning: '',
        error: '',
        info: '',
        pending: '',
        neutral: '',
      },
      variant: {
        solid: 'border-transparent',
        outline: 'bg-background',
      },
    },
    compoundVariants: [
      { variant: 'solid', tone: 'success', className: 'bg-success text-success-foreground' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning text-warning-foreground' },
      {
        variant: 'solid',
        tone: 'error',
        className: 'bg-destructive text-destructive-foreground',
      },
      { variant: 'solid', tone: 'info', className: 'bg-primary text-primary-foreground' },
      {
        variant: 'solid',
        tone: 'pending',
        className: 'bg-secondary text-secondary-foreground',
      },
      { variant: 'solid', tone: 'neutral', className: 'bg-muted text-muted-foreground' },

      { variant: 'outline', tone: 'success', className: 'border-success text-success' },
      { variant: 'outline', tone: 'warning', className: 'border-warning text-warning' },
      { variant: 'outline', tone: 'error', className: 'border-destructive text-destructive' },
      { variant: 'outline', tone: 'info', className: 'border-primary text-primary' },
      /*
       * `pending` and `neutral` both fall back to the muted role here.
       * `--secondary` is a pale surface: as *text* on `--background` it is
       * about 1.05:1, so the obvious `text-secondary` would be invisible.
       * Outlined, the two tones are indistinguishable — which is honest, since
       * neither carries a colour of its own.
       */
      { variant: 'outline', tone: 'pending', className: 'border-border text-muted-foreground' },
      { variant: 'outline', tone: 'neutral', className: 'border-border text-muted-foreground' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'solid' },
  },
);

export interface StatusBadgeProps
  extends Omit<ComponentProps<'span'>, 'children'>, VariantProps<typeof statusBadgeVariants> {
  /** The status text. Write it in the product's own words. */
  children: ReactNode;
  /** Renders a leading dot. Off by default — an icon usually reads better. */
  dot?: boolean;
}

/**
 * StatusBadge — a resource's state, as a chip.
 *
 * The dot is `bg-current`, so it inherits whichever foreground the tone
 * resolved to and therefore has exactly the contrast the label does. A dot
 * with its own colour would be a pair nobody measured.
 */
export function StatusBadge({
  className,
  tone,
  variant,
  dot = false,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      data-slot="status-badge"
      data-tone={tone ?? 'neutral'}
      className={cn(statusBadgeVariants({ tone, variant }), className)}
      {...props}
    >
      {dot ? <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export const statusDotVariants = cva('inline-block shrink-0 rounded-full', {
  variants: {
    tone: {
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-destructive',
      info: 'bg-primary',
      pending: 'bg-muted-foreground',
      neutral: 'bg-muted-foreground',
    },
    size: {
      sm: 'size-1.5',
      default: 'size-2',
      lg: 'size-2.5',
    },
  },
  defaultVariants: { tone: 'neutral', size: 'default' },
});

export interface StatusDotProps
  extends Omit<ComponentProps<'span'>, 'children'>, VariantProps<typeof statusDotVariants> {
  /**
   * What the colour means. Required, and rendered as visually-hidden text
   * beside the dot.
   *
   * A bare coloured circle is the textbook SC 1.4.1 failure — colour as the
   * only carrier of information. Both products ship one: a cluster
   * picker announces the cluster name and nothing about whether it is
   * reachable. Making the prop required means the component cannot reproduce
   * that.
   */
  label: string;
}

/**
 * StatusDot — the compact indicator, for a table cell or a picker row where a
 * full chip would not fit.
 *
 * Every tone here clears 3:1 against `--background` in both palettes, which is
 * why `success` and `warning` are the darkened roles rather than brand Teal and
 * Honey: those measure 1.77:1 and 1.87:1 on white, so as a bare dot on a light
 * page they are decoration that happens to be invisible.
 */
export function StatusDot({ className, tone, size, label, ...props }: StatusDotProps) {
  return (
    <span data-slot="status-dot" className="inline-flex items-center gap-1.5" {...props}>
      <span aria-hidden="true" className={cn(statusDotVariants({ tone, size }), className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
