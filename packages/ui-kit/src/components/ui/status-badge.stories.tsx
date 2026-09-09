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

import { variantKeys } from '@/test/variant-matrix';

import { StatusBadge, StatusDot, type StatusTone } from './status-badge';

/* Complete by construction — see test/variant-matrix.ts. */
const TONES = variantKeys<StatusTone>({
  success: true,
  warning: true,
  error: true,
  info: true,
  pending: true,
  neutral: true,
});

const meta = {
  title: 'Data/StatusBadge',
  component: StatusBadge,
  parameters: {
    docs: {
      description: {
        component:
          "A resource's state, as a chip. Both products invented their own tone list and " +
          'then hardcoded Tailwind palette colours (`bg-green-50 text-green-700`) that no ' +
          'theme can reach and nothing measures. The names here are about *meaning*, so a ' +
          'product mapping "Synced", "Ready" and "Available" all onto `success` keeps one ' +
          'visual language.\n\n' +
          'There is deliberately **no tinted variant.** The obvious design is a pale wash — ' +
          '`bg-success/10` with `text-success` — and it is not available, because an ' +
          'opacity tint composites to a colour outside the token set whose contrast nothing ' +
          'measures. `solid` is a measured surface/foreground pair and `outline` is a ' +
          'measured foreground on `--background`; a tint would only *look* like it was AA.',
      },
    },
  },
  args: { children: 'Synced', tone: 'success' },
  argTypes: { tone: { control: 'select', options: TONES } },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {TONES.map((tone) => (
          <StatusBadge key={tone} tone={tone} dot>
            {tone}
          </StatusBadge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {TONES.map((tone) => (
          <StatusBadge key={tone} tone={tone} variant="outline" dot>
            {tone}
          </StatusBadge>
        ))}
      </div>
    </div>
  ),
};

/**
 * The compact indicator, for a table cell or a picker row. Every tone here
 * clears 3:1 against `--background` in both palettes — which is why `success`
 * and `warning` are the darkened roles rather than brand Teal and Honey: those
 * measure 1.77:1 and 1.87:1 on white, so as a bare dot on a light page they
 * would be decoration that happens to be invisible.
 */
export const Dots: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2 font-sans text-sm">
      {TONES.map((tone) => (
        <span key={tone} className="flex items-center gap-2">
          <StatusDot tone={tone} label={tone} />
          {tone}
        </span>
      ))}
    </div>
  ),
};

export const TonesDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  render: Tones.render,
};

export const DotsDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  render: Dots.render,
};
