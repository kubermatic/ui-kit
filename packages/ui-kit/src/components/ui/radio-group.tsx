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

import { Radio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils.js';

export interface RadioGroupProps extends Omit<ComponentProps<typeof BaseRadioGroup>, 'className'> {
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({ className, orientation = 'vertical', ...props }: RadioGroupProps) {
  return (
    <BaseRadioGroup
      data-slot="radio-group"
      className={cn(
        'flex gap-2',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center gap-4',
        className,
      )}
      {...props}
    />
  );
}

export interface RadioProps extends Omit<ComponentProps<typeof Radio.Root>, 'className'> {
  className?: string;
  /** Label beside the control. Omit to render the dot alone. */
  children?: ReactNode;
}

/**
 * RadioGroupItem — the dot plus its label.
 *
 * The label is rendered as a wrapping `<label>` rather than a sibling, so the
 * hit target is the whole row. A 16px dot on its own fails WCAG 2.2's 24px
 * target-size minimum, which the axe run checks with real layout geometry.
 */
export function RadioGroupItem({ className, children, ...props }: RadioProps) {
  const control = (
    <Radio.Root
      data-slot="radio-group-item"
      className={cn(
        'flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-input',
        'shadow-xs transition-shadow outline-none',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'data-checked:border-primary data-checked:bg-primary',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <Radio.Indicator className="size-1.5 rounded-full bg-primary-foreground data-unchecked:hidden" />
    </Radio.Root>
  );

  if (!children) return control;

  return (
    <label className="flex min-h-6 cursor-pointer items-center gap-2 font-sans text-sm has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50">
      {control}
      {children}
    </label>
  );
}
