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

import { variantKeys } from '@/test/variant-matrix';

import type { spinnerVariants } from './spinner';
import { Spinner } from './spinner';

type SpinnerSize = NonNullable<VariantProps<typeof spinnerVariants>['size']>;

/* Complete by construction — see test/variant-matrix.ts. */
const SIZES = variantKeys<SpinnerSize>({ sm: true, default: true, lg: true });

const meta = {
  title: 'Primitives/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An indeterminate busy indicator. `role="status"` with a polite live region, so ' +
          'the label is announced when it appears without interrupting. Prefer `Skeleton` ' +
          'when the shape of the arriving content is known — it does not move the layout ' +
          'when it resolves.',
      },
    },
  },
  args: { label: 'Loading clusters' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-6">
      {SIZES.map((size) => (
        <Spinner key={size} size={size} label={`Loading (${size})`} />
      ))}
    </div>
  ),
};

/** The label can be shown as well as announced, for a full-page load. */
export const WithVisibleLabel: Story = {
  args: { showLabel: true, label: 'Loading clusters…' },
};

export const SizesDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  render: Sizes.render,
};
