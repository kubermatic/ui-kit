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

import { CopyButton } from './copy-button';

const meta = {
  title: 'Primitives/CopyButton',
  component: CopyButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Copies a value and confirms it — in a live region as well as by swapping the ' +
          'icon, because the icon alone tells a screen-reader user nothing. It stays ' +
          'enabled afterwards, so the same value can be copied twice, and it reports the ' +
          'failure when `navigator.clipboard` is missing (which it is on every insecure ' +
          'origin, i.e. every port-forward).',
      },
    },
  },
  args: { value: 'kubectl get secrets -n billing', label: 'Copy command' },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconOnly: Story = {};

/** With visible text, for a place where an icon alone is too subtle. */
export const WithLabel: Story = {
  args: { children: 'Copy kubeconfig', variant: 'outline' },
};
