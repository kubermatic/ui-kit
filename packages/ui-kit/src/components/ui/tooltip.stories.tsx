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
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { Info, Trash2 } from 'lucide-react';

import { Button } from './button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

const meta = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  decorators: [
    /*
     * Every story needs a provider in scope. This kit overrides Base UI's
     * default and sets `delay` to 0, so tooltips here appear immediately —
     * worth knowing when comparing against Base UI's own documentation.
     */
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Delete volume">
            <Trash2 />
          </Button>
        }
      />
      <TooltipContent>Delete data volume</TooltipContent>
    </Tooltip>
  ),
};

/** Open by default, so the popup is reviewable in both themes. */
export const Open: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger render={<Button variant="outline">Quota</Button>} />
      <TooltipContent>18 of 24 vCPU allocated</TooltipContent>
    </Tooltip>
  ),
  play: async () => {
    await waitFor(async () => {
      await expect(screen.getByText('18 of 24 vCPU allocated')).toBeVisible();
    });
  },
};

/**
 * Keyboard focus has to open it too — an icon-only control whose only
 * explanation appears on hover is unusable without a pointer. Tabbing is the
 * check; the assertion below is what stops that regressing silently.
 *
 * `waitFor` wraps the visibility check because the popup mounts a frame before
 * `animate-in`/`fade-in-0` has moved it off opacity 0.
 */
export const KeyboardFocus: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Storage class help">
            <Info />
          </Button>
        }
      />
      <TooltipContent>csi-rbd is the cluster default</TooltipContent>
    </Tooltip>
  ),
  play: async () => {
    await userEvent.tab();
    await waitFor(async () => {
      await expect(
        screen.getByText('csi-rbd is the cluster default'),
      ).toBeVisible();
    });
  },
};

/** Each side has its own slide-in variant and arrow placement. */
export const Sides: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex flex-wrap justify-center">
      {SIDES.map((side) => (
        <div key={side} className="flex h-40 w-72 items-center justify-center">
          <Tooltip defaultOpen>
            <TooltipTrigger
              render={<Button variant="outline">{side}</Button>}
            />
            <TooltipContent side={side} sideOffset={8}>
              side={side}
            </TooltipContent>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};
