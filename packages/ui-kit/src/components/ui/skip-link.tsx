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

import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

export interface SkipLinkProps extends ComponentProps<'a'> {
  /** Id of the element to jump to, without the `#`. */
  target?: string;
}

/**
 * SkipLink — the first thing in the tab order.
 *
 * A keyboard user landing on a page with a 30-item sidebar otherwise presses
 * Tab thirty times before reaching the content, on every navigation. WCAG 2.2
 * SC 2.4.1 asks for this and it is two elements.
 *
 * Visually hidden until focused, rather than `display: none` — a hidden
 * element is not focusable, so the usual `sr-only` trick has to be undone on
 * `:focus`, which is what the utilities below do.
 *
 * The target needs `tabIndex={-1}`, or the browser moves the *scroll* position
 * without moving focus and the next Tab continues from the skip link.
 * `AppShell` sets it on the content wrapper.
 */
export function SkipLink({
  target = 'main-content',
  className,
  children = 'Skip to content',
  ...props
}: SkipLinkProps) {
  return (
    <a
      data-slot="skip-link"
      href={`#${target}`}
      className={cn(
        'sr-only font-sans text-sm font-medium',
        'focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100',
        'focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground',
        'focus:outline-none focus:ring-[3px] focus:ring-ring/50',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
