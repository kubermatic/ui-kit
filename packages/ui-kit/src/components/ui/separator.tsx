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

import { Separator as BaseSeparator } from '@base-ui/react/separator';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

export interface SeparatorProps extends Omit<ComponentProps<typeof BaseSeparator>, 'className'> {
  className?: string;
}

/**
 * Separator — a divider that is announced correctly.
 *
 * Base UI gives it `role="separator"` plus the orientation, which is the
 * difference between a divider a screen reader can use to understand the
 * grouping and a `<div>` with a border.
 */
export function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps) {
  return (
    <BaseSeparator
      data-slot="separator"
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch',
        className,
      )}
      {...props}
    />
  );
}
