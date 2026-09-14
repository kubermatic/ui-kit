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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { BrandProvider } from './brand';
import {
  Sidebar,
  SidebarBrand,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarNav,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  type NavSection,
} from './sidebar';

describe('Sidebar chrome', () => {
  it('renders header, content, footer and separator', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>header</SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Resources</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton icon={<span>i</span>} badge={<span>3</span>}>
                      Secrets
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton>Details</SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>footer</SidebarFooter>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByText('header')).toBeInTheDocument();
    expect(screen.getByText('footer')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
  });

  /*
   * The lockup would be clipped to the left 3.5rem of itself at rail width, so
   * the square mark takes over.
   */
  it('swaps the lockup for the mark when collapsed', async () => {
    const { container } = render(
      <BrandProvider brand={{ name: 'Example Console', shortName: 'EC' }}>
        <SidebarProvider>
          <SidebarTrigger />
          <Sidebar>
            <SidebarHeader>
              <SidebarBrand />
            </SidebarHeader>
          </Sidebar>
        </SidebarProvider>
      </BrandProvider>,
    );

    const artwork = () => container.querySelector('[data-slot="logo"] > span')!;

    // Expanded: the wordmark, set in the display face.
    expect(artwork()).toHaveClass('font-display');

    await userEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

    // Collapsed: the initials in a tinted square.
    expect(artwork()).toHaveClass('bg-primary');
    expect(artwork()).toHaveTextContent('EC');
  });

  it('hides group labels and sub-menus at rail width', () => {
    render(
      <SidebarProvider defaultCollapsed>
        <Sidebar>
          <SidebarGroup>
            <SidebarGroupLabel>Resources</SidebarGroupLabel>
          </SidebarGroup>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByText('Resources')).toHaveClass(
      'group-data-[state=collapsed]/sidebar:hidden',
    );
  });
});

describe('SidebarNav disclosure', () => {
  const collapsibleSection: NavSection[] = [
    {
      items: [
        {
          label: 'Services',
          href: '/services',
          collapsible: true,
          items: [{ label: 'Postgres', href: '/services/pg' }],
        },
      ],
    },
  ];

  it('keeps nested items behind a disclosure', async () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarNav sections={collapsibleSection} />
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.queryByRole('link', { name: 'Postgres' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Toggle Services' }));
    expect(screen.getByRole('link', { name: 'Postgres' })).toBeInTheDocument();
  });

  /* Open on arrival when the child is the current page, so you can see where you are. */
  it('starts open when a nested item is active', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarNav
            sections={[
              {
                items: [
                  {
                    label: 'Services',
                    href: '/services',
                    collapsible: true,
                    items: [{ label: 'Postgres', href: '/services/pg', isActive: true }],
                  },
                ],
              },
            ]}
          />
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByRole('link', { name: 'Postgres' })).toBeInTheDocument();
  });

  it('explains a disabled item in its tooltip label', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarNav
            sections={[
              {
                items: [
                  {
                    label: 'Blueprints',
                    href: '/blueprints',
                    disabled: true,
                    disabledReason: 'Needs the blueprints feature flag',
                  },
                ],
              },
            ]}
          />
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByRole('button', { name: 'Blueprints' })).toBeDisabled();
  });
});

describe('Sidebar below the mobile breakpoint', () => {
  /*
   * No teardown: `test/setup.ts` reinstalls the shared stub in a global
   * `beforeEach`, and a file-level one runs after it — so the override lasts
   * exactly for the tests in this block.
   */
  beforeEach(() => {
    // The shared stub answers every query with the dark-mode flag; this one
    // answers by query, which is what a max-width test actually needs.
    window.matchMedia = (query: string) => ({
      matches: query.includes('max-width'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    });
  });

  /*
   * One product's sidebar simply stays 224px wide on a phone and eats half the
   * viewport. As a drawer it brings the focus trap and escape handling with it.
   */
  it('becomes a labelled drawer, closed until the trigger is used', async () => {
    render(
      <SidebarProvider>
        <SidebarTrigger />
        <Sidebar label="Primary">
          <SidebarContent>nav</SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));

    expect(screen.getByRole('dialog', { name: 'Primary navigation' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('shows the full label on a menu button, since the rail is not narrow there', async () => {
    render(
      <SidebarProvider defaultCollapsed>
        <SidebarTrigger />
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Secrets</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));
    expect(screen.getByText('Secrets')).not.toHaveClass('sr-only');
  });
});
