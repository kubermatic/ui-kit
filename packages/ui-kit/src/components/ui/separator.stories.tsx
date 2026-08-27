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
import { expect } from 'storybook/test';

import { Separator } from './separator';

const meta = {
  title: 'Primitives/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    decorative: { control: 'boolean' },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { orientation: 'horizontal', decorative: true },
  render: (args) => (
    <div className="w-72">
      <p className="text-sm font-medium">Cluster</p>
      <p className="text-muted-foreground text-sm">
        4 nodes · 18 of 24 vCPU allocated
      </p>
      <Separator {...args} className="my-4" />
      <p className="text-muted-foreground text-sm">Kubernetes v1.31.4</p>
    </div>
  ),
};

/** Vertical needs a height from its container — it has none of its own. */
export const Orientation: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-72">
        <Separator />
      </div>
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Running</span>
        <Separator orientation="vertical" />
        <span>Stopped</span>
        <Separator orientation="vertical" />
        <span>Failed</span>
      </div>
    </div>
  ),
};

/**
 * The only reason this component is non-trivial.
 *
 * A decorative separator is a visual rule and is hidden from the accessibility
 * tree (`role="none"`); a semantic one announces a real boundary between
 * regions (`role="separator"`). Default is decorative, because most rules in a
 * dashboard are just paint.
 *
 * The guard asserts the role split rather than presence — `toBeVisible` passes
 * on both and so cannot tell them apart.
 */
export const DecorativeVsSemantic: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-6">
      <div>
        <p className="text-muted-foreground mb-2 text-xs">
          decorative (default) — role=&quot;none&quot;
        </p>
        <Separator data-testid="decorative" />
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-xs">
          decorative=false — role=&quot;separator&quot;
        </p>
        <Separator decorative={false} data-testid="semantic" />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('decorative')).toHaveAttribute(
      'role',
      'none',
    );
    await expect(canvas.getByTestId('semantic')).toHaveAttribute(
      'role',
      'separator',
    );
  },
};
