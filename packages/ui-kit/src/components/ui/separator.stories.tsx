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

import { Separator } from './separator';

const meta = {
  title: 'Primitives/Separator',
  component: Separator,
  parameters: {
    docs: {
      description: {
        component:
          'A divider that is announced. Base UI gives it `role="separator"` and its ' +
          'orientation, which is the difference between a divider a screen reader can use ' +
          'to understand the grouping and a `<div>` with a border.',
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-80 font-sans text-sm">
      <p className="pb-3">External Secrets</p>
      <Separator />
      <p className="pt-3">Secret Stores</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-3 font-sans text-sm">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>API</span>
      <Separator orientation="vertical" />
      <span>Support</span>
    </div>
  ),
};
