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
import type { VariantProps } from 'class-variance-authority';
import { Search } from 'lucide-react';

import { variantKeys } from '@/test/variant-matrix';

import type { inputVariants } from './input';
import { Input } from './input';

type InputSize = NonNullable<VariantProps<typeof inputVariants>['size']>;

const SIZES = variantKeys<InputSize>({ sm: true, default: true, lg: true });

const meta = {
  title: 'Forms/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          "Base UI's input, which wires itself to an enclosing `Field`. The adornment " +
          'props exist because both products hand-roll the same absolutely-positioned ' +
          'magnifier over a padded input on every table toolbar — and when neither is ' +
          'given, the markup is a bare `<input>` with no wrapper to fight with in a flex ' +
          'layout.',
      },
    },
  },
  args: { placeholder: 'db-credentials', 'aria-label': 'Name' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      {SIZES.map((size) => (
        <Input key={size} size={size} aria-label={size} placeholder={size} />
      ))}
    </div>
  ),
};

export const Search_: Story = {
  name: 'With an adornment',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-80">
      <Input aria-label="Search secrets" placeholder="Search…" startAdornment={<Search />} />
    </div>
  ),
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'Not a valid name' },
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'kube-system' },
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};
