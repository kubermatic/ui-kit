import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Label } from './label';
import { RadioGroup, RadioGroupItem } from './radio-group';

const ACCESS_MODES = [
  {
    value: 'ReadWriteOnce',
    hint: 'Mounted read-write by a single node.',
  },
  {
    value: 'ReadOnlyMany',
    hint: 'Mounted read-only by many nodes.',
  },
  {
    value: 'ReadWriteMany',
    hint: 'Mounted read-write by many nodes. Needs csi-cephfs.',
  },
] as const;

const meta = {
  title: 'Primitives/Radio group',
  component: RadioGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <RadioGroup defaultValue="ReadWriteOnce" className="max-w-sm">
      {ACCESS_MODES.map((mode) => (
        <div key={mode.value} className="flex items-start gap-3">
          <RadioGroupItem value={mode.value} id={`access-${mode.value}`} />
          <div className="grid gap-1">
            <Label htmlFor={`access-${mode.value}`}>{mode.value}</Label>
            <p className="text-muted-foreground text-xs">{mode.hint}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  ),
};

/**
 * Arrow-key navigation is the whole point of a radio group: the group is one
 * tab stop and the arrows move *and select* within it. That is also what makes
 * it easy to break by reaching for individual radios — so it is asserted here
 * rather than left to a manual pass.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <RadioGroup defaultValue="ReadWriteOnce" className="max-w-sm">
      {ACCESS_MODES.map((mode) => (
        <div key={mode.value} className="flex items-center gap-3">
          <RadioGroupItem value={mode.value} id={`kbd-${mode.value}`} />
          <Label htmlFor={`kbd-${mode.value}`}>{mode.value}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    const first = canvas.getByRole('radio', { name: 'ReadWriteOnce' });
    await expect(first).toHaveAttribute('aria-checked', 'true');

    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');

    await expect(
      canvas.getByRole('radio', { name: 'ReadOnlyMany' }),
    ).toHaveAttribute('aria-checked', 'true');
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-8">
      <RadioGroup defaultValue="ReadWriteOnce" disabled>
        {ACCESS_MODES.map((mode) => (
          <div key={mode.value} className="flex items-center gap-3">
            <RadioGroupItem value={mode.value} id={`off-${mode.value}`} />
            <Label htmlFor={`off-${mode.value}`}>{mode.value}</Label>
          </div>
        ))}
      </RadioGroup>

      <RadioGroup defaultValue="ReadWriteOnce">
        {ACCESS_MODES.map((mode) => (
          <div key={mode.value} className="flex items-center gap-3">
            <RadioGroupItem
              value={mode.value}
              id={`one-${mode.value}`}
              disabled={mode.value === 'ReadWriteMany'}
            />
            <Label htmlFor={`one-${mode.value}`}>{mode.value}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  ),
};

/** Bound to `react-hook-form`, with the invalid ring driven by `aria-invalid`. */
export const InForm: Story = {
  render: function AccessModeField() {
    const form = useForm<{ accessMode: string }>({
      defaultValues: { accessMode: '' },
      mode: 'onSubmit',
    });

    return (
      <Form {...form}>
        <form className="max-w-sm">
          <FormField
            control={form.control}
            name="accessMode"
            rules={{ required: 'Select an access mode.' }}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Access mode</FormLabel>
                <FormControl
                  render={
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      {ACCESS_MODES.map((mode) => (
                        <div
                          key={mode.value}
                          className="flex items-center gap-3"
                        >
                          <RadioGroupItem
                            value={mode.value}
                            id={`rhf-${mode.value}`}
                            aria-invalid={!!fieldState.error}
                          />
                          <Label htmlFor={`rhf-${mode.value}`}>
                            {mode.value}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  }
                />
                <FormDescription>
                  Determines how many nodes can mount the volume at once.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  },
};
