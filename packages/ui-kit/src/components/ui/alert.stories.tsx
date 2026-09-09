/*
 * Copyright 2026 The Kubermatic Authors
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

import { variantKeys } from '@/test/variant-matrix';

import { Alert, type AlertTone } from './alert';
import { Button } from './button';

/* Complete by construction — see test/variant-matrix.ts. */
const TONES = variantKeys<AlertTone>({ info: true, success: true, warning: true, error: true });

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          'An inline message about the page, not about a field. `role="alert"` on the ' +
          'error and warning tones only: `alert` is an *assertive* live region — it ' +
          'interrupts the screen reader mid-sentence, which is correct for "Saving failed" ' +
          'and rude for "Your changes were saved". The quiet tones get `role="status"`.\n\n' +
          'Both products render their error banner with no role at all, so a failure that ' +
          'appears after an async call is never announced: the user presses Save and hears ' +
          'nothing.\n\n' +
          'Outlined rather than tinted, for the reason `StatusBadge` documents — the tone ' +
          'is carried by the border and the icon, both measured against `--background`, ' +
          'and the body text stays at `--foreground`, i.e. 18.9:1.',
      },
    },
  },
  args: {
    tone: 'info',
    title: 'Reconciliation is paused',
    children: 'Resume it to resume syncing.',
  },
  argTypes: { tone: { control: 'select', options: TONES } },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-[36rem]">
      <Alert {...args} />
    </div>
  ),
};

export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[36rem] flex-col gap-3">
      <Alert tone="info" title="Reconciliation is paused">
        Resume it to resume syncing.
      </Alert>
      <Alert tone="success" title="Secret created">
        db-credentials is now available in the billing namespace.
      </Alert>
      <Alert tone="warning" title="Provider is rate-limiting">
        Backing off; the next attempt is in 30 seconds.
      </Alert>
      <Alert tone="error" title="Could not reach the provider">
        dial tcp 10.0.4.2:8200: connect: connection refused
      </Alert>
    </div>
  ),
};

export const WithAction: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[36rem]">
      <Alert
        tone="error"
        title="Could not load the secret stores"
        action={
          <Button variant="outline" size="sm">
            Retry
          </Button>
        }
      >
        The API returned 503.
      </Alert>
    </div>
  ),
};

export const TonesDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  parameters: { controls: { disable: true } },
  render: Tones.render,
};
