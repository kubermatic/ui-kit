import type { Meta, StoryObj } from '@storybook/react-vite';
import type { VariantProps } from 'class-variance-authority';
import { CheckCircle2, CircleAlert } from 'lucide-react';

import { variantKeys } from '@/test/variant-matrix';
import { Badge, badgeVariants } from './badge';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

/*
 * `ghost` and `link` shipped for some time with no story rendering them, which
 * is what `variantKeys` now prevents: this fails to type-check the moment the
 * cva config gains a variant that is missing here.
 */
const VARIANTS = variantKeys<BadgeVariant>({
  default: true,
  secondary: true,
  outline: true,
  success: true,
  warning: true,
  info: true,
  destructive: true,
  ghost: true,
  link: true,
});

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: { variant: { control: 'select', options: VARIANTS } },
  args: { children: 'Running' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

/** The status vocabulary these dashboards actually render. */
export const ResourceStatus: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="success">
        <CheckCircle2 />
        Running
      </Badge>
      <Badge variant="warning">Provisioning</Badge>
      <Badge variant="destructive">
        <CircleAlert />
        Failed
      </Badge>
      <Badge variant="secondary">Stopped</Badge>
      <Badge variant="outline">Unknown</Badge>
    </div>
  ),
};
