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
import { ArrowRight, Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const meta = {
  title: 'Foundations/Showcase',
  parameters: {
    docs: {
      description: {
        component:
          'The palette and the type hierarchy working together. Switch the ' +
          'theme in the toolbar — every colour here is a semantic role, so the ' +
          'dark variant needs no separate markup.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClusterCard: Story = {
  render: () => (
    <div className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Text variant="h1">Manage Kubernetes At Scale</Text>
        <Text variant="subline">One Control Plane, Every Cloud</Text>
        <Text variant="body" tone="muted">
          Ubuntu Bold for the headline, Roboto Bold for the subline, Roboto for this paragraph — and
          Cerulean on the call to action.
        </Text>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>
          Create Cluster
          <ArrowRight />
        </Button>
        <Button variant="outline">View Docs</Button>
      </div>

      <div className="bg-muted/60 space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-4">
          <Text variant="h3" as="h2">
            production-eu-01
          </Text>
          <Badge variant="accent">
            <Check />
            Running
          </Badge>
        </div>
        <Text variant="small" tone="muted">
          v1.31.2 · 6 nodes · Frankfurt
        </Text>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary">openstack</Badge>
          <Badge variant="honey">Upgrade Available</Badge>
          <Badge variant="rose">Beta</Badge>
        </div>
      </div>

      {/*
        No `bg-destructive/10` here, deliberately. An opacity tint composites to
        a colour outside the token set (#14192c on the dark palette), and
        Maroon-on-that measures 4.27:1 — the axe run caught exactly that. Solid
        roles only: the border carries the semantics, the text keeps a verified
        pair.
      */}
      <div className="border-destructive-tone space-y-1 rounded-lg border p-4">
        <Text variant="subline" tone="destructive" className="text-base">
          Quota Exceeded
        </Text>
        <Text variant="small">
          Maroon carries negatives and warnings — 10.14:1 on the light background and 4.64:1 on the
          dark one.
        </Text>
      </div>
    </div>
  ),
};

export const ClusterCardDark: Story = {
  globals: { theme: 'dark' },
  // Exists for axe coverage of the dark palette, not for the docs page.
  tags: ['!autodocs'],
  render: ClusterCard.render,
};
