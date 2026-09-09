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

import { Skeleton, SkeletonText } from './skeleton';

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder, painted with the `muted` role so it works in both ' +
          'palettes. It announces nothing on its own: a page full of skeletons would ' +
          'report a dozen busy regions, so put one `aria-busy` on the area that is ' +
          'loading instead — which is what the templates in this kit do.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Skeleton className="h-6 w-48" />,
};

/** The short last line is what makes it read as a paragraph. */
export const Text: Story = {
  render: () => <SkeletonText lines={4} className="w-96" />,
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="w-96 rounded-lg border border-border p-6">
      <Skeleton className="mb-4 h-5 w-1/3" />
      <SkeletonText lines={3} />
    </div>
  ),
};

export const CardPlaceholderDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: CardPlaceholder.render,
};
