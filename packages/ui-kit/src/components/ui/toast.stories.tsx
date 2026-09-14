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

import { Button } from './button';
import { ToastProvider, Toaster, useToast } from './toast';

const meta = {
  title: 'Feedback/Toast',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Mount `ToastProvider` once above anything that toasts, and one `Toaster` inside ' +
          'it — `AppShell` does both. `useToast` gives the calling convention both products ' +
          "already use (`toast.success('Secret created')`), so migrating their ~200 call " +
          'sites is a change of import.\n\n' +
          '`error` and `warning` are queued at high priority, which is what makes them ' +
          'assertive live regions: a failure announced only politely can sit unread behind ' +
          'whatever the user was already being told.\n\n' +
          "The limit is 3 rather than Base UI's 5 — a dashboard that fails a list call for " +
          'six namespaces will try to toast six times, and a stack tall enough to cover the ' +
          'button you were aiming at is worse than a truncated one.',
      },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const toast = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast.info('Reconciliation paused')}>
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Secret created', { description: 'db-credentials in billing.' })
        }
      >
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.warning('Provider is rate-limiting')}>
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Could not save', {
            description: 'The API returned 503.',
            action: { label: 'Retry', onClick: () => {} },
          })
        }
      >
        Error
      </Button>
    </div>
  );
}

export const Playground: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
      <Toaster />
    </ToastProvider>
  ),
};

export const PlaygroundDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Playground.render,
};
