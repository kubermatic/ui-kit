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

import { Breadcrumbs } from './breadcrumb';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumbs,
  parameters: {
    docs: {
      description: {
        component:
          'An `<ol>` inside a labelled `<nav>`, because the order is the meaning. The ' +
          'separators are `aria-hidden` siblings rather than nested items: an `<li>` inside ' +
          'an `<li>` is invalid, and a screen reader announcing "list of 5 items" would be ' +
          'counting the slashes.\n\n' +
          'The last entry is always the current page regardless of whether it has an ' +
          '`href` — a trail whose final item links to the page you are already on is a link ' +
          'that does nothing. It is plain text with `aria-current="page"`, deliberately ' +
          'not `role="link" aria-disabled="true"`: that pairing announces a dimmed link and ' +
          'invites you to activate something that is not there.\n\n' +
          'Labels are passed in rather than derived from the URL. Deriving them by title-casing ' +
          'path segments and gets "Eso deployments" and "Push secrets"; the route knows its ' +
          'own name and the URL does not.',
      },
    },
  },
  args: {
    items: [
      { label: 'Organizations', href: '/organizations' },
      { label: 'Acme', href: '/organizations/acme' },
      { label: 'External Secrets' },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Deep: Story = {
  args: {
    items: [
      { label: 'Organizations', href: '/organizations' },
      { label: 'Acme', href: '/organizations/acme' },
      { label: 'Services', href: '/organizations/acme/services' },
      { label: 'Postgres', href: '/organizations/acme/services/postgres' },
      { label: 'billing-db' },
    ],
  },
};
