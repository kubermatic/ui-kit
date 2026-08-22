import type { Meta, StoryObj } from '@storybook/react-vite';
import { Activity, HardDrive, Network, Terminal } from 'lucide-react';

import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const VARIANTS = ['default', 'line'] as const;

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function Panels() {
  return (
    <>
      <TabsContent value="overview">
        <dl className="grid max-w-sm grid-cols-2 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Node</dt>
          <dd>worker-03</dd>
          <dt className="text-muted-foreground">IP</dt>
          <dd className="font-mono text-xs">10.244.2.17</dd>
          <dt className="text-muted-foreground">Status</dt>
          <dd>
            <Badge variant="success">Running</Badge>
          </dd>
        </dl>
      </TabsContent>
      <TabsContent value="storage" className="text-sm">
        One data volume on csi-rbd, 40 GiB.
      </TabsContent>
      <TabsContent value="network" className="text-sm">
        Attached to the pod network; no additional interfaces.
      </TabsContent>
      <TabsContent value="console" className="text-sm">
        Serial console is available while the VM is running.
      </TabsContent>
    </>
  );
}

export const Playground: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <Tabs {...args} defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">
          <Activity />
          Overview
        </TabsTrigger>
        <TabsTrigger value="storage">
          <HardDrive />
          Storage
        </TabsTrigger>
        <TabsTrigger value="network">
          <Network />
          Network
        </TabsTrigger>
        <TabsTrigger value="console" disabled>
          <Terminal />
          Console
        </TabsTrigger>
      </TabsList>
      <Panels />
    </Tabs>
  ),
};

/**
 * `line` drops the filled pill for an underline drawn by the trigger's `after`
 * pseudo-element — which is why it needs its own story: the active indicator is
 * a different mechanism, not a different colour.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {VARIANTS.map((variant) => (
        <Tabs key={variant} defaultValue="overview">
          <TabsList variant={variant}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>
          <Panels />
        </Tabs>
      ))}
    </div>
  ),
};

/**
 * The vertical path is entirely separate CSS — the list stacks, triggers go
 * full-width and left-aligned, and the `line` indicator moves to the right
 * edge. Covering only `horizontal` leaves all of that untested.
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {VARIANTS.map((variant) => (
        <Tabs key={variant} orientation="vertical" defaultValue="overview">
          <TabsList variant={variant}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>
          <Panels />
        </Tabs>
      ))}
    </div>
  ),
};
