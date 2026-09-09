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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from './button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

/*
 * Opened from the keyboard: Base UI opens on `pointerdown` and jsdom has no
 * PointerEvent, so a synthetic click never reaches it. Enter on the focused
 * trigger is the keyboard path anyway.
 */
async function open(name: string) {
  screen.getByRole('button', { name }).focus();
  await userEvent.keyboard('{Enter}');
}

const setup = () =>
  render(
    <Dialog>
      <DialogTrigger render={<Button>Create secret</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New secret</DialogTitle>
          <DialogDescription>Secrets are namespaced.</DialogDescription>
        </DialogHeader>
        <DialogBody>body</DialogBody>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
  );

describe('Dialog', () => {
  it('is closed until the trigger is used', async () => {
    setup();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await open('Create secret');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  /*
   * `DialogTitle` and `DialogDescription` are what `aria-labelledby` and
   * `aria-describedby` point at. A dialog without a title is announced as
   * "dialog" and nothing else, which is the state of several existing ones.
   */
  it('is named and described by its own parts', async () => {
    setup();
    await open('Create secret');

    const dialog = screen.getByRole('dialog', { name: 'New secret' });
    expect(dialog).toHaveAccessibleDescription('Secrets are namespaced.');
  });

  it('closes on Escape', async () => {
    setup();
    await open('Create secret');

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('offers a named close button', async () => {
    setup();
    await open('Create secret');

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('can omit the close button', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent showClose={false}>
          <DialogTitle>Busy</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });
});
