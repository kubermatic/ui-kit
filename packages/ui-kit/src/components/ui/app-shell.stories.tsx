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
import { Plus, Server, Shapes } from 'lucide-react';
import { useState } from 'react';

import {
  PLATFORM,
  PLATFORM_NAV,
  PLATFORM_NAV_FOOTER,
  CONSOLE,
  CONSOLE_NAV,
  USER,
} from '@/test/app-fixtures';

import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';
import { AppShell } from './app-shell';
import { BrandProvider, Logo } from './brand';
import { Breadcrumbs } from './breadcrumb';
import { Button, buttonVariants } from './button';
import { Combobox } from './combobox';
import { ListPage } from './list-page';
import { FilterSelect } from './select';
import {
  Sidebar,
  SidebarBrand,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarTrigger,
} from './sidebar';
import { StatusBadge, type StatusTone } from './status-badge';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';
import type { ColumnDef } from '@tanstack/react-table';

interface Secret {
  name: string;
  namespace: string;
  status: StatusTone;
  statusLabel: string;
}

const SECRETS: Secret[] = [
  { name: 'db-credentials', namespace: 'billing', status: 'success', statusLabel: 'Synced' },
  { name: 'api-token', namespace: 'billing', status: 'error', statusLabel: 'Error' },
  { name: 'tls-cert', namespace: 'ingress', status: 'warning', statusLabel: 'Degraded' },
];

const COLUMNS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'namespace', header: 'Namespace' },
  {
    accessorKey: 'statusLabel',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge tone={row.original.status} dot>
        {row.original.statusLabel}
      </StatusBadge>
    ),
  },
] as ColumnDef<Secret, never>[];

const meta = {
  title: 'App Frame/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The frame. Everything in it is a composition you could assemble yourself; the ' +
          'value is that the four things that are easy to get wrong are already right:\n\n' +
          '- **`<main>` exists, once, with an id.** A page needs exactly one main landmark. ' +
          'Neither product has one — both nest the content in divs, so "jump to main ' +
          'content" has nothing to jump to and one skip link points at a `<div>`.\n' +
          '- **`tabIndex={-1}` on it**, or the skip link scrolls without moving focus and ' +
          'the next Tab starts from the top again.\n' +
          '- **Only the content scrolls.** The sidebar and header are outside the scroll ' +
          'container, so a long table does not scroll the navigation away.\n' +
          '- **The providers are in the right order**, with the tooltip provider above the ' +
          'sidebar so collapsed-rail tooltips share one delay.\n\n' +
          '`layout` is the one prop that had to exist. Both products are "a sidebar, a ' +
          'header and a content area", and they disagree about which of the two spans the ' +
          'corner — so a single hardcoded frame would have forced one of them to rebuild ' +
          'it.\n\n' +
          '`ThemeProvider` is deliberately *not* mounted here: it owns the `.dark` class on ' +
          '`<html>`, which is above the shell, and an app rendering two shells side by side ' +
          '— a tenant preview — must not get two of them.',
      },
    },
  },
  args: { children: null },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `sidebar-first`. The sidebar is full height and
 * the header sits inside the content column beside it, holding the breadcrumb
 * and the cluster/namespace pickers.
 */
export const SidebarFirst: Story = {
  render: function SidebarFirstStory() {
    const [cluster, setCluster] = useState<string | null>('prod-eu-1');
    const [namespace, setNamespace] = useState('billing');

    return (
      <BrandProvider brand={CONSOLE}>
        <AppShell
          layout="sidebar-first"
          sidebar={
            <Sidebar>
              <SidebarHeader>
                <SidebarBrand />
              </SidebarHeader>
              <SidebarNav sections={CONSOLE_NAV} />
              <SidebarFooter className="flex-row items-center justify-between">
                <ThemeToggle />
                <SidebarTrigger />
              </SidebarFooter>
            </Sidebar>
          }
          header={
            <AppHeader
              actions={
                <>
                  <Combobox
                    options={['prod-eu-1', 'prod-us-1', 'staging']}
                    value={cluster}
                    onValueChange={setCluster}
                    startAdornment={<Server />}
                    className="w-48"
                    aria-label="Cluster"
                  />
                  <FilterSelect
                    label="Namespace"
                    value={namespace}
                    onValueChange={setNamespace}
                    options={['billing', 'ingress', 'kube-system']}
                    triggerClassName="w-40"
                  />
                </>
              }
              user={<UserMenu user={USER} onSignOut={() => {}} />}
            >
              <Breadcrumbs
                items={[{ label: 'Secrets', href: '#secrets' }, { label: 'External Secrets' }]}
              />
            </AppHeader>
          }
        >
          <ListPage
            title="External Secrets"
            description="Reconciled from vault-backend into the billing namespace."
            actions={
              <Button>
                <Plus />
                New external secret
              </Button>
            }
            data={SECRETS}
            columns={COLUMNS}
            caption="External secrets"
          />
        </AppShell>
      </BrandProvider>
    );
  },
};

/**
 * `header-first`. The header spans the whole width with
 * the brand and the organisation switcher in it, and the sidebar starts below.
 */
export const HeaderFirst: Story = {
  render: () => (
    <BrandProvider brand={PLATFORM}>
      <AppShell
        layout="header-first"
        sidebar={
          <Sidebar>
            <SidebarNav sections={PLATFORM_NAV} footerSections={PLATFORM_NAV_FOOTER} />
            <SidebarFooter className="flex-row items-center justify-end">
              <SidebarTrigger />
            </SidebarFooter>
          </Sidebar>
        }
        header={
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
        }
        footer={<AppFooter actions={<ThemeToggle />} />}
      >
        <ListPage
          title="Service objects"
          description="Everything provisioned in this organization."
          data={SECRETS}
          columns={COLUMNS}
          caption="Service objects"
        />
      </AppShell>
    </BrandProvider>
  ),
};

export const SidebarFirstDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: SidebarFirst.render,
};

export const HeaderFirstDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: HeaderFirst.render,
};
