import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen } from 'storybook/test';

import { Button } from './button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'Primitives/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `DialogTrigger` and `DialogClose` adopt a `Button` through Base UI's `render`
 * prop — there is no `asChild` in this kit.
 */
export const Playground: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline">Attach volume</Button>}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach data volume</DialogTitle>
          <DialogDescription>
            The volume is hot-plugged into web-frontend-01 and stays attached
            across restarts.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Attach</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Open by default so the surface is actually reviewable: the popup portals to
 * `document.body`, so a closed trigger gives the theme toggle and the a11y
 * panel nothing to inspect.
 */
export const Open: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach data volume</DialogTitle>
          <DialogDescription>Storage class csi-rbd.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Attach</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async () => {
    // `screen`, not `canvas` — the popup is portalled outside the story root.
    await expect(
      screen.getByRole('dialog', { name: /attach data volume/i }),
    ).toBeInTheDocument();
  },
};

/** The shape most dashboard dialogs take: a short form over a footer. */
export const WithForm: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create virtual machine</DialogTitle>
          <DialogDescription>
            Deployed into namespace default.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="dialog-vm-name">Name</Label>
            <Input id="dialog-vm-name" defaultValue="batch-worker-07" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dialog-vm-image">Image</Label>
            <Input id="dialog-vm-image" defaultValue="Ubuntu 24.04" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * `DialogFooter` can supply its own close button instead of one being composed
 * in, which suits a dialog with nothing to confirm.
 */
export const FooterCloseButton: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Migration complete</DialogTitle>
          <DialogDescription>
            web-frontend-01 now runs on worker-05.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
};
