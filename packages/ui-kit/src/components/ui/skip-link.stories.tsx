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

import { SkipLink } from './skip-link';

const meta = {
  title: 'App Frame/SkipLink',
  component: SkipLink,
  parameters: {
    docs: {
      description: {
        component:
          'The first thing in the tab order. A keyboard user landing on a page with a ' +
          '30-item sidebar otherwise presses Tab thirty times before reaching the content, ' +
          'on every navigation. WCAG 2.2 SC 2.4.1 asks for this and it is two elements.\n\n' +
          'Visually hidden until focused, rather than `display: none` — a hidden element is ' +
          'not focusable, so the usual `sr-only` has to be undone on `:focus`. The target ' +
          'needs `tabIndex={-1}` or the browser moves the *scroll* position without moving ' +
          'focus; `AppShell` sets it on the main region for you.\n\n' +
          '**Press Tab in the canvas below to see it.**',
      },
    },
  },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SkipLink target="demo-content" />
      <p className="font-sans text-sm text-muted-foreground">
        Press Tab. The link appears in the top-left corner.
      </p>
      <div
        id="demo-content"
        tabIndex={-1}
        className="rounded-md border border-border p-4 font-sans text-sm"
      >
        The main region. Focusable as a target only — it never appears in the tab order.
      </div>
    </div>
  ),
};
