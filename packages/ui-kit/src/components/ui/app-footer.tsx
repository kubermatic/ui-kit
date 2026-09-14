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
import { useBrand } from './brand.js';

export interface AppFooterProps extends Omit<ComponentProps<'footer'>, 'children'> {
  /** Replaces the default "Powered by …" line entirely. */
  children?: ReactNode;
  /** Right-hand slot. `ThemeToggle` usually. */
  actions?: ReactNode;
  /** Extra links beside Docs. */
  links?: ReactNode;
  height?: string;
}

/**
 * AppFooter — the credit line and the theme switch.
 *
 * Reads `company` and `docsUrl` from `BrandProvider`, so this is another file
 * with no product knowledge in it. Both fields are optional and the
 * corresponding element is simply absent when they are — a footer reading
 * "Powered by undefined" is the failure mode of doing this with props.
 *
 * A `<footer>`, which is a `contentinfo` landmark.
 */
export function AppFooter({
  children,
  actions,
  links,
  height = '4rem',
  className,
  ...props
}: AppFooterProps) {
  const brand = useBrand();

  return (
    <footer
      data-slot="app-footer"
      style={{ ['--footer-height' as string]: height }}
      className={cn(
        'flex w-full shrink-0 flex-col items-center justify-between gap-3 border-t border-border',
        'bg-background px-6 py-4 font-sans text-sm text-muted-foreground',
        'sm:h-[var(--footer-height)] sm:flex-row sm:py-0',
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {children ?? (brand.company ? <p>Powered by {brand.company}</p> : null)}

        {brand.docsUrl ? (
          <a
            href={brand.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {/* "Documentation", not "Docs": the accessible name of a link
                should make sense read out of context, which is how a screen
                reader's link list presents it. */}
            Documentation
          </a>
        ) : null}

        {links}
      </div>

      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </footer>
  );
}
