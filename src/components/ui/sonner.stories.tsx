import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';

import { Button } from './button';
import { Toaster } from './sonner';

const meta = {
  title: 'Primitives/Toaster',
  component: Toaster,
  parameters: { layout: 'centered' },
  decorators: [
    /*
     * `Toaster` reads `useTheme()` from next-themes, but this Storybook has no
     * `ThemeProvider` — the preview decorator toggles a `.dark` class directly,
     * which is what consuming apps that use a different theme library also do.
     * Left alone the hook resolves to 'system' and the toaster ignores the
     * toolbar entirely, so the toolbar global is passed through explicitly here.
     *
     * A consuming app that does not use next-themes has to do the same thing:
     * pass `theme` to `<Toaster />` rather than expect it to follow.
     */
    (Story, context) => (
      <>
        <Toaster theme={context.globals.theme as 'light' | 'dark'} />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `richColors` is on, so each level gets its own surface rather than the
 * neutral popover background — check both themes.
 */
export const Playground: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        onClick={() => toast('Snapshot scheduled for web-frontend-01')}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success('Snapshot created')}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('Live migration started')}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning('Storage class has no default snapshot class')
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Failed to attach data volume: quota exceeded')
        }
      >
        Error
      </Button>
    </div>
  ),
};

/** Description and action — the shape a recoverable failure takes. */
export const WithAction: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Failed to attach data volume', {
            description: 'quota exceeded in namespace default',
            action: { label: 'Retry', onClick: () => {} },
          })
        }
      >
        With action
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.loading('Migrating web-frontend-01 to worker-05…', {
            duration: 4000,
          })
        }
      >
        Loading
      </Button>
    </div>
  ),
};

/**
 * `toast.promise` swaps loading for success or error on settle, which is the
 * only path where the spinner icon is exercised.
 */
export const Promise: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(
          new global.Promise((resolve) => setTimeout(resolve, 2000)),
          {
            loading: 'Creating snapshot of db-primary…',
            success: 'Snapshot db-primary-20260822 created',
            error: 'Snapshot failed',
          },
        )
      }
    >
      Create snapshot
    </Button>
  ),
};
