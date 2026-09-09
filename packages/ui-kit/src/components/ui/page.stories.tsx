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
import { Plus, RefreshCw } from 'lucide-react';

import { Button } from './button';
import { CodeBlock } from './code-block';
import { DescriptionItem, DescriptionList } from './description-list';
import { Page, PageContent, PageHeader, PageToolbar, Section } from './page';
import { FilterSelect } from './select';
import { StatusBadge } from './status-badge';

const meta = {
  title: 'Templates/Page',
  component: Page,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The vertical rhythm of a route. Both products set the gap between the title ' +
          'block, the toolbar and the content by hand on every page, so no two pages ' +
          'agree — this is the one place it is decided.\n\n' +
          '`PageHeader` renders the title as an `<h1>` and there should be exactly one per ' +
          'route. Both products currently emit either none — the page title is a `<div>` ' +
          'with large text — or several, because each card title is also an `<h2>` under no ' +
          '`<h1>`. Either way the outline a screen-reader user navigates by is unusable.\n\n' +
          '`Section` is the `<Card title subtitle actions>` shape under a name that ' +
          'says what it is. It emits a real heading and a `<section>` labelled by it, which ' +
          'makes it a region a screen reader can list and jump between — how you skim a ' +
          'detail page with six panels on it.',
      },
    },
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="p-6">
      <Page>
        <PageHeader
          breadcrumbs={[{ label: 'Secrets', href: '#secrets' }, { label: 'External Secrets' }]}
          title="External Secrets"
          description="Reconciled from a provider into a Kubernetes Secret."
          status={
            <StatusBadge tone="success" dot>
              Reconciling
            </StatusBadge>
          }
          actions={
            <>
              <Button variant="outline">
                <RefreshCw />
                Sync all
              </Button>
              <Button>
                <Plus />
                New external secret
              </Button>
            </>
          }
        />
        <PageToolbar>
          <FilterSelect
            label="Status"
            value="All"
            onValueChange={() => {}}
            options={['All', 'Synced']}
          />
          <FilterSelect
            label="Namespace"
            value="billing"
            onValueChange={() => {}}
            options={['billing', 'ingress']}
          />
        </PageToolbar>
        <PageContent>
          <Section title="Overview" description="What this resource is doing right now.">
            <DescriptionList>
              <DescriptionItem term="Secret store">vault-backend</DescriptionItem>
              <DescriptionItem term="Refresh interval">1h</DescriptionItem>
              <DescriptionItem term="Keys">2</DescriptionItem>
            </DescriptionList>
          </Section>
          <Section
            title="Manifest"
            actions={
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            }
          >
            <CodeBlock language="yaml">
              {'apiVersion: external-secrets.io/v1\nkind: ExternalSecret'}
            </CodeBlock>
          </Section>
        </PageContent>
      </Page>
    </div>
  ),
};

/** `plain` drops the card surface but keeps the heading and the region. */
export const PlainSections: Story = {
  render: () => (
    <div className="p-6">
      <Page>
        <PageHeader title="Settings" as="h1" />
        <PageContent>
          <Section title="General" description="Applies to the whole organization." plain>
            <p className="font-sans text-sm text-muted-foreground">Nothing to configure yet.</p>
          </Section>
          <Section title="Danger zone" as="h2" plain>
            <Button variant="destructive" size="sm">
              Delete organization
            </Button>
          </Section>
        </PageContent>
      </Page>
    </div>
  ),
};

export const PlaygroundDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Playground.render,
};
