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

import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import { Text } from './text.js';

export interface EmptyStateProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Icon, rendered in a muted disc. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** The way out — usually the button that creates the first one. */
  action?: ReactNode;
  /** Dashed border and a tall min-height, for a whole empty page. */
  variant?: 'plain' | 'placeholder';
}

/**
 * EmptyState — nothing here yet, and what to do about it.
 *
 * `title` is a `<p>`, not a heading. An empty list sits inside a page that
 * already has an `<h1>`, and "No secrets yet" is not a section of the
 * document — emitting an `<h2>` here puts a phantom entry in the outline a
 * screen-reader user navigates by. Pass `as="h2"` on your own heading if the
 * empty state genuinely replaces a titled section.
 */
export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  variant = 'plain',
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 text-center',
        variant === 'placeholder'
          ? 'min-h-80 rounded-lg border border-dashed border-border py-12'
          : 'py-12',
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6"
        >
          {icon}
        </div>
      ) : null}

      <Text variant="subline" className="text-balance">
        {title}
      </Text>

      {description ? (
        <Text variant="small" tone="muted" className="max-w-md text-pretty">
          {description}
        </Text>
      ) : null}

      {action ? <div className="mt-2 flex items-center gap-2">{action}</div> : null}
    </div>
  );
}
