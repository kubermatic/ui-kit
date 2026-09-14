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
import { CopyButton } from './copy-button.js';

export type CodeProps = ComponentProps<'code'>;

/**
 * Code — an inline snippet. A resource name, a field path, a flag.
 *
 * `Text variant="code"` is the same styling for prose; this is the element on
 * its own, for a table cell or a description-list value.
 */
export function Code({ className, ...props }: CodeProps) {
  return (
    <code
      data-slot="code"
      className={cn(
        'rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.8125rem] break-all text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export interface CodeBlockProps extends Omit<ComponentProps<'pre'>, 'children'> {
  /**
   * The code, as a string. A string rather than nodes because the copy button
   * needs the exact text — one product's `Pre` casts `props.children as string` and
   * silently copies "[object Object]" whenever anything nests inside it.
   */
  children: string;
  /** Language name shown in the corner. Not used for highlighting. */
  language?: string;
  /** Renders the copy button. */
  copyable?: boolean;
  /** Accessible name for the copy button. */
  copyLabel?: string;
  /** Caps the height and scrolls. */
  maxHeight?: string;
  /** Extra controls beside the copy button — "Download", "Open in editor". */
  actions?: ReactNode;
}

/**
 * CodeBlock — a read-only block of YAML, JSON or a shell command.
 *
 * Not a syntax highlighter and not an editor. For an editable manifest both
 * products reach for Monaco or CodeMirror, which is a 2 MB dependency that does
 * not belong in a primitives package; a product that needs one owns that
 * dependency itself.
 *
 * `tabIndex={0}` on the `<pre>`, because a scrollable region that only
 * responds to the mouse is unreachable: SC 2.1.1 requires the keyboard to be
 * able to scroll it, and a `<pre>` is not focusable by default.
 */
export function CodeBlock({
  children,
  language,
  copyable = true,
  copyLabel,
  maxHeight = '24rem',
  actions,
  className,
  ...props
}: CodeBlockProps) {
  return (
    <div data-slot="code-block" className="group/code-block relative">
      <pre
        tabIndex={0}
        style={{ maxHeight }}
        className={cn(
          'overflow-auto rounded-md border border-border bg-muted p-4',
          'font-mono text-[0.8125rem] leading-relaxed whitespace-pre text-foreground',
          'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
          copyable || actions ? 'pr-14' : undefined,
          className,
        )}
        {...props}
      >
        <code>{children}</code>
      </pre>

      {language ? (
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-4 font-sans text-[0.6875rem] tracking-wide text-muted-foreground uppercase"
        >
          {language}
        </span>
      ) : null}

      {copyable || actions ? (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {actions}
          {copyable ? (
            <CopyButton
              value={children}
              label={copyLabel ?? (language ? `Copy ${language}` : 'Copy code')}
              variant="outline"
              size="icon"
              className="size-7 bg-background"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
