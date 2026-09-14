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

import { Button } from './button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Field } from './field';
import { Input } from './input';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Base UI owns the parts that are easy to get wrong and impossible to notice in ' +
          'manual testing: the focus trap, restoring focus to the trigger on close, ' +
          '`aria-modal`, and marking the rest of the page inert so a screen reader cannot ' +
          'wander out of the dialog while it is open.\n\n' +
          '`DialogTitle` and `DialogDescription` are not decoration — they are what ' +
          '`aria-labelledby` and `aria-describedby` point at, wired automatically by being ' +
          'inside the popup. A dialog rendered without a `DialogTitle` is announced as ' +
          '"dialog" and nothing else, which is the state of several existing ones.\n\n' +
          'For a confirmation, use `ConfirmDialog`: it is an *alert* dialog, which does not ' +
          'close on an outside click.',
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>New external secret</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New external secret</DialogTitle>
          <DialogDescription>It will be created in the namespace selected above.</DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4 py-2">
          <Field label="Name" required>
            <Input placeholder="db-credentials" required />
          </Field>
          <Field label="Remote key" description="The path in the provider.">
            <Input placeholder="secret/data/billing/db" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** `size="full"` is for an editor or a graph — the cases that want the full screen. */
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger render={<Button variant="outline">{size}</Button>} />
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size: {size}</DialogTitle>
              <DialogDescription>The width steps up with the content.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Close</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};
