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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta = {
  title: 'Data/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'The bordered surface. Compound parts rather than `title`/`actions` props, so ' +
          'migrating an existing `components/ui/card` usage is a change of import ' +
          'specifier and nothing else. The `<Card title subtitle actions>` shape ' +
          'is a *page section*, not a surface, and it is `Section` in the templates layer — ' +
          'keeping them apart is what stops this component growing a header it renders ' +
          'sometimes.\n\n' +
          '`bg-background` with a hairline, not `bg-muted`: a card on a page is the same ' +
          'plane as the page, and `muted` is for a well *inside* one.',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>db-credentials</CardTitle>
        <CardDescription>Synced 2 minutes ago from Vault.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="font-sans text-sm text-muted-foreground">
        Two keys, refreshed hourly.
      </CardContent>
      <CardFooter className="border-t border-border pt-6">
        <Button variant="ghost" size="sm">
          View manifest
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const PlaygroundDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Playground.render,
};
