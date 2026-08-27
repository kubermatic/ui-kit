/*
 * Copyright 2026 The Kubermatic ui-kit Authors.
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

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen } from 'storybook/test';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from './combobox';
import { Label } from './label';

const STORAGE_CLASSES = [
  'csi-rbd',
  'csi-cephfs',
  'local-path',
  'ceph-rbd',
] as const;

const NODES = [
  'worker-01',
  'worker-02',
  'worker-03',
  'worker-04',
  'worker-05',
] as const;

const meta = {
  title: 'Primitives/Combobox',
  component: Combobox,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The unstyled parts. For the option shape these dashboards actually use —
 * groups, hints, and the select-on-focus behaviour that keeps typing from
 * appending to the selected label — see `Primitives/Form combobox`, which wraps
 * these same parts.
 *
 * Unlike `Select`, the trigger is a text input: the list filters as you type.
 */
export const Playground: Story = {
  render: function SingleSelect() {
    const container = React.useRef<HTMLDivElement>(null);

    return (
      <div className="grid w-72 gap-2">
        <Label htmlFor="combobox-storage-class">Storage class</Label>
        <div ref={container} className="relative">
          <Combobox items={[...STORAGE_CLASSES]}>
            <ComboboxInput
              id="combobox-storage-class"
              placeholder="Select storage class"
              className="w-full"
            />
            <ComboboxContent container={container}>
              <ComboboxEmpty>No storage classes found.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    <span className="truncate">{item}</span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
    );
  },
};

export const Open: Story = {
  render: function OpenList() {
    const container = React.useRef<HTMLDivElement>(null);

    return (
      <div ref={container} className="relative w-72">
        <Combobox items={[...STORAGE_CLASSES]} defaultOpen>
          <ComboboxInput
            placeholder="Select storage class"
            className="w-full"
          />
          <ComboboxContent container={container}>
            <ComboboxEmpty>No storage classes found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  <span className="truncate">{item}</span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    );
  },
  play: async () => {
    // `screen`, not `canvas` — the popup portals outside the story root.
    await expect(
      await screen.findByRole('option', { name: 'csi-cephfs' }),
    ).toBeInTheDocument();
  },
};

/**
 * `multiple` swaps the single input for a chip field. The design question this
 * story exists to answer is what happens as the selection grows — the chips
 * wrap and the field grows with them rather than scrolling horizontally.
 */
export const Multiple: Story = {
  render: function MultiSelect() {
    const anchor = useComboboxAnchor();
    const container = React.useRef<HTMLDivElement>(null);
    const [value, setValue] = React.useState<string[]>([
      'worker-01',
      'worker-03',
    ]);

    return (
      <div ref={container} className="relative w-72">
        <Combobox
          multiple
          autoHighlight
          items={[...NODES]}
          value={value}
          onValueChange={setValue}
        >
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {value.map((node) => (
                <ComboboxChip key={node}>{node}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                aria-label="Select nodes"
                placeholder={value.length === 0 ? 'Select nodes' : undefined}
              />
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor} container={container}>
            <ComboboxEmpty>No nodes found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  <span className="truncate">{item}</span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    );
  },
};

/** Every node already selected — the overflow case, at five chips. */
export const MultipleOverflow: Story = {
  render: function MultiSelectFull() {
    const anchor = useComboboxAnchor();
    const container = React.useRef<HTMLDivElement>(null);
    const [value, setValue] = React.useState<string[]>([...NODES]);

    return (
      <div ref={container} className="relative w-72">
        <Combobox
          multiple
          items={[...NODES]}
          value={value}
          onValueChange={setValue}
        >
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {value.map((node) => (
                <ComboboxChip key={node}>{node}</ComboboxChip>
              ))}
              <ComboboxChipsInput aria-label="Select nodes" />
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor} container={container}>
            <ComboboxEmpty>No nodes found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  <span className="truncate">{item}</span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    );
  },
};

/** `ComboboxEmpty` only renders once the list has filtered down to nothing. */
export const NoResults: Story = {
  render: function EmptyList() {
    const container = React.useRef<HTMLDivElement>(null);

    return (
      <div ref={container} className="relative w-72">
        <Combobox items={[] as string[]} defaultOpen>
          <ComboboxInput
            placeholder="Select storage class"
            className="w-full"
          />
          <ComboboxContent container={container}>
            <ComboboxEmpty>No storage classes found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  <span className="truncate">{item}</span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    );
  },
};
