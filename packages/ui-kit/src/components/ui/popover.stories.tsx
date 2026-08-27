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
import { expect, screen, waitFor } from 'storybook/test';

import { Button } from './button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

const meta = {
  title: 'Primitives/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline">Node details</Button>}
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>worker-03</PopoverTitle>
          <PopoverDescription>
            Ready · 12 pods · kernel 6.8.0-45-generic
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

export const Open: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger
        render={<Button variant="outline">Node details</Button>}
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>worker-03</PopoverTitle>
          <PopoverDescription>Ready · 12 pods</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
  play: async () => {
    /*
     * `waitFor` around the visibility check, not just `findByText`: the popup is
     * in the DOM one frame before `animate-in`/`fade-in-0` has taken it off
     * opacity 0, so a one-shot `toBeVisible` races the entry animation.
     */
    await waitFor(async () => {
      await expect(screen.getByText('worker-03')).toBeVisible();
    });
  },
};

/**
 * All four sides at once.
 *
 * Each carries its own `data-[side=*]` slide-in variant and feeds
 * `origin-(--transform-origin)`, so a story showing only the default `bottom`
 * leaves three of the four animation paths unexercised.
 *
 * Each popover gets a fixed-size cell rather than sharing a flow with margins:
 * the positioner flips a side when it runs out of room, which would silently
 * render the opposite of what the label claims. A cell wide enough for trigger
 * plus popup makes the layout independent of the canvas width.
 */
export const Sides: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex flex-wrap justify-center">
      {SIDES.map((side) => (
        <div
          key={side}
          className="flex h-56 w-[30rem] items-center justify-center"
        >
          <Popover defaultOpen>
            <PopoverTrigger
              render={<Button variant="outline">{side}</Button>}
            />
            <PopoverContent side={side} className="w-56">
              <PopoverHeader>
                <PopoverTitle>side={side}</PopoverTitle>
                <PopoverDescription>
                  Slides in from the opposite edge.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  ),
};
