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

import { Text } from '@/components/ui/text';

const meta = {
  title: 'Foundations/Typography',
  component: Text,
  parameters: {
    docs: {
      description: {
        component:
          'Three faces, per the brand document: **Ubuntu Bold** for headlines, ' +
          '**Roboto Bold** for sublines, **Roboto** for general text. Both ' +
          'headline and subline levels are written in Title Case — as an ' +
          'authoring convention, not a `text-transform`, since `capitalize` ' +
          'would also upper-case articles ("Deploy A Cluster").',
      },
    },
  },
  args: { children: 'The Cluster Is Provisioning' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'subline', 'body', 'small', 'code'],
    },
    tone: { control: 'select', options: ['default', 'muted', 'heading', 'primary', 'destructive'] },
    weight: { control: 'select', options: [undefined, 'normal', 'medium', 'bold'] },
    as: { table: { disable: true } },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The full hierarchy, in the order it would appear on a page. */
export const Hierarchy: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="max-w-2xl space-y-4">
      <Text variant="h1">Manage Kubernetes At Scale</Text>
      <Text variant="subline">Ubuntu Bold Above, Roboto Bold Here</Text>
      <Text variant="body">
        General text is set in Roboto. It carries the explanatory copy — the paragraphs that do the
        actual work of a page — and sits at a comfortable reading measure.
      </Text>
      <Text variant="h2">A Second-Level Headline</Text>
      <Text variant="body">
        Headlines use Ubuntu Bold and take the <code className="font-mono">heading</code> colour
        role, which is Aegean on light backgrounds. No blue is both legible and recognisably Aegean
        on Dark Azure, so on dark the role follows <code className="font-mono">foreground</code>.
      </Text>
      <Text variant="h3">A Third-Level Headline</Text>
      <Text variant="small" tone="muted">
        Small muted text, for hints and secondary metadata.
      </Text>
      <Text variant="code">kubectl get clusters</Text>
    </div>
  ),
};

/** Which face each variant actually resolves to. */
export const Faces: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="space-y-6">
      <div className="space-y-1">
        <Text variant="small" tone="muted" className="font-mono text-xs">
          font-display · Ubuntu Bold · headlines
        </Text>
        <Text variant="h2">Deploy A Cluster In Minutes</Text>
      </div>
      <div className="space-y-1">
        <Text variant="small" tone="muted" className="font-mono text-xs">
          font-sans bold · Roboto Bold · sublines
        </Text>
        <Text variant="subline">Built For Platform Teams</Text>
      </div>
      <div className="space-y-1">
        <Text variant="small" tone="muted" className="font-mono text-xs">
          font-sans · Roboto · general text
        </Text>
        <Text variant="body">
          Roboto at 400 handles body copy, table cells, form labels and everything else that is not
          a headline or a subline.
        </Text>
      </div>
    </div>
  ),
};

export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="space-y-2">
      <Text tone="default">Default — foreground</Text>
      <Text tone="heading">Heading — Aegean on light, `foreground` on dark</Text>
      <Text tone="primary">Primary — Cerulean, corrected to 4.65:1</Text>
      <Text tone="muted">Muted — secondary metadata</Text>
      <Text tone="destructive">Destructive — Maroon</Text>
    </div>
  ),
};

export const TonesDark: Story = {
  globals: { theme: 'dark' },
  // Exists for axe coverage of the dark palette, not for the docs page.
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  render: Tones.render,
};
