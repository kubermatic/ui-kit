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

import {
  PLATFORM,
  PLATFORM_NAV,
  PLATFORM_NAV_FOOTER,
  CONSOLE,
  CONSOLE_NAV,
} from '@/test/app-fixtures';

import { BrandProvider } from './brand';
import {
  Sidebar,
  SidebarBrand,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarProvider,
  SidebarTrigger,
} from './sidebar';
import { ThemeToggle } from './theme-toggle';
import { TooltipProvider } from './tooltip';

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A `<nav>` with an accessible name, because "Primary" and "Secondary" is how a ' +
          'screen-reader user tells two navigation landmarks apart — both products render a ' +
          'bare `<aside>` or a `<div>`. Below the breakpoint it becomes a `Drawer`, which ' +
          "brings the focus trap and escape handling with it; one product's sidebar simply " +
          'stays 224px wide on a phone and eats half the viewport.\n\n' +
          '`SidebarMenuButton` gets three things right that hand-rolled sidebars usually do ' +
          'not:\n\n' +
          '1. **`aria-current="page"` when active.** A left border and a background change ' +
          'say "you are here" to someone who can see it. Neither product sets it.\n' +
          '2. **A real label when collapsed.** The text is `sr-only`, not removed, so the ' +
          'button keeps its accessible name at rail width. The tooltip is *additional* — a ' +
          'tooltip alone is unreachable by touch.\n' +
          '3. **A disabled item is a disabled control**, not a link to `/` with ' +
          '`pointer-events: none`, which is still focusable and still activatable by Enter.\n\n' +
          '`SidebarNav` takes the navigation as data, which is how both apps already ' +
          'describe it. Anything that does not fit — a nav item that is a search box — ' +
          'composes `SidebarMenu` and friends directly.',
      },
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Flat groups, a badge, no nesting. */
export const Console: Story = {
  render: () => (
    <BrandProvider brand={CONSOLE}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-dvh bg-background">
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
            <div className="flex-1 p-6 font-sans text-sm text-muted-foreground">
              Page content sits here.
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </BrandProvider>
  ),
};

/** A nested service tree behind disclosures, plus a pinned footer group. */
export const Nested: Story = {
  render: () => (
    <BrandProvider brand={PLATFORM}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-dvh bg-background">
            <Sidebar>
              <SidebarHeader>
                <SidebarBrand />
              </SidebarHeader>
              <SidebarNav sections={PLATFORM_NAV} footerSections={PLATFORM_NAV_FOOTER} />
              <SidebarFooter className="flex-row items-center justify-end">
                <SidebarTrigger />
              </SidebarFooter>
            </Sidebar>
            <div className="flex-1 p-6 font-sans text-sm text-muted-foreground">
              Page content sits here.
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </BrandProvider>
  ),
};

/**
 * At rail width the labels are visually hidden but still the buttons'
 * accessible names, and the brand falls back to its square mark.
 */
export const Collapsed: Story = {
  render: () => (
    <BrandProvider brand={CONSOLE}>
      <TooltipProvider>
        <SidebarProvider defaultCollapsed>
          <div className="flex h-dvh bg-background">
            <Sidebar>
              <SidebarHeader>
                <SidebarBrand />
              </SidebarHeader>
              <SidebarNav sections={CONSOLE_NAV} />
              <SidebarFooter className="items-center">
                <SidebarTrigger />
              </SidebarFooter>
            </Sidebar>
            <div className="flex-1 p-6 font-sans text-sm text-muted-foreground">
              Page content sits here.
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </BrandProvider>
  ),
};

/** A section whose data has not arrived, and one that arrived empty. */
export const LoadingAndEmpty: Story = {
  render: () => (
    <BrandProvider brand={PLATFORM}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-dvh bg-background">
            <Sidebar>
              <SidebarHeader>
                <SidebarBrand />
              </SidebarHeader>
              <SidebarNav
                sections={[
                  { label: 'Organization', items: PLATFORM_NAV[0]!.items },
                  { label: 'Services', items: [], loading: true },
                  {
                    label: 'Blueprints',
                    items: [],
                    emptyMessage: 'No blueprints in this organization.',
                  },
                ]}
              />
            </Sidebar>
            <div className="flex-1 p-6" />
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </BrandProvider>
  ),
};

export const ConsoleDark: Story = {
  globals: { theme: 'dark' },
  tags: ['!autodocs'],
  render: Console.render,
};
