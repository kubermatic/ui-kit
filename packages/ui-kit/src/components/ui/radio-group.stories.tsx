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

import { Field } from './field';
import { RadioGroup, RadioGroupItem } from './radio-group';

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          'The label wraps the control, so the hit target is the whole row — a 16px dot on ' +
          "its own fails WCAG 2.2's 24px target-size minimum, which the axe run checks " +
          'with real layout geometry.',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="w-96">
      <Field label="Scope">
        <RadioGroup defaultValue="namespace" aria-label="Scope">
          <RadioGroupItem value="cluster">The whole cluster</RadioGroupItem>
          <RadioGroupItem value="namespace">One namespace</RadioGroupItem>
          <RadioGroupItem value="selector">Anything matching a selector</RadioGroupItem>
        </RadioGroup>
      </Field>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="yaml" orientation="horizontal" aria-label="Format">
      <RadioGroupItem value="yaml">YAML</RadioGroupItem>
      <RadioGroupItem value="json">JSON</RadioGroupItem>
    </RadioGroup>
  ),
};
