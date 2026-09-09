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

import { PLATFORM } from '@/test/app-fixtures';

import { AppFooter } from './app-footer';
import { BrandProvider } from './brand';
import { ThemeToggle } from './theme-toggle';

const meta = {
  title: 'App Frame/AppFooter',
  component: AppFooter,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The credit line and the theme switch. Reads `company` and `docsUrl` from ' +
          '`BrandProvider`, so this is another file with no product knowledge in it. Both ' +
          'fields are optional and the corresponding element is simply absent when they ' +
          'are — a footer reading "Powered by undefined" is the failure mode of doing this ' +
          'with props.\n\n' +
          'The docs link is named "Documentation", not "Docs": a link\'s accessible name ' +
          "should make sense read out of context, which is how a screen reader's link list " +
          'presents it.',
      },
    },
  },
} satisfies Meta<typeof AppFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <BrandProvider brand={PLATFORM}>
      <AppFooter actions={<ThemeToggle />} />
    </BrandProvider>
  ),
};

/** With no `company` or `docsUrl`, there is nothing to say and nothing is said. */
export const Bare: Story = {
  render: () => (
    <BrandProvider brand={{ name: 'Example Console' }}>
      <AppFooter actions={<ThemeToggle variant="button" />} />
    </BrandProvider>
  ),
};
