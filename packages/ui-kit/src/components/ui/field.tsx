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
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

/**
 * Field — the label / description / error scaffold every form row needs.
 *
 * Base UI's `Field` is doing the part that is easy to get subtly wrong: it
 * generates the control's id, points the label at it, and collects the
 * description and error into `aria-describedby`. Every control in this kit
 * (`Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `Switch`,
 * `RadioGroup`) is wired to pick that up automatically when nested here, and
 * still works standalone when it is not.
 *
 * **`error` is a plain node, not a validation result.** Both products drive
 * validation from react-hook-form and Zod, and react-hook-form is a singleton
 * peer dependency — a library that imported it would risk a second copy and a
 * form that cannot see its own provider. So the integration is one line in the
 * consumer:
 *
 *   <Field label="Name" error={errors.name?.message}>
 *     <Input {...register('name')} />
 *   </Field>
 *
 * `match` is passed to Base UI's `Field.Error` as `true`, which is its
 * documented hook for letting an external library own visibility.
 */
export interface FieldProps extends Omit<
  ComponentProps<typeof BaseField.Root>,
  'className' | 'children'
> {
  /** Visible label. Omit for a control that is labelled some other way. */
  label?: ReactNode;
  /** Helper text below the control. Announced as part of the description. */
  description?: ReactNode;
  /**
   * Error message. Falsy renders nothing, so `errors.name?.message` can be
   * passed straight through.
   */
  error?: ReactNode;
  /**
   * Marks the label. This is presentational only — set `required` on the
   * control itself so the browser and Base UI both know about it.
   */
  required?: boolean;
  /** Lays the control out beside the label rather than under it. */
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  children?: ReactNode;
}

export function Field({
  label,
  description,
  error,
  required,
  orientation = 'vertical',
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <BaseField.Root
      data-slot="field"
      className={cn(
        'group/field',
        orientation === 'vertical'
          ? 'flex w-full flex-col gap-1.5'
          : 'flex w-full items-center justify-between gap-4',
        className,
      )}
      {...props}
    >
      {label ? (
        <BaseField.Label
          data-slot="field-label"
          className="font-sans text-sm leading-none font-medium data-disabled:opacity-50"
        >
          {label}
          {required ? (
            /* Decorative: the control carries the real `required`, and a
             * screen reader announces that. Reading "asterisk" after every
             * label is noise. */
            <span aria-hidden="true" className="ml-0.5 text-destructive">
              *
            </span>
          ) : null}
        </BaseField.Label>
      ) : null}

      {children}

      {description ? (
        <BaseField.Description
          data-slot="field-description"
          className="font-sans text-xs text-muted-foreground"
        >
          {description}
        </BaseField.Description>
      ) : null}

      {error ? (
        <BaseField.Error
          match
          data-slot="field-error"
          className="font-sans text-xs font-medium text-destructive"
        >
          {error}
        </BaseField.Error>
      ) : null}
    </BaseField.Root>
  );
}

/**
 * The parts, for a layout `Field` does not cover — a label beside a control
 * with the error somewhere else entirely, say.
 */
export const FieldRoot = BaseField.Root;
export const FieldLabel = BaseField.Label;
export const FieldDescription = BaseField.Description;
export const FieldError = BaseField.Error;
export const FieldControl = BaseField.Control;
