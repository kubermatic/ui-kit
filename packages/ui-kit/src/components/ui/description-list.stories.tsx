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

import { Code } from './code-block';
import { DescriptionItem, DescriptionList } from './description-list';
import { StatusBadge } from './status-badge';

const meta = {
  title: 'Data/DescriptionList',
  component: DescriptionList,
  parameters: {
    docs: {
      description: {
        component:
          'The metadata block on every detail page, as a real `<dl>`. Both products build ' +
          'this out of a two-column `<table>` or nested divs — a table asserts a ' +
          'relationship between *rows* that does not exist here, and divs assert nothing at ' +
          'all. The list element is what lets a screen reader move term-by-term and ' +
          'announce "Namespace, kube-system" as a pair.\n\n' +
          '`DescriptionItem` renders a bare `<dt>`/`<dd>` pair with no wrapper, so in the ' +
          'horizontal layout the terms are real grid items and line up down the column. ' +
          'A wrapper per pair is what forces people back to a table.',
      },
    },
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[36rem]">
      <DescriptionList>
        <DescriptionItem term="Name">db-credentials</DescriptionItem>
        <DescriptionItem term="Namespace">billing</DescriptionItem>
        <DescriptionItem term="Status">
          <StatusBadge tone="success" dot>
            Synced
          </StatusBadge>
        </DescriptionItem>
        <DescriptionItem term="Refresh interval">
          <Code>1h</Code>
        </DescriptionItem>
        <DescriptionItem term="Secret store">vault-backend</DescriptionItem>
      </DescriptionList>
    </div>
  ),
};

/** Stacked, for a narrow drawer or a sidebar panel. */
export const Stacked: Story = {
  render: () => (
    <div className="w-64">
      <DescriptionList orientation="stacked">
        <DescriptionItem term="Name">db-credentials</DescriptionItem>
        <DescriptionItem term="Namespace">billing</DescriptionItem>
        <DescriptionItem term="Token" truncate>
          eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.very.long
        </DescriptionItem>
      </DescriptionList>
    </div>
  ),
};

export const HorizontalDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Horizontal.render,
};
