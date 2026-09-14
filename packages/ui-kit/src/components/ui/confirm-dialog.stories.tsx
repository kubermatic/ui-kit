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
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from './button';
import { ConfirmDialog } from './confirm-dialog';

const meta = {
  title: 'Overlays/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Base UI's **AlertDialog**, not `Dialog`: an alert dialog does not close on an " +
          'outside click or on Escape, and its role is `alertdialog`, so the description is ' +
          'announced immediately rather than only when focus reaches it. For "delete this ' +
          'cluster" that is the difference between a confirmation and a speed bump — ' +
          'A plain `ConfirmModal` dialog lets a stray backdrop click ' +
          'dismisses it, which trains people to click through.\n\n' +
          'The typed guard is *disabled-until-match* rather than validate-on-submit: ' +
          'leaving the confirm button enabled and then rejecting the click means the ' +
          'destructive action is one keystroke away from a mistyped name.',
      },
    },
  },
  args: {
    open: true,
    onOpenChange: () => {},
    onConfirm: () => {},
    title: 'Delete db-credentials?',
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    description: 'The Kubernetes Secret it manages will be deleted too.',
    confirmLabel: 'Delete',
    tone: 'destructive',
    confirmIcon: <Trash2 />,
  },
  render: function PlaygroundStory(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete
        </Button>
        <ConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

/** The "type the name to delete it" guard, for anything irreversible. */
export const WithTypedConfirmation: Story = {
  args: {
    title: 'Delete cluster prod-eu-1?',
    description: 'Every ExternalSecret reconciling against it will stop.',
    confirmLabel: 'Delete cluster',
    tone: 'destructive',
    verification: { value: 'prod-eu-1' },
  },
  render: function TypedStory(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete cluster
        </Button>
        <ConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

export const Busy: Story = {
  args: { confirmLabel: 'Deleting…', tone: 'destructive', busy: true },
  render: function BusyStory(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete
        </Button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};
