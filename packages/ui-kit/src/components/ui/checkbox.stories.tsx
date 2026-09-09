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

import { Checkbox } from './checkbox';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Base UI's checkbox, which handles the indeterminate state a table's select-all " +
          'header needs — `indeterminate` is a real prop there, not a DOM property you ' +
          'have to set in an effect.',
      },
    },
  },
  args: { 'aria-label': 'Select row' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3 font-sans text-sm">
      <label className="flex min-h-6 items-center gap-2">
        <Checkbox />
        Unchecked
      </label>
      <label className="flex min-h-6 items-center gap-2">
        <Checkbox defaultChecked />
        Checked
      </label>
      <label className="flex min-h-6 items-center gap-2">
        <Checkbox indeterminate checked={false} />
        Some selected
      </label>
      <label className="flex min-h-6 items-center gap-2 opacity-60">
        <Checkbox disabled />
        Disabled
      </label>
    </div>
  ),
};

export const StatesDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  render: States.render,
};
