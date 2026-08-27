import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';
import { Button } from './button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>web-frontend-01</CardTitle>
        <CardDescription>Ubuntu 24.04 · 4 vCPU · 8 GiB</CardDescription>
        <CardAction>
          <Badge variant="success">Running</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Node</dt>
          <dd>worker-03</dd>
          <dt className="text-muted-foreground">IP</dt>
          <dd className="font-mono text-xs">10.244.2.17</dd>
        </dl>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Console</Button>
        <Button size="sm" variant="outline">
          Restart
        </Button>
      </CardFooter>
    </Card>
  ),
};

/** `CardAction` is slotted into the header grid — it does not need positioning. */
export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Storage profile</CardTitle>
        <CardDescription>ceph-rbd (default)</CardDescription>
      </CardHeader>
    </Card>
  ),
};
