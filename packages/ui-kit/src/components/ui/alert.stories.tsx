/*
 * Copyright 2026 The Kubermatic ui-kit Authors.
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

import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { VariantProps } from 'class-variance-authority';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle, alertVariants } from './alert';

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

/*
 * Keyed by variant rather than hand-listed, so `Record<AlertVariant, …>` makes
 * the matrix complete by construction: a variant added to the cva config and
 * not given content here fails typecheck instead of going unrendered. The
 * content stays per-variant because a status alert reviewed with placeholder
 * text tells you nothing about whether the wording fits the surface.
 */
const VARIANT_CONTENT = {
  default: {
    icon: Info,
    title: 'Default',
    body: 'Neutral, card-coloured surface.',
  },
  info: {
    icon: Info,
    title: 'Info',
    body: 'Contextual detail, no action needed.',
  },
  success: {
    icon: CircleCheck,
    title: 'Success',
    body: 'Snapshot created successfully.',
  },
  warning: {
    icon: TriangleAlert,
    title: 'Warning',
    body: 'Storage class has no default volume snapshot class.',
  },
  error: {
    icon: CircleAlert,
    title: 'Error',
    body: 'Failed to attach data volume: quota exceeded.',
  },
} satisfies Record<
  AlertVariant,
  { icon: ComponentType; title: string; body: string }
>;

const VARIANTS = Object.keys(VARIANT_CONTENT) as AlertVariant[];

const meta = {
  title: 'Primitives/Alert',
  component: Alert,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { variant: 'info' },
  render: (args) => (
    <Alert {...args}>
      <Info />
      <AlertTitle>Live migration scheduled</AlertTitle>
      <AlertDescription>
        The virtual machine will move to another node during the next
        maintenance window.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * `warning` intentionally uses `--warning-soft` rather than `--warning`: the
 * text sits on the page background, so it carries its own contrast and the dark
 * theme lightens it. `info` and `success` work the same way through
 * `--info-soft` and `--success-soft`. Check both themes with the toolbar toggle
 * before changing any of them.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-4">
      {VARIANTS.map((variant) => {
        const { icon: Icon, title, body } = VARIANT_CONTENT[variant];

        return (
          <Alert key={variant} variant={variant}>
            <Icon />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{body}</AlertDescription>
          </Alert>
        );
      })}
    </div>
  ),
};
