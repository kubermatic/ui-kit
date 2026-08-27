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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import { Toaster, toast, type ToastType } from './toast';
import { variantKeys } from '@/test/variant-matrix';

/*
 * `variantKeys<ToastType>` fails typecheck the moment a level is added to the
 * component without being added here, which is what keeps the matrix below from
 * quietly falling behind the cva config.
 */
const TYPES = variantKeys<ToastType>({
  default: true,
  success: true,
  info: true,
  warning: true,
  error: true,
  loading: true,
});

const meta = {
  title: 'Primitives/Toast',
  component: Toaster,
  parameters: { layout: 'centered' },
  decorators: [
    /*
     * The Toaster mounts once per story. Unlike the sonner wrapper this
     * replaced, it takes no `theme` prop — toasts render from the same tokens
     * as every other primitive and follow the `.dark` class the preview
     * decorator toggles, so the toolbar works without any wiring here.
     */
    (Story) => (
      <>
        <Toaster />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every level. The surface stays neutral throughout — the left border and the
 * icon carry the level, so the body text keeps a contrast pairing the token set
 * already proves at AA.
 */
export const Playground: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {TYPES.map((type) => (
        <Button
          key={type}
          variant="outline"
          onClick={() =>
            type === 'default'
              ? toast(`Snapshot scheduled for web-frontend-01`)
              : toast[type](`Toast level: ${type}`)
          }
        >
          {type}
        </Button>
      ))}
    </div>
  ),
};

/** Description and action — the shape a recoverable failure takes. */
export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.error('Failed to attach data volume', {
          description: 'quota exceeded in namespace default',
          actionProps: { children: 'Retry', onClick: () => {} },
        })
      }
    >
      With action
    </Button>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: /with action/i }));

    // The viewport portals out of the canvas, so query the document instead.
    const body = within(canvasElement.ownerDocument.body);

    await waitFor(async () => {
      await expect(
        body.getByText('Failed to attach data volume'),
      ).toBeInTheDocument();
    });
    await expect(
      body.getByText('quota exceeded in namespace default'),
    ).toBeInTheDocument();
    await expect(
      body.getByRole('button', { name: 'Retry' }),
    ).toBeInTheDocument();
  },
};

/**
 * Dismissal.
 *
 * Base UI keeps the close button `aria-hidden` until the viewport is expanded —
 * hovered or focused — because a screen reader is told about the toast through
 * the live region and should not also meet a stray button for every one still
 * on screen. So the test hovers first, which is what a mouse user does anyway,
 * and only then is the control in the accessibility tree to be found by name.
 *
 * Worth asserting because the alternative reading of that behaviour is "the
 * close button has no accessible name", which would be a real defect.
 */
export const Dismiss: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.success('Snapshot created')}>
      Show toast
    </Button>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: /show toast/i }));

    // The viewport portals out of the canvas, so query the document instead.
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);

    await waitFor(async () => {
      await expect(body.getByText('Snapshot created')).toBeInTheDocument();
    });

    /*
     * Hover the toast, not the viewport: the viewport spans a fixed region the
     * user has to be able to click through, so it is `pointer-events: none` and
     * only the toasts inside it are interactive. Moving onto the toast is what
     * expands the stack, and it is what a real user does.
     */
    const item = doc.querySelector<HTMLElement>('[data-slot="toast"]');
    await expect(item).not.toBeNull();
    await userEvent.hover(item!);

    const close = await waitFor(() =>
      body.getByRole('button', { name: 'Close notification' }),
    );
    await userEvent.click(close);

    await waitFor(async () => {
      await expect(
        body.queryByText('Snapshot created'),
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * `toast.promise` swaps loading for success on settle, which is the only path
 * that exercises the spinner. Loading toasts never auto-dismiss — Base UI skips
 * the timer for that type — so the swap is what ends them.
 */
export const Promise: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(
          /*
           * `globalThis.Promise`, because this module exports a story named
           * `Promise` and the bare identifier resolves to that instead.
           */
          new globalThis.Promise((resolve) => setTimeout(resolve, 600)),
          {
            loading: 'Creating snapshot of db-primary…',
            success: 'Snapshot db-primary-20260827 created',
            error: 'Snapshot failed',
          },
        )
      }
    >
      Create snapshot
    </Button>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: /create snapshot/i }),
    );

    const body = within(canvasElement.ownerDocument.body);
    await waitFor(async () => {
      await expect(
        body.getByText('Creating snapshot of db-primary…'),
      ).toBeInTheDocument();
    });

    await waitFor(
      async () => {
        await expect(
          body.getByText('Snapshot db-primary-20260827 created'),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  },
};
