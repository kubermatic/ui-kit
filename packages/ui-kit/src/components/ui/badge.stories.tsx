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
import { AlertTriangle, Check } from 'lucide-react';

import { variantKeys } from '@/test/variant-matrix';

import type { badgeVariants } from './badge';
import { Badge } from './badge';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

/* Complete by construction — see test/variant-matrix.ts. */
const VARIANTS = variantKeys<BadgeVariant>({
  accent: true,
  rose: true,
  honey: true,
  primary: true,
  destructive: true,
  secondary: true,
  outline: true,
});

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Where the brand highlight colours live. Teal, Rosé and Honey each ' +
          'measure under 3:1 against white, so they cannot be text or a ' +
          'functional border on a light background — but as a filled surface ' +
          'carrying Dark Azure they reach 10.67:1, 7.35:1 and 10.11:1.',
      },
    },
  },
  args: { children: 'Healthy', variant: 'accent' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    as: { table: { disable: true } },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: [
          "import { Badge } from '@kubermatic/ui-kit';",
          '',
          ...VARIANTS.map((variant) => `<Badge variant="${variant}">${variant}</Badge>`),
        ].join('\n'),
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

/** Badges read as status, so they usually carry an icon. */
export const WithIcon: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: [
          "import { Badge } from '@kubermatic/ui-kit';",
          "import { AlertTriangle, Check } from 'lucide-react';",
          '',
          '<Badge variant="accent">',
          '  <Check />',
          '  Running',
          '</Badge>',
          '<Badge variant="honey">',
          '  <AlertTriangle />',
          '  Degraded',
          '</Badge>',
        ].join('\n'),
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="accent">
        <Check />
        Running
      </Badge>
      <Badge variant="honey">
        <AlertTriangle />
        Degraded
      </Badge>
      <Badge variant="destructive">
        <AlertTriangle />
        Failed
      </Badge>
    </div>
  ),
};

export const VariantsDark: Story = {
  globals: { theme: 'dark' },
  // Exists for axe coverage of the dark palette, not for the docs page.
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  render: Variants.render,
};
