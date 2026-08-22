import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2, CircleAlert } from 'lucide-react';

import { Badge } from './badge';

const VARIANTS = [
  'default',
  'secondary',
  'outline',
  'success',
  'warning',
  'info',
  'destructive',
] as const;

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
