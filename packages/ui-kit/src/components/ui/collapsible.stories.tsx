import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronsUpDown } from 'lucide-react';

import { Button } from './button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';

const CONDITIONS = [
  { type: 'Ready', status: 'True', reason: 'MinimumReplicasAvailable' },
  { type: 'Initialized', status: 'True', reason: 'PodCompleted' },
  { type: 'ContainersReady', status: 'False', reason: 'ContainersNotReady' },
] as const;

const meta = {
  title: 'Primitives/Collapsible',
  component: Collapsible,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

function Conditions() {
  return (
    <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
      {CONDITIONS.map((condition) => (
        <li
          key={condition.type}
          className="ring-border rounded-md px-3 py-2 font-mono text-xs ring-1"
        >
          {condition.type}={condition.status} · {condition.reason}
        </li>
      ))}
    </ul>
  );
}

export const Playground: Story = {
  render: () => (
    <Collapsible className="w-80">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">Conditions</span>
        <CollapsibleTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Toggle conditions">
              <ChevronsUpDown />
            </Button>
          }
        />
      </div>
      <CollapsibleContent>
        <Conditions />
      </CollapsibleContent>
    </Collapsible>
  ),
};

/**
 * Both states side by side.
 *
 * The closed panel is the one worth looking at: it is the height the open
 * panel animates back to, and the state where a stray margin on the content
 * leaks a few pixels of gap that nothing else would show.
 */
export const States: Story = {
  render: () => (
    <div className="flex items-start gap-10">
      <Collapsible defaultOpen className="w-80">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">Open</span>
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle open panel"
              >
                <ChevronsUpDown />
              </Button>
            }
          />
        </div>
        <CollapsibleContent>
          <Conditions />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="w-80">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">Closed</span>
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle closed panel"
              >
                <ChevronsUpDown />
              </Button>
            }
          />
        </div>
        <CollapsibleContent>
          <Conditions />
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
