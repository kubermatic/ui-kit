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
import type { VariantProps } from 'class-variance-authority';

import { variantKeys } from '@/test/variant-matrix';

import type { avatarVariants } from './avatar';
import { Avatar } from './avatar';

type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>;

const SIZES = variantKeys<AvatarSize>({ sm: true, default: true, lg: true });

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A person, with an initials fallback shown while the image loads and if it ' +
          'errors. The whole thing is `aria-hidden`, because an avatar beside a name is ' +
          'decoration — announcing "AL, Ada Lovelace" reads the same person twice. Label ' +
          'it at the call site if it appears without the name.',
      },
    },
  },
  args: { name: 'Ada Lovelace' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      {SIZES.map((size) => (
        <Avatar key={size} size={size} name="Ada Lovelace" />
      ))}
    </div>
  ),
};

/**
 * An email address has no spaces, so it yields one initial — which is the
 * right answer, since the alternative is inventing a surname from the domain.
 */
export const FromAnEmailAddress: Story = {
  args: { name: 'ada@example.com' },
};
