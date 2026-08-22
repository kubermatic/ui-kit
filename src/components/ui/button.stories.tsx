import type { Meta, StoryObj } from '@storybook/react-vite';
import type { VariantProps } from 'class-variance-authority';
import { expect } from 'storybook/test';
import { Plus, Trash2 } from 'lucide-react';

import { variantKeys } from '@/test/variant-matrix';
import { Button, buttonVariants } from './button';

type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>['variant']
>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

const VARIANTS = variantKeys<ButtonVariant>({
  default: true,
  secondary: true,
  outline: true,
  ghost: true,
  link: true,
  destructive: true,
  outlineDestructive: true,
  ghostDestructive: true,
});

/*
 * Includes the icon sizes, which the rendered matrix used to omit while
 * `argTypes` listed them separately — two hand-maintained lists that had
 * already drifted. Both now read this one.
 */
const SIZES = variantKeys<ButtonSize>({
  xs: true,
  sm: true,
  default: true,
  lg: true,
  'icon-xs': true,
  'icon-sm': true,
  icon: true,
  'icon-lg': true,
});

/** The icon sizes are square and take no label, so they render an icon. */
const isIconSize = (size: ButtonSize) => size.startsWith('icon');

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: SIZES },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Create cluster' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every variant, so a token change can be reviewed in one screenshot. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {SIZES.map((size) =>
        isIconSize(size) ? (
          <Button key={size} {...args} size={size} aria-label={size}>
            <Plus />
          </Button>
        ) : (
          <Button key={size} {...args} size={size}>
            {size}
          </Button>
        ),
      )}
    </div>
  ),
};

/** Icons are auto-sized by the variant's `[&_svg]` rules — no sizing props. */
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>
        <Plus />
        Add disk
      </Button>
      <Button {...args} variant="outlineDestructive">
        <Trash2 />
        Delete
      </Button>
      <Button {...args} size="icon" aria-label="Add">
        <Plus />
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>Default</Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="destructive">
        Destructive
      </Button>
    </div>
  ),
};

/**
 * Guards the Tailwind wiring rather than the component.
 *
 * `toBeVisible` passes on a completely unstyled button, so it cannot detect a
 * broken stylesheet. Asserting a resolved `getComputedStyle` value does: if the
 * `@source` scan or the token import regresses, `bg-primary` silently produces
 * no colour and this fails. That is the automated form of the manual check that
 * caught a 51KB-vs-118KB stylesheet difference during the extraction.
 */
export const CssCheck: Story = {
  args: { children: 'Submit' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /submit/i });
    // `bg-primary` resolves through the --primary token in theme.css.
    await expect(getComputedStyle(button).backgroundColor).toBe(
      'oklch(0.4232 0.1004 242)',
    );
  },
};
