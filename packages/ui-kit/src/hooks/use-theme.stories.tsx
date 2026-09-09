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
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { useTheme } from './use-theme';

function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Text variant="small">
          Requested: <span className="font-mono">{theme}</span>
        </Text>
        <Text variant="small">
          Resolved: <span className="font-mono">{resolvedTheme}</span>
        </Text>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={toggleTheme} size="icon" aria-label="Toggle theme">
          {resolvedTheme === 'dark' ? <Moon /> : <Sun />}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setTheme('light')}>
          Light
        </Button>
        <Button variant="outline" size="sm" onClick={() => setTheme('dark')}>
          Dark
        </Button>
        <Button variant="outline" size="sm" onClick={() => setTheme('system')}>
          System
        </Button>
      </div>
    </div>
  );
}

const meta = {
  title: 'Foundations/Theming',
  component: ThemeSwitcher,
  parameters: {
    docs: {
      description: {
        component:
          '`ThemeProvider` resolves `system` against `prefers-color-scheme`, ' +
          'persists the choice to localStorage and toggles the `.dark` class ' +
          'that the palette keys off. `useTheme` reads and sets it. Note that ' +
          'in Storybook the provider is scoped to the story canvas, so these ' +
          'buttons and the toolbar control act on the same tree.',
      },
    },
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Switcher: Story = {};
