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
import { TagInput } from './tag-input';

const meta = {
  title: 'Forms/TagInput',
  component: TagInput,
  parameters: {
    docs: {
      description: {
        component:
          'Free-text tokens, as chips. Backspace on an empty input removes the last chip, ' +
          'which is the behaviour everyone tries first, and blur commits the pending text — ' +
          'losing what you typed because you clicked "Save" instead of pressing Enter is ' +
          'the single most common complaint about this control. Comma commits too, because ' +
          'pasting a comma-separated list is how people enter several at once.',
      },
    },
  },
  args: { value: [], onValueChange: () => {} },
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function PlaygroundStory() {
    const [tags, setTags] = useState(['production', 'eu-west']);
    return (
      <div className="w-96">
        <Field label="Tags" description="Enter or comma to add.">
          <TagInput value={tags} onValueChange={setTags} />
        </Field>
      </div>
    );
  },
};

export const PlaygroundDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Playground.render,
};
