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

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.js';

export interface SwitchProps extends Omit<ComponentProps<typeof BaseSwitch.Root>, 'className'> {
  className?: string;
}

/**
 * Switch — for settings that take effect immediately.
 *
 * Both products currently call this a "Toggle", which collides with the
 * pressed-button sense of the word that `ToggleGroup` uses. A switch changes
 * state; a toggle button changes a selection. Named for the former.
 */
export function Switch({ className, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent',
        'bg-input shadow-xs transition-colors outline-none',
        'focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'data-checked:bg-primary',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-background shadow-sm ring-0',
          'transition-transform data-checked:translate-x-4 data-unchecked:translate-x-0.5',
        )}
      />
    </BaseSwitch.Root>
  );
}
