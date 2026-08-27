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
import { FormMultiCombobox } from './form-multi-combobox';

const NODES = [
  'worker-01',
  'worker-02',
  'worker-03',
  'worker-04',
  'worker-05',
  'control-plane-01',
];

const TOLERATIONS = [
  'node-role.kubernetes.io/control-plane',
  'nvidia.com/gpu',
  'storage.kubermatic.io/local',
  'workload.kubermatic.io/batch',
  'node.kubernetes.io/unschedulable',
];

interface PlacementForm {
  nodes: string[];
  tolerations: string[];
}

function PlacementField({
  defaultNodes = [],
  defaultTolerations = [],
  hasError = false,
}: {
  defaultNodes?: string[];
  defaultTolerations?: string[];
  hasError?: boolean;
}) {
  const form = useForm<PlacementForm>({
    defaultValues: {
      nodes: defaultNodes,
      tolerations: defaultTolerations,
    },
  });

  return (
    <Form {...form}>
      <form className="flex max-w-sm flex-col gap-6">
        <FormField
          control={form.control}
          name="nodes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eligible nodes</FormLabel>
              <FormControl
                render={
                  <FormMultiCombobox
                    items={NODES}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Any node"
                    emptyMessage="No nodes found."
                    hasError={hasError}
                  />
                }
              />
              <FormDescription>
                Leave empty to let the scheduler decide.
              </FormDescription>
              <FormMessage>
                {hasError ? 'Select at least one node.' : null}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tolerations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tolerations</FormLabel>
              <FormControl
                render={
                  <FormMultiCombobox
                    items={TOLERATIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="None"
                  />
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

/*
 * `satisfies Meta` with no generic and no `component` — see
 * `form-combobox.stories.tsx`: the component is controlled, so its required
 * props cannot come from static args.
 */
const meta = {
  title: 'Primitives/Form multi combobox',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <PlacementField defaultNodes={['worker-01', 'worker-03']} />,
};

/** No selection: the placeholder shows, and the field is a single row high. */
export const Empty: Story = {
  render: () => <PlacementField />,
};

/**
 * The actual design question this component poses: what happens as the
 * selection grows.
 *
 * Chips wrap and the field grows downwards rather than scrolling sideways, so a
 * long Kubernetes toleration key pushes the input onto its own line. Worth
 * checking against the surrounding form's rhythm — this is the one control
 * whose height is unbounded.
 */
export const Overflow: Story = {
  render: () => (
    <PlacementField
      defaultNodes={NODES}
      defaultTolerations={TOLERATIONS.slice(0, 3)}
    />
  ),
};

/** `hasError` lands on the chip container, so the ring wraps every chip. */
export const Invalid: Story = {
  render: () => <PlacementField hasError />,
};
