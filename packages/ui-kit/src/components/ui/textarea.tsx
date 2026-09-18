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

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'className'> {
  className?: string;
}

/**
 * Textarea — `Field.Control` rendered as a `<textarea>`.
 *
 * Base UI has no separate textarea primitive; `Field.Control` takes a `render`
 * prop for exactly this, which keeps the Field wiring (id, `aria-describedby`,
 * `aria-invalid`, dirty/touched state) identical to `Input`'s.
 *
 * The native props go on the rendered `<textarea>` rather than on
 * `Field.Control`, whose own props are typed against `<input>` — `rows` and
 * `cols` do not exist there. Base UI merges its wiring into the element it is
 * given, so this is the composition it is designed for, not a way around it.
 */
export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <BaseField.Control
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-background px-3 py-2',
        'font-sans text-sm text-foreground shadow-xs transition-[color,box-shadow]',
        'placeholder:text-muted-foreground',
        'outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive-tone aria-invalid:ring-destructive-tone/30',
        className,
      )}
      render={<textarea {...props} />}
    />
  );
}
