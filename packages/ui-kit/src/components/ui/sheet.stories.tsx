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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen } from 'storybook/test';

import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

const meta = {
  title: 'Primitives/Sheet',
  component: Sheet,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Edit VM</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>web-frontend-01</SheetTitle>
          <SheetDescription>
            Changes apply on the next restart.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="sheet-vm-cpu">vCPU</Label>
            <Input id="sheet-vm-cpu" defaultValue="4" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sheet-vm-memory">Memory</Label>
            <Input id="sheet-vm-memory" defaultValue="8 GiB" />
          </div>
        </div>
        <SheetFooter>
          <Button>Save</Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Open: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>db-primary</SheetTitle>
          <SheetDescription>worker-01 · 10.244.2.17</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Close</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async () => {
    await expect(
      screen.getByRole('dialog', { name: /db-primary/i }),
    ).toBeInTheDocument();
  },
};

/**
 * The edge a sheet slides from is its own axis, separate from the positioning
 * `side` other overlays take: each edge has its own inset, border side and
 * slide-in animation, so a story covering only `right` leaves three untested.
 */
export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline">{side}</Button>} />
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Slides in from {side}</SheetTitle>
              <SheetDescription>
                Top and bottom size to their content; left and right take three
                quarters of the viewport, capped at `sm`.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
