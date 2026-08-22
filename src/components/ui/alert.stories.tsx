import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './alert';

const meta = {
  title: 'Primitives/Alert',
  component: Alert,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'error'],
    },
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
 * text sits on the page background, so the dark theme lightens it to stay
 * legible. Check both themes with the toolbar toggle before changing it.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-4">
      <Alert>
        <Info />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Neutral, card-coloured surface.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
          Contextual detail, no action needed.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheck />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Snapshot created successfully.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Storage class has no default volume snapshot class.
        </AlertDescription>
      </Alert>
      <Alert variant="error">
        <CircleAlert />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to attach data volume: quota exceeded.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
