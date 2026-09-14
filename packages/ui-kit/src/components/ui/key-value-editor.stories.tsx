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

import { Field } from './field';
import { KeyValueEditor, type KeyValuePair } from './key-value-editor';

const meta = {
  title: 'Forms/KeyValueEditor',
  component: KeyValueEditor,
  parameters: {
    docs: {
      description: {
        component:
          'Rows of key/value inputs with add and remove — labels, annotations, config-map ' +
          'data, environment variables. Both products ship one of these and both had the ' +
          'same two bugs: the row key was the array index, so removing a row above the one ' +
          'you were typing in moved your cursor and your value; and the remove button was ' +
          'an icon with no accessible name, so a screen reader announced eleven identical ' +
          '"button"s.\n\n' +
          'Rows are deliberately **not** deduplicated: a duplicate key is a validation ' +
          "concern the consumer's schema owns, and silently dropping a row the user typed " +
          'is worse than showing them the conflict.',
      },
    },
  },
  args: { value: [], onValueChange: () => {} },
} satisfies Meta<typeof KeyValueEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function PlaygroundStory() {
    const [pairs, setPairs] = useState<KeyValuePair[]>([
      { key: 'app', value: 'billing' },
      { key: 'tier', value: 'backend' },
    ]);
    return (
      <div className="w-[32rem]">
        <Field label="Labels" description="Applied to the generated Secret.">
          <KeyValueEditor value={pairs} onValueChange={setPairs} />
        </Field>
      </div>
    );
  },
};

export const Empty: Story = {
  render: function EmptyStory() {
    const [pairs, setPairs] = useState<KeyValuePair[]>([]);
    return (
      <div className="w-[32rem]">
        <KeyValueEditor
          value={pairs}
          onValueChange={setPairs}
          emptyMessage="No labels yet."
          addLabel="Add label"
        />
      </div>
    );
  },
};

export const ReadOnly: Story = {
  args: {
    value: [{ key: 'app', value: 'billing' }],
    readOnly: true,
  },
  render: (args) => (
    <div className="w-[32rem]">
      <KeyValueEditor {...args} />
    </div>
  ),
};
