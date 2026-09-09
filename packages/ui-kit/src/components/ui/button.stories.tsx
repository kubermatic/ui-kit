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
import { Rocket } from 'lucide-react';

import { variantKeys } from '@/test/variant-matrix';

import type { buttonVariants } from './button';
import { Button } from './button';

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

/*
 * Listing these as `Record<T, true>` is what makes the matrix below complete:
 * adding a variant to `buttonVariants` without adding it here fails typecheck.
 */
const VARIANTS = variantKeys<ButtonVariant>({
  default: true,
  secondary: true,
  destructive: true,
  outline: true,
  ghost: true,
  link: true,
});

const SIZES = variantKeys<ButtonSize>({
  sm: true,
  default: true,
  lg: true,
  icon: true,
});

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'shadcn styling over Base UI’s button primitive. Use `render` to ' +
          'compose it with a link or a router component.',
      },
    },
  },
  args: {
    children: 'Deploy cluster',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: SIZES },
    render: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every variant, so a change to the palette is visible in one glance. */
export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    // Snippet derived from the same list as the render, so the two cannot
    // drift; stories built with `render` otherwise show the raw CSF object.
    docs: {
      source: {
        code: [
          "import { Button } from '@kubermatic/ui-kit';",
          '',
          ...VARIANTS.map((variant) => `<Button variant="${variant}">${variant}</Button>`),
        ].join('\n'),
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: [
          "import { Button } from '@kubermatic/ui-kit';",
          "import { Rocket } from 'lucide-react';",
          '',
          '<Button size="sm">Small</Button>',
          '<Button size="default">Default</Button>',
          '<Button size="lg">Large</Button>',
          '<Button size="icon" aria-label="Deploy">',
          '  <Rocket />',
          '</Button>',
        ].join('\n'),
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Deploy">
        <Rocket />
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Rocket />
        Deploy cluster
      </>
    ),
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * `render` swaps the underlying element while keeping the styling. When the
 * replacement is not a `<button>`, `nativeButton={false}` must go with it so
 * Base UI applies link semantics instead of button ones.
 */
export const AsLink: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: [
          "import { Button } from '@kubermatic/ui-kit';",
          '',
          '// `nativeButton={false}` is required whenever the rendered element',
          '// is not a <button>, so Base UI applies link semantics instead.',
          '<Button nativeButton={false} render={<a href="https://kubermatic.com" />}>',
          '  Open docs',
          '</Button>',
        ].join('\n'),
      },
    },
  },
  render: () => (
    <Button nativeButton={false} render={<a href="https://kubermatic.com" />}>
      Open docs
    </Button>
  ),
};

/*
 * Dark counterpart. The a11y run renders each story once at whatever the
 * `theme` global says, so without this Button's variants are never
 * contrast-checked on the dark palette — which is exactly where `--primary`
 * flips to carrying dark text rather than white.
 */
export const VariantsDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  render: Variants.render,
};

export const SizesDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  render: Sizes.render,
};
