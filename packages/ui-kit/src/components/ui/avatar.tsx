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

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

export const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full bg-secondary text-secondary-foreground',
  {
    variants: {
      size: {
        sm: 'size-6 text-[0.625rem]',
        default: 'size-8 text-xs',
        lg: 'size-10 text-sm',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export interface AvatarProps
  extends
    Omit<ComponentProps<typeof BaseAvatar.Root>, 'className' | 'children'>,
    VariantProps<typeof avatarVariants> {
  className?: string;
  /** Image URL. Falls back to initials when absent or when loading fails. */
  src?: string;
  /**
   * The person or entity. Used for the image's alt text and reduced to
   * initials for the fallback.
   */
  name?: string;
}

/**
 * Derives at most two initials.
 *
 * Split on whitespace, so "Ada Lovelace" gives AL. An email address has no
 * spaces, so `ada@example.com` gives A — which is the right answer, because
 * the alternative is inventing a surname from the domain.
 *
 * Uses `Array.from` rather than `charAt`, so a name starting with an
 * astral-plane character (an emoji, or a CJK extension B glyph) yields that
 * character and not half of its surrogate pair.
 */
export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? '')
    .join('')
    .toUpperCase();
}

/**
 * Avatar — a person, with an initials fallback.
 *
 * Base UI's `Avatar.Fallback` is shown while the image loads and if it errors,
 * which is the case both products get wrong: one renders the first
 * letter of the email with no image path at all, and the other renders a broken
 * image icon when the OIDC provider's picture URL 403s.
 *
 * The whole thing is `aria-hidden`, because an avatar beside a name is
 * decoration — announcing "AL, Ada Lovelace" is noise. If it appears without
 * the name next to it, label it at the call site.
 */
export function Avatar({ className, size, src, name, ...props }: AvatarProps) {
  const initials = name ? initialsOf(name) : '';

  return (
    <BaseAvatar.Root
      data-slot="avatar"
      aria-hidden="true"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {src ? (
        <BaseAvatar.Image
          src={src}
          alt={name ?? ''}
          className="aspect-square size-full object-cover"
        />
      ) : null}
      <BaseAvatar.Fallback className="flex size-full items-center justify-center font-sans font-medium">
        {initials}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
