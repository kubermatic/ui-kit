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

import { Monitor, Moon, Sun } from 'lucide-react';

import { useTheme, type Theme } from '../../hooks/use-theme.js';
import { cn } from '../../lib/utils.js';
import { Button } from './button.js';
import { ToggleGroup, ToggleGroupItem } from './toggle-group.js';

const OPTIONS = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
] as const satisfies readonly { value: Theme; label: string; Icon: unknown }[];

export interface ThemeToggleProps {
  /**
   * `segmented` shows all three choices, `button` cycles light → dark with one
   * control. The segmented form is the honest one — it can express `system`,
   * which a two-state button cannot — so it is the default.
   */
  variant?: 'segmented' | 'button';
  className?: string;
}

/**
 * ThemeToggle — light, dark, or follow the OS.
 *
 * A `ToggleGroup`, so the three choices are one tab stop with arrow keys
 * between them, and the current one is `aria-pressed`. One product's theme
 * selector is three separate buttons with no grouping; the other has none at
 * all, which is why its sidebar is hardcoded navy.
 *
 * The `system` option matters more than it looks: without it, a user whose OS
 * switches to dark in the evening is stuck at whatever they last picked, and
 * there is no way back to "follow the OS" once you have chosen once.
 */
export function ThemeToggle({ variant = 'segmented', className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'button') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
        className={className}
      >
        {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
      </Button>
    );
  }

  return (
    <ToggleGroup
      /*
       * Base UI's toggle group is always array-valued — `multiple={false}` is
       * what makes it behave like a radio group rather than a set of
       * independent switches, and the value stays an array of one either way.
       */
      value={[theme]}
      onValueChange={(value) => {
        const next = value[0];
        if (next) setTheme(next as Theme);
      }}
      multiple={false}
      aria-label="Theme"
      className={cn(className)}
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label}>
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
