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
import { Input } from './input';
import { Switch } from './switch';
import { Textarea } from './textarea';

const meta = {
  title: 'Forms/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          "The label / description / error scaffold every form row needs. Base UI's " +
          "`Field` generates the control's id, points the label at it, and collects the " +
          'description and error into `aria-describedby` — the part that is easy to get ' +
          'subtly wrong.\n\n' +
          '`error` is a plain node rather than a validation result, because react-hook-form ' +
          'is a singleton peer dependency: a library that imported it would risk a second ' +
          'copy and a form that cannot see its own provider. So the integration is one ' +
          'line at the call site — `error={errors.name?.message}`.',
      },
    },
  },
  args: { label: 'Name' },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { description: 'Lowercase letters, numbers and dashes.' },
  render: (args) => (
    <div className="w-80">
      <Field {...args}>
        <Input placeholder="db-credentials" />
      </Field>
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: 'Name',
    required: true,
    error: 'A name is required.',
  },
  render: (args) => (
    <div className="w-80">
      <Field {...args}>
        <Input required aria-invalid />
      </Field>
    </div>
  ),
};

export const WithTextarea: Story = {
  args: { label: 'Description', description: 'Shown in the service catalogue.' },
  render: (args) => (
    <div className="w-80">
      <Field {...args}>
        <Textarea rows={4} />
      </Field>
    </div>
  ),
};

/** Horizontal, for a settings row where the control is small. */
export const Horizontal: Story = {
  args: { label: 'Reconcile automatically', orientation: 'horizontal' },
  render: (args) => (
    <div className="w-96">
      <Field {...args}>
        <Switch />
      </Field>
    </div>
  ),
};

export const WithErrorDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  args: WithError.args,
  render: WithError.render,
};
