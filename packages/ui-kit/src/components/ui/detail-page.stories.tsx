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
import { RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from './button';
import { CodeBlock } from './code-block';
import { DescriptionItem, DescriptionList } from './description-list';
import { DetailPage } from './detail-page';
import { Section } from './page';
import { StatusBadge } from './status-badge';
import { Timeline, TimelineItem } from './timeline';

const MANIFEST = `apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: db-credentials
  namespace: billing
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore`;

const TABS = [
  {
    value: 'overview',
    label: 'Overview',
    content: (
      <Section title="Overview">
        <DescriptionList>
          <DescriptionItem term="Namespace">billing</DescriptionItem>
          <DescriptionItem term="Secret store">vault-backend</DescriptionItem>
          <DescriptionItem term="Refresh interval">1h</DescriptionItem>
          <DescriptionItem term="Keys">username, password</DescriptionItem>
        </DescriptionList>
      </Section>
    ),
  },
  {
    value: 'yaml',
    label: 'YAML',
    content: (
      <Section title="Manifest">
        <CodeBlock language="yaml">{MANIFEST}</CodeBlock>
      </Section>
    ),
  },
  {
    value: 'events',
    label: 'Events',
    content: (
      <Section title="Recent events">
        <Timeline>
          <TimelineItem tone="success" title="Synced" timestamp="2 minutes ago">
            2 keys written.
          </TimelineItem>
          <TimelineItem tone="warning" title="Retried" timestamp="18 minutes ago">
            Provider returned 429.
          </TimelineItem>
        </Timeline>
      </Section>
    ),
  },
];

const meta = {
  title: 'Templates/DetailPage',
  component: DetailPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One resource, with tabs — the other shape both products repeat: a back link, ' +
          'the resource name with its status beside it, a row of actions, and ' +
          'Overview / YAML / Events / Conditions tabs. One product extracted the tab bar ' +
          'alone into `DetailTabs` after noticing four byte-identical copies; this is the ' +
          'rest of the page around it, including the three states those pages each ' +
          're-implement.\n\n' +
          '`notFound` is deliberately a separate prop from `error`, because they need ' +
          'different affordances: a 404 on a detail page is a normal outcome — someone ' +
          'deleted it, or followed a stale link — and a retry button on a resource that has ' +
          'been deleted just fails again.\n\n' +
          'Tabs can be controlled, which is how the tab ends up in the URL. A detail page ' +
          'whose tab resets on reload loses your place every time you share a link.',
      },
    },
  },
  args: { title: 'db-credentials' },
} satisfies Meta<typeof DetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function PlaygroundStory() {
    const [tab, setTab] = useState('overview');
    return (
      <div className="p-6">
        <DetailPage
          back={{ label: 'Back to external secrets', href: '#external-secrets' }}
          title="db-credentials"
          description="Reconciled hourly from vault-backend."
          status={
            <StatusBadge tone="success" dot>
              Synced
            </StatusBadge>
          }
          actions={
            <>
              <Button variant="outline">
                <RefreshCw />
                Force sync
              </Button>
              <Button variant="destructive">
                <Trash2 />
                Delete
              </Button>
            </>
          }
          tabs={TABS}
          tab={tab}
          onTabChange={setTab}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  args: { loading: true, title: 'db-credentials' },
  render: (args) => (
    <div className="p-6">
      <DetailPage {...args} />
    </div>
  ),
};

export const Failed: Story = {
  args: {
    title: 'db-credentials',
    error: new Error('dial tcp 10.0.4.2:8200: connect: connection refused'),
    onRetry: () => {},
  },
  render: (args) => (
    <div className="p-6">
      <DetailPage {...args} />
    </div>
  ),
};

/** Deleted, or a stale link. A retry would just fail again, so there is none. */
export const NotFound: Story = {
  args: {
    title: 'db-credentials',
    notFound: true,
    back: { label: 'Back to external secrets', href: '#external-secrets' },
  },
  render: (args) => (
    <div className="p-6">
      <DetailPage {...args} />
    </div>
  ),
};

export const PlaygroundDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Playground.render,
};
