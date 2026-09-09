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
import { ErrorState } from './error-state';

const meta = {
  title: 'Feedback/ErrorState',
  component: ErrorState,
  parameters: {
    docs: {
      description: {
        component:
          'A whole region failed to load. The counterpart to `Alert tone="error"`, which ' +
          'is for a message *beside* content that is still there — this replaces the ' +
          'content.\n\n' +
          '`role="alert"`, so it is announced when it replaces a spinner, and the retry is ' +
          'a real button rather than the clickable div both products use. `error` accepts ' +
          'anything a `catch` or a query hook produces: a string, an `Error`, or the plain ' +
          '`{ message }` object axios throws.',
      },
    },
  },
  args: {
    error: new Error('dial tcp 10.0.4.2:8200: connect: connection refused'),
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { onRetry: () => {} },
  render: (args) => (
    <div className="w-[36rem]">
      <ErrorState {...args} />
    </div>
  ),
};

export const WithExtraAction: Story = {
  args: {
    title: 'Could not reach the cluster',
    onRetry: () => {},
    action: (
      <Button variant="ghost" size="sm">
        Choose another cluster
      </Button>
    ),
  },
  render: (args) => (
    <div className="w-[36rem]">
      <ErrorState {...args} />
    </div>
  ),
};

export const PlaygroundDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  args: Playground.args,
  render: Playground.render,
};
