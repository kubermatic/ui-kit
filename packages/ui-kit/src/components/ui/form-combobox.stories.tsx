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
import { FormCombobox, type ComboboxOptionGroup } from './form-combobox';

/*
 * Lifted from `form-combobox.test.tsx` rather than invented: the empty group
 * label is the "no preset" escape hatch, and the two CentOS entries share a
 * label and are told apart only by their hint — which is exactly why the filter
 * searches the hint too.
 */
const IMAGE_PRESETS: ComboboxOptionGroup[] = [
  { label: '', options: [{ value: '', label: 'None (manual configuration)' }] },
  {
    label: 'Linux',
    options: [
      {
        value: 'centos.stream9',
        label: 'CentOS Stream 9',
        hint: 'centos.stream9',
      },
      {
        value: 'centos.stream9.desktop',
        label: 'CentOS Stream 9',
        hint: 'centos.stream9.desktop',
      },
      { value: 'ubuntu.24.04', label: 'Ubuntu 24.04', hint: 'ubuntu.24.04' },
    ],
  },
  {
    label: 'Windows',
    options: [{ value: 'windows.11', label: 'Windows 11', hint: 'windows.11' }],
  },
];

const STORAGE_CLASSES = ['csi-rbd', 'csi-cephfs', 'local-path', 'ceph-rbd'];

interface DiskForm {
  storageClass: string;
  preset: string;
}

function DiskFields({
  defaultStorageClass = '',
  submitted = false,
}: {
  defaultStorageClass?: string;
  submitted?: boolean;
}) {
  const form = useForm<DiskForm>({
    defaultValues: { storageClass: defaultStorageClass, preset: '' },
    mode: submitted ? 'onChange' : 'onSubmit',
  });

  return (
    <Form {...form}>
      <form
        className="flex max-w-sm flex-col gap-6"
        onSubmit={form.handleSubmit(() => {})}
      >
        <FormField
          control={form.control}
          name="storageClass"
          rules={{ required: 'Select a storage class.' }}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Storage class</FormLabel>
              <FormControl
                render={
                  <FormCombobox
                    items={STORAGE_CLASSES}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select storage class"
                    hasError={!!fieldState.error}
                  />
                }
              />
              <FormDescription>csi-rbd is the cluster default.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image preset</FormLabel>
              <FormControl
                render={
                  <FormCombobox
                    groups={IMAGE_PRESETS}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select preset"
                  />
                }
              />
              <FormDescription>
                Grouped by operating system. Two entries can share a label and
                differ only by hint.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="self-start">
          Create disk
        </Button>
      </form>
    </Form>
  );
}

/*
 * `satisfies Meta` with no generic, and no `component`.
 *
 * `FormCombobox` is fully controlled: `value` and `onValueChange` are required
 * props that no static `args` object can supply, because every story has to own
 * the state — which is what the wrapper above does. Naming the component here
 * would make Storybook infer args from it and demand them back.
 */
const meta = {
  title: 'Primitives/Form combobox',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The input doubles as display and filter, so it selects its own text on focus
 * — without that, typing appends to the selected label and the filter matches
 * nothing. Click a populated field and start typing to see it.
 *
 * The popup opens on a pointer *sequence*, not a bare click; a test driving it
 * with `click()` alone will find nothing.
 */
export const Playground: Story = {
  render: () => <DiskFields />,
};

/** A selected value renders the clear affordance in place of the trigger. */
export const Selected: Story = {
  render: () => <DiskFields defaultStorageClass="csi-rbd" />,
};

/** `hasError` sets `aria-invalid` on the input, which drives the error ring. */
export const Invalid: Story = {
  render: function InvalidField() {
    const form = useForm<DiskForm>({
      defaultValues: { storageClass: '', preset: '' },
    });

    return (
      <Form {...form}>
        <form className="flex max-w-sm flex-col gap-6">
          <FormField
            control={form.control}
            name="storageClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage class</FormLabel>
                <FormControl
                  render={
                    <FormCombobox
                      items={STORAGE_CLASSES}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select storage class"
                      hasError
                    />
                  }
                />
                <FormMessage>Select a storage class.</FormMessage>
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  },
};

export const Disabled: Story = {
  render: function DisabledField() {
    const form = useForm<DiskForm>({
      defaultValues: { storageClass: 'csi-rbd', preset: '' },
    });

    return (
      <Form {...form}>
        <form className="flex max-w-sm flex-col gap-6">
          <FormField
            control={form.control}
            name="storageClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage class</FormLabel>
                <FormControl
                  render={
                    <FormCombobox
                      items={STORAGE_CLASSES}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled
                    />
                  }
                />
                <FormDescription>
                  Fixed by the cluster storage policy.
                </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  },
};
