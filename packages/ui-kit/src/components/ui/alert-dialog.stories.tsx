import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen } from 'storybook/test';
import { TriangleAlert } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import { Button } from './button';

const meta = {
  title: 'Primitives/Alert dialog',
  component: AlertDialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Differs from `Dialog` by being dismissal-resistant — no close affordance in
 * the corner, and clicking the backdrop does not get you out. That is the whole
 * reason it exists, so the story is the destructive confirmation it is for.
 */
export const Playground: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete web-frontend-01?</AlertDialogTitle>
          <AlertDialogDescription>
            The virtual machine and its data volumes are removed permanently.
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const Open: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete web-frontend-01?</AlertDialogTitle>
          <AlertDialogDescription>
            The virtual machine and its data volumes are removed permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async () => {
    await expect(
      screen.getByRole('alertdialog', { name: /delete web-frontend-01/i }),
    ).toBeInTheDocument();
  },
};

/**
 * `AlertDialogMedia` moves the header into a two-column grid at the default
 * size and stays stacked at `sm` — worth seeing, because the icon changes the
 * title's grid placement rather than just sitting above it.
 */
export const WithMedia: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <TriangleAlert />
          </AlertDialogMedia>
          <AlertDialogTitle>Detach csi-rbd volume?</AlertDialogTitle>
          <AlertDialogDescription>
            db-primary is running. Detaching a mounted volume can corrupt the
            filesystem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Detach</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * Two triggers rather than two open dialogs: a second `defaultOpen` would stack
 * a second backdrop over the first and neither size would be legible.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline">default</Button>}
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restart batch-worker-07?</AlertDialogTitle>
            <AlertDialogDescription>
              In-flight jobs on the node are lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Restart</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline">sm</Button>} />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Restart?</AlertDialogTitle>
            <AlertDialogDescription>
              batch-worker-07 will be unavailable briefly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Restart</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
};
