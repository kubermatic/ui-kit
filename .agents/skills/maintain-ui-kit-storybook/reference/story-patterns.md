# Story patterns

Four skeletons, each distilled from a file already in the repo, plus the two
play-function guards. Copy the one that matches the primitive's shape.

---

## 1. Variant matrix

For a primitive with a `cva` config — a single element with variant and size
axes. Source: `button.stories.tsx`, `badge.stories.tsx`.

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';

import { Thing } from './thing';

const VARIANTS = ['default', 'secondary', 'outline', 'destructive'] as const;
const SIZES = ['xs', 'sm', 'default', 'lg'] as const;

const meta = {
  title: 'Primitives/Thing',
  component: Thing,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: SIZES },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Create cluster' },
} satisfies Meta<typeof Thing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every variant, so a token change can be reviewed in one screenshot. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Thing key={variant} {...args} variant={variant}>
          {variant}
        </Thing>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {SIZES.map((size) => (
        <Thing key={size} {...args} size={size}>
          {size}
        </Thing>
      ))}
    </div>
  ),
};

/** Icon-only controls need an accessible name — the icon is not one. */
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Thing {...args}>
        <Plus />
        Add disk
      </Thing>
      <Thing {...args} size="icon" aria-label="Add disk">
        <Plus />
      </Thing>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Thing key={variant} {...args} variant={variant}>
          {variant}
        </Thing>
      ))}
    </div>
  ),
};
```

The `VARIANTS` array feeding both `argTypes` and the render is the point: a
variant added to the `cva` config and to this array cannot go unrendered.

---

## 2. Composite

For a primitive that is a family of sub-components assembled at the call site.
There is nothing to put in `argTypes`, so the value is in showing a real
composition. Source: `card.stories.tsx`, `table.stories.tsx`.

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';
import { Button } from './button';
import {
  Thing,
  ThingContent,
  ThingFooter,
  ThingHeader,
  ThingTitle,
} from './thing';

const meta = {
  title: 'Primitives/Thing',
  component: Thing,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Thing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Thing className="w-96">
      <ThingHeader>
        <ThingTitle>web-frontend-01</ThingTitle>
        <Badge variant="success">Running</Badge>
      </ThingHeader>
      <ThingContent>
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Node</dt>
          <dd>worker-03</dd>
          <dt className="text-muted-foreground">IP</dt>
          <dd className="font-mono text-xs">10.244.2.17</dd>
        </dl>
      </ThingContent>
      <ThingFooter className="gap-2">
        <Button size="sm">Console</Button>
        <Button size="sm" variant="outline">
          Restart
        </Button>
      </ThingFooter>
    </Thing>
  ),
};

/** The state these dashboards spend the most time in. */
export const Empty: Story = {
  render: () => (
    <Thing className="w-96">
      <ThingContent className="text-muted-foreground h-24 text-center">
        No virtual machines found.
      </ThingContent>
    </Thing>
  ),
};
```

---

## 3. Overlay / portal

For anything that portals to `document.body`: dialog, sheet, popover,
dropdown-menu, select, combobox, tooltip, alert-dialog.

Two rules. The story must render **open** — a closed trigger screenshots
nothing and gives the theme toggle nothing to affect. And a play function must
query with `screen`, because `canvas` is scoped to the story root and the
popup is not inside it.

```tsx
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

const meta = {
  title: 'Primitives/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opens on click — the interaction as a consuming app wires it. */
export const Playground: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive">Delete</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete web-frontend-01?</DialogTitle>
          <DialogDescription>
            The virtual machine and its data volumes are removed permanently.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Open by default so the surface is reviewable — both themes and the a11y
 * panel need the popup mounted, and a closed trigger gives them nothing.
 */
export const Open: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach data volume</DialogTitle>
          <DialogDescription>Storage class csi-rbd.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  play: async () => {
    // `screen`, not `canvas` — the popup portals outside the story root.
    await expect(
      screen.getByRole('dialog', { name: /attach data volume/i }),
    ).toBeInTheDocument();
  },
};
```

`DialogTrigger` and `DialogClose` take a Base UI `render` prop to adopt a
`Button`; they do not use `asChild`. Check the component source — the rest of
the kit follows the same Base UI convention.

---

## 4. Form-bound

For the `react-hook-form` layer: `form`, `form-combobox`,
`form-multi-combobox`, `input-group`, `radio-group`.

These need a real `useForm` in scope. Define the wrapper as a named function
component so hooks are legal, then render it from the story.

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';

import { Button } from './button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';

interface VmForm {
  name: string;
}

function VmNameField({ defaultValue = '' }: { defaultValue?: string }) {
  const form = useForm<VmForm>({
    defaultValues: { name: defaultValue },
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <form
        className="flex max-w-sm flex-col gap-6"
        onSubmit={form.handleSubmit(() => {})}
      >
        <FormField
          control={form.control}
          name="name"
          rules={{
            pattern: {
              value: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
              message: 'Must be a valid RFC 1123 label.',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl
                render={<Input placeholder="web-frontend-01" {...field} />}
              />
              <FormDescription>
                Lowercase alphanumerics and dashes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Primitives/Form',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <VmNameField />,
};

/** `FormMessage` renders the resolver's message and wires `aria-describedby`. */
export const Invalid: Story = {
  render: () => <VmNameField defaultValue="Web Frontend" />,
};
```

Note `satisfies Meta` with no generic — there is no single root component to
type `args` against. `FormControl` takes a Base UI `render` prop, which is how
it forwards `id`, `aria-describedby` and `aria-invalid` onto the real input.

---

## Guard: resolution

Asserts that a token actually resolved to a colour. Guards the Tailwind
`@source` scan and the `theme.css` import — neither of which any presence
assertion can detect, because `toBeVisible` passes on unstyled output.

From `button.stories.tsx`:

```tsx
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
```

The literal oklch is the one place a raw colour value belongs in a story. If
the token's value changes, this assertion is _meant_ to fail — update it in
the same change.

---

## Guard: inventory

Asserts that two lists agree, so an undocumented addition becomes a failure
rather than a silent omission. From `tokens.stories.tsx`:

```tsx
play: async ({ canvas }) => {
  // A zero here would mean the stylesheet never loaded, which would make the
  // two assertions below pass vacuously.
  await expect(canvas.getByTestId('declared-count')).not.toHaveTextContent('0');
  await expect(canvas.getByTestId('missing')).toHaveTextContent('none');
  await expect(canvas.getByTestId('stale')).toHaveTextContent('none');
},
```

The anti-vacuity assertion first is the part that is easy to skip and load-bearing:
without it, an empty stylesheet produces an empty diff, and an empty diff passes.
Any inventory guard needs the equivalent check.

The story renders the diff both ways — declared-but-uncatalogued _and_
catalogued-but-no-longer-declared — so the guard catches removals as well as
additions.
