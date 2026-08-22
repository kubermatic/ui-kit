import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, within } from 'storybook/test';
import {
  Boxes,
  HardDrive,
  LifeBuoy,
  MoreHorizontal,
  Network,
  Plus,
  Search,
  Server,
  Settings,
} from 'lucide-react';

import { Avatar, AvatarFallback } from './avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Separator } from './separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from './sidebar';

/**
 * The eight tokens this component owns. The catalogue in
 * `Foundations/Design Tokens` lists them, but nothing there renders them —
 * `bg-sidebar` and friends are used by this component alone, so the `TokenScale`
 * story below is the only place they are proven to resolve.
 */
const SIDEBAR_TOKENS = [
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const;

const WORKLOADS = [
  { name: 'Virtual machines', icon: Server, count: 12, active: true },
  { name: 'Volumes', icon: HardDrive, count: 8, active: false },
  { name: 'Networks', icon: Network, count: 3, active: false },
] as const;

type ShellProps = React.ComponentProps<typeof Sidebar> & {
  loading?: boolean;
};

/**
 * One shell reused by every story, so a change to the composition is reviewed
 * in all of them at once rather than drifting between copies.
 */
function AppShell({ loading = false, ...sidebarProps }: ShellProps) {
  return (
    <Sidebar {...sidebarProps}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="production-eu">
              <Boxes />
              <span>production-eu</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Hidden in icon mode by the group's own collapse rules. */}
        <div className="relative group-data-[collapsible=icon]:hidden">
          <Search className="text-sidebar-foreground/50 pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2" />
          <SidebarInput
            aria-label="Search resources"
            placeholder="Search"
            className="pl-8"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workloads</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Create workload">
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading
                ? Array.from({ length: 3 }, (_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                  ))
                : WORKLOADS.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        isActive={item.active}
                        tooltip={item.name}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                      {item.active && (
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="#" isActive>
                              <span>web-frontend-01</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="#">
                              <span>db-primary</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="#">
                              <span>batch-worker-07</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Cluster</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Nodes">
                  <Server />
                  <span>Nodes</span>
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover aria-label="Node actions">
                  <MoreHorizontal />
                </SidebarMenuAction>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Support">
              <LifeBuoy />
              <span>Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" tooltip="Anna Kern">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[0.625rem]">
                        AK
                      </AvatarFallback>
                    </Avatar>
                    <span>Anna Kern</span>
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent side="top" align="start" className="w-48">
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>API tokens</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function Page() {
  return (
    <SidebarInset>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">production-eu</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Virtual machines</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="text-muted-foreground p-6 text-sm">
        12 virtual machines in namespace default. Toggle the sidebar with the
        trigger above, the rail on its edge, or ⌘B.
      </div>
    </SidebarInset>
  );
}

const meta = {
  title: 'Primitives/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The full shell. `SidebarProvider` is mandatory — every part reads its context,
 * and it is also what supplies `--sidebar-width` and mounts the
 * `TooltipProvider` the collapsed labels need.
 *
 * The provider writes the open state to a `sidebar_state` cookie on every
 * toggle. Nothing reads it back here; a consuming app reads it server-side to
 * avoid a flash of the wrong state on first paint.
 */
export const Playground: Story = {
  render: () => (
    <SidebarProvider>
      <AppShell collapsible="icon" />
      <Page />
    </SidebarProvider>
  ),
};

/**
 * Collapsed to the icon rail — the state where the most CSS is doing work:
 * group labels collapse to zero height, badges and sub-menus hide, buttons
 * become square, and the labels move into tooltips. Hover a button to see one.
 */
export const CollapsedToIcon: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <AppShell collapsible="icon" />
      <Page />
    </SidebarProvider>
  ),
};

/** `offcanvas` is the default: the sidebar leaves entirely instead of shrinking. */
export const Offcanvas: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <AppShell />
      <Page />
    </SidebarProvider>
  ),
};

/**
 * `floating` detaches the panel from the window edge.
 *
 * Split from `inset` rather than shown beside it: each shell renders a `<main>`
 * and a breadcrumb `<nav>`, and two of either in one document is a real
 * landmark violation (`landmark-no-duplicate-main`, `landmark-unique`) that axe
 * fails the story for. The rule is right — a page has one main region — so the
 * fix is one shell per story, not an exemption.
 */
export const Floating: Story = {
  render: () => (
    <SidebarProvider>
      <AppShell variant="floating" collapsible="icon" />
      <Page />
    </SidebarProvider>
  ),
};

/**
 * `inset` changes the *page* as well as the panel: `SidebarInset` gains a
 * margin, a radius and a shadow, and the wrapper takes the sidebar background.
 * That is why it is worth its own story — the variant is not confined to the
 * sidebar.
 */
export const Inset: Story = {
  render: () => (
    <SidebarProvider>
      <AppShell variant="inset" collapsible="icon" />
      <Page />
    </SidebarProvider>
  ),
};

/** Right-hand placement mirrors the rail, the border and the collapse direction. */
export const RightSide: Story = {
  render: () => (
    <SidebarProvider>
      <Page />
      <AppShell side="right" collapsible="icon" />
    </SidebarProvider>
  ),
};

/**
 * `SidebarMenuSkeleton` randomises each row's width on mount so the placeholder
 * does not read as a suspiciously uniform block.
 */
export const Loading: Story = {
  render: () => (
    <SidebarProvider>
      <AppShell loading collapsible="icon" />
      <Page />
    </SidebarProvider>
  ),
};

/**
 * Below 768px the desktop panel is replaced entirely by a `Sheet` — a different
 * element, not a restyled one — so the trigger opens an overlay instead of
 * expanding in place.
 *
 * The viewport global is load-bearing rather than decorative: `useIsMobile`
 * reads `window.innerWidth`, and `@storybook/addon-vitest` applies the same
 * global with `page.viewport()` before the story renders. So the branch under
 * test here is genuinely the mobile one, and the play function below is what
 * proves it — without an assertion this story would silently render the desktop
 * branch if the viewport wiring ever regressed.
 *
 * The sheet starts closed (`openMobile` defaults to false), so the play function
 * also opens it; a story showing only a trigger would review nothing.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1' } },
  parameters: {
    viewport: {
      options: {
        mobile1: {
          name: 'Mobile',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
    },
  },
  render: () => (
    <SidebarProvider>
      <AppShell collapsible="icon" />
      <Page />
    </SidebarProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    // The desktop panel is `hidden md:block`, so at this width it must be absent
    // from the layout even though it is still in the tree.
    await expect(
      document.querySelector('[data-slot="sidebar-gap"]'),
    ).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', { name: /toggle sidebar/i }),
    );

    // `screen`, not `canvas` — the mobile sidebar is a portalled Sheet.
    const sheet = await screen.findByRole('dialog', { name: /sidebar/i });
    await expect(sheet).toHaveAttribute('data-mobile', 'true');
    await expect(within(sheet).getByText('production-eu')).toBeInTheDocument();
  },
};

/**
 * The proof that the `--sidebar-*` scale is wired.
 *
 * These eight tokens are consumed by this component and nothing else, so
 * without this guard a typo in `theme.css` would leave the catalogue in
 * `Foundations/Design Tokens` listing a token that no longer renders anywhere.
 *
 * The first assertion is the anti-vacuity one: an unresolved custom property
 * reads back as an empty string, and an empty string compared against an empty
 * string would let the rest pass while proving nothing. The background check
 * then closes the other half — a purged `bg-sidebar` utility computes to
 * transparent, which a token-only check would not notice.
 */
export const TokenScale: Story = {
  render: () => (
    <SidebarProvider>
      <AppShell collapsible="icon" />
      <Page />
    </SidebarProvider>
  ),
  play: async () => {
    const inner = document.querySelector('[data-slot="sidebar-inner"]');
    await expect(inner).not.toBeNull();

    const styles = getComputedStyle(inner as Element);

    for (const token of SIDEBAR_TOKENS) {
      await expect(styles.getPropertyValue(`--${token}`).trim()).not.toBe('');
    }

    // `bg-sidebar` resolved to a real colour rather than being purged.
    await expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(styles.backgroundColor).not.toBe('transparent');
  },
};
