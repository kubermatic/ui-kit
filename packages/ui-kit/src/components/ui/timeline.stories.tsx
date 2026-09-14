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

import { Timeline, TimelineItem } from './timeline';

const meta = {
  title: 'Data/Timeline',
  component: Timeline,
  parameters: {
    docs: {
      description: {
        component:
          "A chronological list of events — a sync history, both products' " +
          'Kubernetes event lists. An `<ol>`, because the order is the content: reversed ' +
          'chronology is a claim about the data, and a `<ul>` does not make it.\n\n' +
          'The connecting line is drawn per item rather than as a rail on the container, ' +
          "so an item of any height connects to the next one and the last item's line " +
          'stops rather than dangling.',
      },
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="w-[32rem]">
      <Timeline>
        <TimelineItem tone="success" title="Synced" timestamp="2 minutes ago">
          2 keys written to <span className="font-mono">billing/db-credentials</span>.
        </TimelineItem>
        <TimelineItem tone="warning" title="Retried" timestamp="18 minutes ago">
          Provider returned 429; backing off for 30s.
        </TimelineItem>
        <TimelineItem tone="error" title="Sync failed" timestamp="1 hour ago">
          dial tcp 10.0.4.2:8200: connect: connection refused
        </TimelineItem>
        <TimelineItem tone="neutral" title="Created" timestamp="3 days ago" />
      </Timeline>
    </div>
  ),
};

export const PlaygroundDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Playground.render,
};
