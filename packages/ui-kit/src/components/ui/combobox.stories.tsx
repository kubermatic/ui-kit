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
import { Server } from 'lucide-react';
import { useState } from 'react';

import { Combobox } from './combobox';
import { StatusDot } from './status-badge';

const CLUSTERS = ['prod-eu-1', 'prod-us-1', 'staging', 'dev-sandbox'];

const STATUS: Record<string, 'success' | 'error' | 'neutral'> = {
  'prod-eu-1': 'success',
  'prod-us-1': 'success',
  staging: 'error',
  'dev-sandbox': 'neutral',
};

const meta = {
  title: 'Forms/Combobox',
  component: Combobox,
  parameters: {
    docs: {
      description: {
        component:
          'A searchable single-select. Configured rather than exposed as parts, unlike ' +
          '`Select`: the compound form is twenty-odd parts and every use across both ' +
          'products is the same shape — type to filter a flat list of names, pick one.\n\n' +
          'Filtering is Base UI\'s, which matches with `Intl.Collator` — so "uber" finds ' +
          '"über" and the comparison is not a `toLowerCase().includes()` that gets accents ' +
          'and Turkish dotless i wrong.',
      },
    },
  },
  args: { options: CLUSTERS, value: null, onValueChange: () => {} },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function PlaygroundStory() {
    const [value, setValue] = useState<string | null>('staging');
    return (
      <div className="w-72">
        <Combobox
          options={CLUSTERS}
          value={value}
          onValueChange={setValue}
          clearable
          aria-label="Cluster"
        />
      </div>
    );
  },
};

/**
 * `renderItem` decorates the list without changing what the input displays —
 * which is exactly what a cluster picker needs.
 */
export const WithStatus: Story = {
  render: function WithStatusStory() {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div className="w-72">
        <Combobox
          options={CLUSTERS}
          value={value}
          onValueChange={setValue}
          placeholder="All clusters"
          aria-label="Cluster"
          startAdornment={<Server />}
          renderItem={(item) => (
            <>
              <span className="truncate">{item.label}</span>
              <StatusDot
                tone={STATUS[item.value] ?? 'neutral'}
                label={STATUS[item.value] === 'success' ? 'Connected' : 'Disconnected'}
                className="ml-auto"
              />
            </>
          )}
        />
      </div>
    );
  },
};

export const WithStatusDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: WithStatus.render,
};
