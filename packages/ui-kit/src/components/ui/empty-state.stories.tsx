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
import { KeyRound, Plus } from 'lucide-react';

import { Button } from './button';
import { EmptyState } from './empty-state';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component:
          'Nothing here yet, and what to do about it. The title is a `<p>`, not a heading: ' +
          'an empty list sits inside a page that already has an `<h1>`, and "No secrets ' +
          'yet" is not a section of the document — emitting an `<h2>` here puts a phantom ' +
          'entry in the outline a screen-reader user navigates by.',
      },
    },
  },
  args: {
    icon: <KeyRound />,
    title: 'No external secrets yet',
    description:
      'An ExternalSecret pulls a value from a provider and writes it into a Kubernetes Secret.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    action: (
      <Button>
        <Plus />
        New external secret
      </Button>
    ),
  },
  render: (args) => (
    <div className="w-[36rem]">
      <EmptyState {...args} />
    </div>
  ),
};

/** The dashed frame, for a whole empty page rather than an empty table body. */
export const Placeholder: Story = {
  args: {
    variant: 'placeholder',
    action: (
      <Button>
        <Plus />
        New external secret
      </Button>
    ),
  },
  render: (args) => (
    <div className="w-[36rem]">
      <EmptyState {...args} />
    </div>
  ),
};

export const PlaceholderDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  args: Placeholder.args,
  render: Placeholder.render,
};
