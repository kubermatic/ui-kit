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
import { Shapes } from 'lucide-react';

import { PLATFORM, CONSOLE, USER } from '@/test/app-fixtures';

import { AppHeader } from './app-header';
import { BrandProvider, Logo } from './brand';
import { Breadcrumbs } from './breadcrumb';
import { buttonVariants } from './button';
import { SidebarProvider } from './sidebar';
import { UserMenu } from './user-menu';

const meta = {
  title: 'App Frame/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Slots rather than a fixed composition, because the two products put different ' +
          'things here and neither is wrong: one has the brand, an organisation selector ' +
          'and the user menu; the other has a breadcrumb, a cluster picker, a namespace ' +
          'picker and the user menu. Both are `brand` / `children` / `actions` / `user`.\n\n' +
          'A real `<header>`, which is a `banner` landmark — so "jump to banner" works and ' +
          'the header is not just the first `<div>` on the page.\n\n' +
          '`sidebarTrigger` defaults to `mobile`, which is the right answer for a ' +
          '`header-first` layout: the rail has its own trigger on desktop, and the ' +
          "header's would be a second control for the same thing.",
      },
    },
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The brand lives here, because the header spans the corner.
 *
 * `<Logo />`, not `<SidebarBrand />` — the latter shrinks to a square mark
 * when the rail collapses, which is right in a 3.5rem rail and wrong in a
 * full-width header.
 */
export const WithBrand: Story = {
  render: () => (
    <BrandProvider brand={PLATFORM}>
      <SidebarProvider>
        <AppHeader
          brand={<Logo />}
          actions={
            <a href="#catalog" className={buttonVariants()}>
              <Shapes />
              Service Catalog
            </a>
          }
          user={<UserMenu user={USER} onSignOut={() => {}} showName />}
        />
      </SidebarProvider>
    </BrandProvider>
  ),
};

/** The sidebar already shows the brand, so this holds the trail. */
export const WithBreadcrumbs: Story = {
  render: () => (
    <BrandProvider brand={CONSOLE}>
      <SidebarProvider>
        <AppHeader user={<UserMenu user={USER} onSignOut={() => {}} />}>
          <Breadcrumbs
            items={[{ label: 'Secrets', href: '#secrets' }, { label: 'External Secrets' }]}
          />
        </AppHeader>
      </SidebarProvider>
    </BrandProvider>
  ),
};

export const WithBrandDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: WithBrand.render,
};
