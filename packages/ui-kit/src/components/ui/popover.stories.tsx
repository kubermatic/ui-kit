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
import { Filter } from 'lucide-react';

import { Button } from './button';
import { Field } from './field';
import { Input } from './input';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from './popover';

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An anchored panel with interactive content. Distinct from `Tooltip`, which is a ' +
          'description and cannot hold anything focusable, and from `Menu`, which is a list ' +
          'of commands with arrow-key navigation. This is the one that holds a form — ' +
          'An organisation selector and a metadata filter are both popovers.',
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline">
            <Filter />
            Filter by label
          </Button>
        }
      />
      <PopoverContent align="start" className="w-80">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <PopoverTitle>Filter by label</PopoverTitle>
            <PopoverDescription>Matches are combined with AND.</PopoverDescription>
          </div>
          <Field label="Key">
            <Input placeholder="app" />
          </Field>
          <Field label="Value">
            <Input placeholder="billing" />
          </Field>
          <div className="flex justify-end gap-2">
            <PopoverClose
              render={
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              }
            />
            <Button size="sm">Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
