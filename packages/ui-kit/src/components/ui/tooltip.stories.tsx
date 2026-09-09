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
import { Info, RefreshCw } from 'lucide-react';

import { Button } from './button';
import { Tooltip, TooltipProvider } from './tooltip';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tooltip is *supplementary* — a description, not a label. It must never be the ' +
          'only place information exists, because it is unreachable by touch: an icon ' +
          'button still needs its own `aria-label` as well.\n\n' +
          'Base UI renders the popup as `role="presentation"` and sets no ' +
          '`aria-describedby`, which is a defensible default but leaves the *content* ' +
          'unreachable to a screen reader. This wrapper adds `role="tooltip"` and points ' +
          "the trigger's `aria-describedby` at it, because the case that matters most is " +
          'the one where the tooltip says something the label does not — "disabled because ' +
          'you lack permission", a truncated name in full.\n\n' +
          'The open delay lives on `TooltipProvider`, not on each tooltip: a per-tooltip ' +
          'delay means a row of icon buttons where each one opens on its own schedule.',
      },
    },
  },
  args: { content: 'Re-reads the provider now', children: null },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip content="Re-reads the provider now">
        <Button variant="outline" size="icon" aria-label="Force sync">
          <RefreshCw />
        </Button>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Sides: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-3">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side} content={`Opens ${side}`} side={side}>
            <Button variant="outline" size="icon" aria-label={`Info, ${side}`}>
              <Info />
            </Button>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};
