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

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';
import { RadioCircle } from './radio-circle';

const PRESETS = [
  {
    value: 'small',
    title: 'Small',
    detail: '2 vCPU · 4 GiB · 40 GiB csi-rbd',
  },
  {
    value: 'medium',
    title: 'Medium',
    detail: '4 vCPU · 8 GiB · 80 GiB csi-rbd',
  },
  {
    value: 'large',
    title: 'Large',
    detail: '8 vCPU · 32 GiB · 200 GiB csi-rbd',
  },
] as const;

const meta = {
  title: 'Primitives/Radio circle',
  component: RadioCircle,
  parameters: { layout: 'padded' },
  argTypes: { checked: { control: 'boolean' } },
  args: { checked: true },
} satisfies Meta<typeof RadioCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Purely presentational: a `checked` boolean and nothing else. No role, no
 * label, no input — it draws the dot and stops there.
 *
 * That is deliberate, and it is why every other story here renders it *inside*
 * a real labelled control. Presenting it standalone as though it were a radio
 * would document an accessibility bug the component does not actually have —
 * for a real radio, use `Primitives/Radio group`.
 */
export const Playground: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <RadioCircle {...args} />
      <RadioCircle checked={!args.checked} />
    </div>
  ),
};

/**
 * Its real job: the indicator inside a selectable card, where the card is the
 * control and carries the label, the role and the focus ring.
 */
export const SelectableCard: Story = {
  render: function PresetPicker() {
    const [selected, setSelected] = React.useState<string>('medium');

    return (
      <div
        role="radiogroup"
        aria-label="Instance preset"
        className="flex max-w-md flex-col gap-3"
      >
        {PRESETS.map((preset) => {
          const checked = selected === preset.value;

          return (
            <button
              key={preset.value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => setSelected(preset.value)}
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 data-[checked=true]:border-primary flex items-center gap-3 rounded-md border px-4 py-3 text-left transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
              data-checked={checked}
            >
              <RadioCircle checked={checked} />
              <span className="grid gap-0.5">
                <span className="text-sm font-medium">{preset.title}</span>
                <span className="text-muted-foreground text-xs">
                  {preset.detail}
                </span>
              </span>
              {preset.value === 'medium' && (
                <Badge variant="secondary" className="ml-auto">
                  Recommended
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    );
  },
};
