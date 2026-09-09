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

import { ThemeToggle } from './theme-toggle';

const meta = {
  title: 'App Frame/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A `ToggleGroup`, so the three choices are one tab stop with arrow keys between ' +
          "them and the current one is `aria-pressed`. One product's theme selector is three " +
          'separate buttons with no grouping; the other has no dark mode at all, which is ' +
          'why its sidebar is hardcoded navy.\n\n' +
          'The `system` option matters more than it looks: without it, a user whose OS ' +
          'switches to dark in the evening is stuck at whatever they last picked, and there ' +
          'is no way back to "follow the OS" once you have chosen once. That is why the ' +
          'segmented form is the default — a two-state button cannot express it.\n\n' +
          'Note that the toolbar theme switch above controls the *story canvas*; this ' +
          'component drives the real `ThemeProvider`, which in Storybook is scoped to the ' +
          'canvas by the decorator.',
      },
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Segmented: Story = {};

export const Button_: Story = {
  args: { variant: 'button' },
};
