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
import { expect } from 'storybook/test';
import { useForm } from 'react-hook-form';

import { Button } from './button';
import { Checkbox } from './checkbox';
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
import { Textarea } from './textarea';

interface VmForm {
  name: string;
  cloudInit: string;
  startAfterCreate: boolean;
}

/*
 * The wrapper is a named component so `useForm` is legal — hooks cannot run in
 * a story's `render` arrow directly.
 */
function VmFields({
  defaultName = '',
  mode = 'onChange',
}: {
  defaultName?: string;
  mode?: 'onChange' | 'onSubmit';
}) {
  const form = useForm<VmForm>({
    defaultValues: {
      name: defaultName,
      cloudInit: '',
      startAfterCreate: true,
    },
    mode,
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
            required: 'Name is required.',
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

        <FormField
          control={form.control}
          name="cloudInit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cloud-init</FormLabel>
              <FormControl
                render={
                  <Textarea rows={3} placeholder="#cloud-config" {...field} />
                }
              />
              <FormDescription>
                Runs on first boot. Leave empty to skip provisioning.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startAfterCreate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl
                render={
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                }
              />
              <FormLabel>Start after creation</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" className="self-start">
          Create
        </Button>
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
  render: () => <VmFields />,
};

/**
 * The a11y contract, and the reason this is the highest-value story in the kit.
 *
 * `FormControl` is not a wrapper — it forwards `id`, `aria-describedby` and
 * `aria-invalid` onto the real input through Base UI's `render` prop, and
 * `FormLabel` points its `htmlFor` at the same generated id. Nothing else
 * proves that wiring, and all of it is invisible on screen: a broken
 * `aria-describedby` looks identical and silently stops announcing the error.
 *
 * Hence assertions on the attributes rather than on the message being visible.
 */
export const Invalid: Story = {
  render: () => <VmFields defaultName="Web Frontend" />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Name');

    // Touch the field so the onChange-mode resolver runs.
    await userEvent.type(input, '!');

    const message = await canvas.findByText('Must be a valid RFC 1123 label.');

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input.getAttribute('aria-describedby')).toContain(message.id);
  },
};

/** Required-field errors surface on submit when the form is in `onSubmit` mode. */
export const RequiredOnSubmit: Story = {
  render: () => <VmFields mode="onSubmit" />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Create' }));
    await expect(
      await canvas.findByText('Name is required.'),
    ).toBeInTheDocument();
  },
};
