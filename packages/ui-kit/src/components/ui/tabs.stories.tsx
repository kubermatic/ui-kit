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

import { Tabs, TabsList, TabsPanel, TabsTab } from './tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          "The detail-page section switcher. One product's `DetailTabs` is a row of " +
          '`<button>`s with an `onChange`, which gives no `role="tablist"`, no arrow-key ' +
          'movement between tabs, and no `aria-controls` linking a tab to its panel — so a ' +
          'screen reader announces four unrelated buttons and the panel below them is not ' +
          'connected to any of them.\n\n' +
          'Base UI activates on Enter rather than on arrow-key focus. That is the right ' +
          'default for tabs whose panels cost something to render: automatic activation ' +
          "would fetch every tab's data on the way past it.\n\n" +
          'Two visual variants, because both products have both: `underline` for page-level ' +
          'sections, `pill` for a segmented switch inside a panel.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = {
  render: () => (
    <div className="w-[36rem]">
      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList>
          <TabsTab value="overview">Overview</TabsTab>
          <TabsTab value="yaml">YAML</TabsTab>
          <TabsTab value="events">Events</TabsTab>
          <TabsTab value="conditions">Conditions</TabsTab>
        </TabsList>
        <TabsPanel value="overview" className="font-sans text-sm text-muted-foreground">
          Two keys, refreshed hourly from vault-backend.
        </TabsPanel>
        <TabsPanel value="yaml" className="font-sans text-sm text-muted-foreground">
          The rendered manifest.
        </TabsPanel>
        <TabsPanel value="events" className="font-sans text-sm text-muted-foreground">
          Recent Kubernetes events.
        </TabsPanel>
        <TabsPanel value="conditions" className="font-sans text-sm text-muted-foreground">
          Status conditions reported by the controller.
        </TabsPanel>
      </Tabs>
    </div>
  ),
};

export const Pill: Story = {
  render: () => (
    <Tabs defaultValue="form" className="flex flex-col gap-4">
      <TabsList variant="pill">
        <TabsTab value="form" variant="pill">
          Form
        </TabsTab>
        <TabsTab value="yaml" variant="pill">
          YAML
        </TabsTab>
      </TabsList>
      <TabsPanel value="form" className="font-sans text-sm text-muted-foreground">
        A generated form.
      </TabsPanel>
      <TabsPanel value="yaml" className="font-sans text-sm text-muted-foreground">
        The raw manifest.
      </TabsPanel>
    </Tabs>
  ),
};

export const UnderlineDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Underline.render,
};
