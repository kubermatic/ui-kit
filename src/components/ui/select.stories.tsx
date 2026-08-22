import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen } from 'storybook/test';

import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

/*
 * `items` is what lets `<SelectValue>` render a label instead of the raw value.
 * Without it the trigger would show `csi-rbd` even when the list renders a
 * friendlier string, which is the usual reason a Select looks half-wired.
 */
const STORAGE_CLASSES: Record<string, string> = {
  'csi-rbd': 'csi-rbd (block, default)',
  'csi-cephfs': 'csi-cephfs (shared filesystem)',
  'local-path': 'local-path (node-local)',
};

const meta = {
  title: 'Primitives/Select',
  component: Select,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Visually close to `Combobox`, but deliberately not filterable — there is no
 * text input, only a listbox. Reach for `Combobox` once the option count stops
 * fitting on a screen.
 */
export const Playground: Story = {
  render: () => (
    <div className="grid w-64 gap-2">
      <Label htmlFor="select-storage-class">Storage class</Label>
      <Select items={STORAGE_CLASSES}>
        <SelectTrigger id="select-storage-class" className="w-full">
          <SelectValue placeholder="Select a storage class" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STORAGE_CLASSES).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Open: Story = {
  render: () => (
    <Select items={STORAGE_CLASSES} defaultValue="csi-rbd" defaultOpen>
      <SelectTrigger className="w-64" aria-label="Storage class">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STORAGE_CLASSES).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
  play: async () => {
    const listbox = await screen.findByRole('listbox');
    await expect(listbox).toBeInTheDocument();
    await expect(
      screen.getByRole('option', { name: /csi-cephfs/i }),
    ).toBeInTheDocument();
  },
};

/**
 * Grouped options — the shape a node picker takes.
 *
 * No `SelectSeparator` between the groups, deliberately. The popup's list is a
 * `role="listbox"`, which ARIA allows to contain only options and groups, so a
 * `role="separator"` child makes the whole listbox invalid
 * (`aria-required-children`) and axe fails the story. `SelectLabel` already
 * gives each group a visible boundary, which is what the separator was for.
 *
 * `SelectSeparator` is still exported for menus and other non-listbox popups —
 * it is the combination with a listbox that is wrong, not the component.
 */
export const Groups: Story = {
  render: () => (
    <Select defaultOpen>
      <SelectTrigger className="w-64" aria-label="Node">
        <SelectValue placeholder="Select a node" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Control plane</SelectLabel>
          <SelectItem value="control-plane-01">control-plane-01</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Workers</SelectLabel>
          <SelectItem value="worker-01">worker-01</SelectItem>
          <SelectItem value="worker-02">worker-02</SelectItem>
          <SelectItem value="worker-03">worker-03</SelectItem>
          <SelectItem value="worker-04" disabled>
            worker-04 (cordoned)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

/** `size` changes the trigger height only; the popup is unaffected. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(['sm', 'default'] as const).map((size) => (
        <Select key={size} items={STORAGE_CLASSES} defaultValue="csi-rbd">
          <SelectTrigger size={size} className="w-56" aria-label={size}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STORAGE_CLASSES).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Select items={STORAGE_CLASSES} defaultValue="csi-rbd" disabled>
        <SelectTrigger className="w-64" aria-label="Storage class (disabled)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STORAGE_CLASSES).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select items={STORAGE_CLASSES}>
        <SelectTrigger
          className="w-64"
          aria-invalid
          aria-label="Storage class (invalid)"
        >
          <SelectValue placeholder="Required" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STORAGE_CLASSES).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};
