import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from './checkbox';
import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';
import { Textarea } from './textarea';

const meta = {
  title: 'Primitives/Form controls',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The unstyled building blocks. For RHF-bound fields see `form.tsx`. */
export const Playground: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="vm-name">Name</Label>
        <Input id="vm-name" placeholder="web-frontend-01" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="vm-invalid">Name</Label>
        <Input id="vm-invalid" defaultValue="Web Frontend" aria-invalid />
        <p className="text-error-foreground text-xs">
          Must be a valid RFC 1123 label.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="vm-notes">Cloud-init</Label>
        <Textarea id="vm-notes" rows={3} placeholder="#cloud-config" />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="vm-start" defaultChecked />
        <Label htmlFor="vm-start">Start after creation</Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="vm-migrate" />
        <Label htmlFor="vm-migrate">Allow live migration</Label>
      </div>

      <div className="grid gap-2 opacity-60">
        <Label htmlFor="vm-disabled">Namespace</Label>
        <Input id="vm-disabled" defaultValue="default" disabled />
      </div>
    </div>
  ),
};
