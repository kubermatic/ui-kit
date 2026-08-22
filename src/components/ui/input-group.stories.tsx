import type { Meta, StoryObj } from '@storybook/react-vite';
import type { VariantProps } from 'class-variance-authority';
import { expect } from 'storybook/test';
import { Copy, Search, TerminalIcon } from 'lucide-react';

import { variantKeys } from '@/test/variant-matrix';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  inputGroupAddonVariants,
  inputGroupButtonVariants,
} from './input-group';
import { Label } from './label';

type Align = NonNullable<VariantProps<typeof inputGroupAddonVariants>['align']>;
type ButtonSize = NonNullable<
  VariantProps<typeof inputGroupButtonVariants>['size']
>;

const ALIGNMENTS = variantKeys<Align>({
  'inline-start': true,
  'inline-end': true,
  'block-start': true,
  'block-end': true,
});

const BUTTON_SIZES = variantKeys<ButtonSize>({
  xs: true,
  sm: true,
  'icon-xs': true,
  'icon-sm': true,
});

const meta = {
  title: 'Primitives/Input group',
  component: InputGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="input-group-search">Filter</Label>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          id="input-group-search"
          placeholder="web-frontend-01"
        />
      </InputGroup>
    </div>
  ),
};

/**
 * Every alignment, because the variants live in a `data-align` attribute on the
 * *children* and the layout is driven almost entirely by `has-[]` selectors on
 * the group. A story showing one alignment leaves three CSS branches untested —
 * the block ones in particular switch the group to `flex-col` and change its
 * height, which no prop on the group itself reveals.
 */
export const Alignments: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      {ALIGNMENTS.map((align) => (
        <div key={align} className="grid gap-2">
          <span className="text-muted-foreground font-mono text-xs">
            {align}
          </span>
          <InputGroup>
            <InputGroupAddon align={align}>
              <InputGroupText>
                <TerminalIcon />
                kubectl
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              aria-label={`kubectl arguments (${align})`}
              placeholder="get pods -n default"
            />
          </InputGroup>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    // Guards the attribute the CSS keys off: a renamed prop would still render
    // an addon, just an unstyled one, which no presence assertion would catch.
    const group = canvas.getAllByRole('group')[0];
    await expect(group).toBeInTheDocument();
    for (const align of ALIGNMENTS) {
      await expect(
        document.querySelector(`[data-align="${align}"]`),
      ).not.toBeNull();
    }
  },
};

/** An addon can hold a button — the group forwards clicks to the input unless
 * the click landed on one. */
export const WithButton: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-label="API endpoint"
          defaultValue="api.cluster.local:6443"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Copy endpoint">
            <Copy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupInput
          aria-label="Search virtual machines"
          placeholder="Search virtual machines"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm">Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

/**
 * `InputGroupTextarea` changes the group's height rules — `has-[>textarea]`
 * drops the fixed `h-9`, so the group grows with its content.
 */
export const WithTextarea: Story = {
  render: () => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="input-group-cloud-init">Cloud-init</Label>
      <InputGroup>
        <InputGroupTextarea
          id="input-group-cloud-init"
          rows={4}
          placeholder="#cloud-config"
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText>Runs on first boot</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

/**
 * `InputGroupButton` carries its own size scale, separate from `Button`'s. The
 * icon sizes are square; the text sizes are not, so a row of all four is the
 * only place the difference is visible.
 */
export const ButtonSizes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      {BUTTON_SIZES.map((size) => (
        <InputGroup key={size}>
          <InputGroupInput aria-label={size} placeholder={size} />
          <InputGroupAddon align="inline-end">
            {size.startsWith('icon') ? (
              <InputGroupButton size={size} aria-label={`Copy (${size})`}>
                <Copy />
              </InputGroupButton>
            ) : (
              <InputGroupButton size={size}>Copy</InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  ),
};

export const States: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          /*
           * The disabled group dims its addon to 50% opacity, which puts the
           * "ns/" prefix at 1.97:1. WCAG 1.4.3 exempts text that is part of an
           * inactive control, so this is compliant — but axe cannot tell,
           * because the group is marked inactive with `data-disabled` rather
           * than a `disabled` attribute it knows how to skip.
           *
           * Scoped to this story rather than turned off globally: the rule is
           * enforced everywhere else.
           */
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
  },
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="Name"
          defaultValue="Web Frontend"
          aria-invalid
        />
      </InputGroup>

      <InputGroup data-disabled="true">
        <InputGroupAddon>
          <InputGroupText>ns/</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-label="Namespace"
          defaultValue="default"
          disabled
        />
      </InputGroup>
    </div>
  ),
};
