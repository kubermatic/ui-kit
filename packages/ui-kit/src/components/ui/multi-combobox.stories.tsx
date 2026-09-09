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
import { useState } from 'react';

import { MultiCombobox } from './combobox';
import { Field } from './field';
import { StatusDot } from './status-badge';

const NAMESPACES = ['backend', 'payments', 'ingress', 'data-pipeline', 'auth', 'monitoring'];

const meta = {
  title: 'Forms/MultiCombobox',
  component: MultiCombobox,
  parameters: {
    docs: {
      description: {
        component:
          'A searchable multi-select. The same Base UI primitive as `Combobox` wearing a ' +
          'different control: `multiple` mode, with the selection shown as chips inside ' +
          "the field.\n\nThe chips are Base UI's `Chip`/`ChipRemove` parts, so arrow keys " +
          'move between them and Backspace removes the last — the thing a `<span>` with an ' +
          'X icon cannot do.',
      },
    },
  },
  args: { options: NAMESPACES, value: [], onValueChange: () => {} },
} satisfies Meta<typeof MultiCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function PlaygroundStory() {
    const [value, setValue] = useState<string[]>(['backend', 'payments']);
    return (
      <div className="w-96">
        <MultiCombobox
          options={NAMESPACES}
          value={value}
          onValueChange={setValue}
          placeholder="Select namespaces…"
          aria-label="Namespaces"
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: function EmptyStory() {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="w-96">
        <MultiCombobox
          options={NAMESPACES}
          value={value}
          onValueChange={setValue}
          placeholder="Select namespaces…"
          aria-label="Namespaces"
        />
      </div>
    );
  },
};

/** Inside a `Field`, the label is wired to the input and no `aria-label` is needed. */
export const InAField: Story = {
  render: function InAFieldStory() {
    const [value, setValue] = useState<string[]>(['backend']);
    return (
      <div className="w-96">
        <Field label="Target namespaces" description="Where the operator will be active." required>
          <MultiCombobox
            options={NAMESPACES}
            value={value}
            onValueChange={setValue}
            placeholder="Select namespaces…"
          />
        </Field>
      </div>
    );
  },
};

/** `renderItem` decorates the list rows; the chips keep using `label`. */
export const WithStatus: Story = {
  render: function WithStatusStory() {
    const [value, setValue] = useState<string[]>(['payments']);
    return (
      <div className="w-96">
        <MultiCombobox
          options={NAMESPACES}
          value={value}
          onValueChange={setValue}
          placeholder="Select namespaces…"
          aria-label="Namespaces"
          renderItem={(item) => (
            <>
              {item.label}
              <StatusDot
                tone={item.value === 'ingress' ? 'error' : 'success'}
                label={item.value === 'ingress' ? 'unreachable' : 'healthy'}
              />
            </>
          )}
        />
      </div>
    );
  },
};
