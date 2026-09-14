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

import { Button } from './button';
import { CodeBlock } from './code-block';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

const TRACE = `Events:
  Type     Reason        Age   Message
  ----     ------        ----  -------
  Warning  UpdateFailed  2m    dial tcp 10.0.4.2:8200: connect: connection refused
  Warning  UpdateFailed  7m    dial tcp 10.0.4.2:8200: connect: connection refused
  Normal   Synced        1h    Secret written`;

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "A panel that slides in from an edge. Built on Base UI's **Dialog** rather than " +
          'its `Drawer`, deliberately: the dedicated primitive adds swipe-to-dismiss and ' +
          'snap points, which is worth having for a mobile bottom sheet and is not what ' +
          "either product uses this for — both open a right-hand panel with a resource's " +
          'YAML or an error trace in it. Dialog gives the same focus trap, inert background ' +
          'and escape handling with a fraction of the API.\n\n' +
          '`side="left"` is also what the app sidebar becomes below the mobile breakpoint.',
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">View sync errors</Button>} />
      <DrawerContent size="lg">
        <DrawerHeader>
          <DrawerTitle>Sync errors</DrawerTitle>
          <DrawerDescription>db-credentials, last 24 hours.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <CodeBlock copyable={false}>{TRACE}</CodeBlock>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Close</Button>} />
          <Button>Force sync</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex gap-2">
      {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
        <Drawer key={side}>
          <DrawerTrigger render={<Button variant="outline">{side}</Button>} />
          <DrawerContent side={side}>
            <DrawerHeader>
              <DrawerTitle>From the {side}</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="font-sans text-sm text-muted-foreground">
              The edge it enters from is the only difference.
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};
