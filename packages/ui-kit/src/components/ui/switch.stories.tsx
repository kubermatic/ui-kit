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

import { Field } from './field';
import { Switch } from './switch';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'For a setting that takes effect immediately. Both products currently call this ' +
          'a "Toggle", which collides with the pressed-button sense of the word that ' +
          '`ToggleGroup` uses: a switch changes state, a toggle button changes a ' +
          'selection. Named for the former.',
      },
    },
  },
  args: { 'aria-label': 'Reconcile automatically' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InAField: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-96">
      <Field
        label="Reconcile automatically"
        description="Re-reads the provider every refresh interval."
        orientation="horizontal"
      >
        <Switch defaultChecked />
      </Field>
    </div>
  ),
};
