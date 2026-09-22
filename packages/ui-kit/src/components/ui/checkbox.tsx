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

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Check, Minus } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

export interface CheckboxProps extends Omit<ComponentProps<typeof BaseCheckbox.Root>, 'className'> {
  className?: string;
}

/**
 * Checkbox — Base UI's checkbox, which handles the indeterminate state that
 * a table's select-all header needs. `indeterminate` is a real prop there,
 * not a DOM property you have to set in an effect.
 */
export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      className={cn(
        'peer flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-input',
        'shadow-xs transition-shadow outline-none',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground',
        'data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'aria-invalid:border-destructive-tone aria-invalid:ring-destructive-tone/30',
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator
        className="flex items-center justify-center text-current data-unchecked:hidden"
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>
            {state.indeterminate ? <Minus className="size-3.5" /> : <Check className="size-3.5" />}
          </span>
        )}
      />
    </BaseCheckbox.Root>
  );
}
