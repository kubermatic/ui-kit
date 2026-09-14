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
'use client';

import { Collapsible } from '@base-ui/react/collapsible';
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react';

import { useMediaQuery } from '../../hooks/use-media-query.js';
import { cn } from '../../lib/utils.js';
import { Drawer, DrawerContent, DrawerTitle } from './drawer.js';
import { Logo } from './brand.js';
import { Spinner } from './spinner.js';
import { Tooltip } from './tooltip.js';

/* ------------------------------------------------------------------ state */

export type SidebarState = 'expanded' | 'collapsed';

export interface SidebarContextValue {
  state: SidebarState;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
  /** True below the provider's breakpoint, where the sidebar becomes a drawer. */
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * The sidebar's state.
 *
 * Throws without a provider, unlike `useBrand`. A `SidebarMenuButton` that
 * cannot see the state renders its label when the rail is collapsed and
 * overflows it — a silent visual bug rather than a missing string, so it is
 * better to fail loudly.
 */
export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used inside a <SidebarProvider>.');
  }
  return context;
}

const STORAGE_PREFIX = 'kubermatic-ui-kit:sidebar:';

/*
 * The persisted collapse state, as an external store — the same shape
 * `use-theme.tsx` uses, and for the same reason.
 *
 * Reading localStorage in a `useState` initialiser is the usual shortcut and it
 * is wrong under SSR: the server renders `defaultCollapsed` while the client's
 * hydration render returns the stored value, so the rail's width differs
 * between the two and React replaces the markup. `useSyncExternalStore` takes
 * an explicit server snapshot, and subscribing means a second tab that
 * collapses the sidebar collapses it here too.
 */
const storageListeners = new Set<() => void>();

function subscribeToStored(onChange: () => void): () => void {
  storageListeners.add(onChange);
  // `storage` fires only in *other* tabs, which is the cross-tab case.
  // Same-tab writes notify through the set above.
  window.addEventListener('storage', onChange);
  return () => {
    storageListeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** Used when persistence is off, so the subscription is inert. */
const subscribeToNothing = () => () => {};

/** Storage access, wrapped: Safari private mode and sandboxed iframes throw. */
function readStored(key: string): boolean | null {
  try {
    const value = window.localStorage.getItem(STORAGE_PREFIX + key);
    return value === null ? null : value === 'collapsed';
  } catch {
    return null;
  }
}

function writeStored(key: string, collapsed: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, collapsed ? 'collapsed' : 'expanded');
  } catch {
    /* Best-effort, like the theme: the preference applies for this session and
     * simply is not remembered. */
  }
  for (const listener of storageListeners) listener();
}

export interface SidebarProviderProps {
  children: ReactNode;
  /** Uncontrolled initial state. */
  defaultCollapsed?: boolean;
  /** Controlled state. Pass with `onCollapsedChange`. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Remembers the choice under this key. Omit and it resets on reload.
   *
   * `localStorage` rather than a cookie, which is what shadcn's sidebar uses:
   * a cookie is readable during SSR and so avoids a first-paint flash, but it
   * is also sent on every request to the API, and this preference is nobody's
   * business but the browser's. The flash is avoided instead by rendering the
   * server's default and only reading storage in an effect — the rail
   * animates, which is cheap, rather than the whole layout reflowing.
   */
  persistKey?: string;
  /** Below this width the sidebar becomes a drawer. Default `768px`. */
  mobileBreakpoint?: string;
}

/**
 * SidebarProvider — owns collapsed and mobile-open state.
 *
 * Mount it above both the sidebar *and* the header: the header holds the
 * trigger on mobile, and it needs the same state the sidebar does. `AppShell`
 * does this for you.
 */
export function SidebarProvider({
  children,
  defaultCollapsed = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  persistKey,
  mobileBreakpoint = '768px',
}: SidebarProviderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint})`);

  /*
   * `null` until the user touches the control, so the stored preference wins
   * on first render and the local choice wins afterwards. That ordering is
   * also what keeps the control working when storage throws: the write is
   * best-effort, but this is not.
   */
  const [session, setSession] = useState<boolean | null>(null);

  const stored = useSyncExternalStore(
    persistKey ? subscribeToStored : subscribeToNothing,
    () => (persistKey ? readStored(persistKey) : null),
    // Nothing is stored as far as the server knows.
    () => null,
  );

  const isControlled = collapsedProp !== undefined;
  const collapsed = isControlled ? collapsedProp : (session ?? stored ?? defaultCollapsed);

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setSession(next);
        if (persistKey) writeStored(persistKey, next);
      }
      onCollapsedChange?.(next);
    },
    [isControlled, persistKey, onCollapsedChange],
  );

  const value = useMemo<SidebarContextValue>(
    () => ({
      state: collapsed ? 'collapsed' : 'expanded',
      collapsed,
      setCollapsed,
      toggle: () => setCollapsed(!collapsed),
      isMobile,
      mobileOpen,
      setMobileOpen,
    }),
    [collapsed, setCollapsed, isMobile, mobileOpen],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

/* ---------------------------------------------------------------- shell */

export interface SidebarProps extends ComponentProps<'div'> {
  /**
   * `icon` shrinks to a rail of icons; `none` is always expanded, for a
   * product that does not want the affordance.
   */
  collapsible?: 'icon' | 'none';
  side?: 'left' | 'right';
  /** Width when expanded. */
  width?: string;
  /** Width of the collapsed rail. */
  iconWidth?: string;
  /** Accessible name for the `<nav>`. */
  label?: string;
}

/**
 * Sidebar — the primary navigation column.
 *
 * A `<nav>` with an accessible name, because "Primary" and "Secondary" is how
 * a screen-reader user tells two navigation landmarks apart. Both products
 * render a bare `<aside>` or a `<div>`.
 *
 * Below the breakpoint it becomes a `Drawer`, which brings the focus trap and
 * the escape handling with it — one product's sidebar simply stays 224px wide
 * on a phone and eats half the viewport.
 *
 * The widths are CSS custom properties on the element rather than Tailwind
 * classes, so `AppShell` can reserve exactly the same space for the content
 * column without the two numbers being written down twice.
 */
export function Sidebar({
  collapsible = 'icon',
  side = 'left',
  width = '16rem',
  iconWidth = '3.5rem',
  label = 'Primary',
  className,
  children,
  ...props
}: SidebarProps) {
  const { collapsed, isMobile, mobileOpen, setMobileOpen } = useSidebar();
  const effectivelyCollapsed = collapsible === 'icon' && collapsed;

  const body = (
    <nav
      data-slot="sidebar"
      data-state={effectivelyCollapsed ? 'collapsed' : 'expanded'}
      data-side={side}
      aria-label={label}
      /*
       * `bg-background`, not `bg-muted`. A recessed rail looks nicer, and it
       * takes every foreground inside the sidebar outside the measured token
       * pairs: `--muted` is only ever measured against `--muted-foreground`,
       * so the brand wordmark's `text-heading` on it comes to 3.3:1 on the
       * dark palette — which is what the axe run reported the first time this
       * was written the other way. The rail is distinguished by its border
       * instead, and every colour in it is a pair CI already checks.
       *
       * A product that wants a tinted rail can pass `className="bg-muted"`
       * and owns re-measuring what sits on it.
       */
      className={cn(
        'group/sidebar flex h-full min-h-0 flex-col bg-background text-foreground',
        side === 'left' ? 'border-r border-border' : 'border-l border-border',
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  );

  if (isMobile) {
    return (
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent side={side} className="w-[var(--sidebar-width)] p-0 sm:max-w-none">
          {/* A drawer must be labelled. Visually hidden because the sidebar
              header already shows the brand. */}
          <DrawerTitle className="sr-only">{label} navigation</DrawerTitle>
          <div style={{ ['--sidebar-width' as string]: width }} className="h-full">
            {body}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div
      data-slot="sidebar-container"
      style={{
        ['--sidebar-width' as string]: width,
        ['--sidebar-width-icon' as string]: iconWidth,
      }}
      className={cn(
        'h-full shrink-0 transition-[width] duration-200 ease-out',
        effectivelyCollapsed ? 'w-[var(--sidebar-width-icon)]' : 'w-[var(--sidebar-width)]',
      )}
    >
      {body}
    </div>
  );
}

export function SidebarHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        'flex h-14 shrink-0 items-center gap-2 border-b border-border px-3',
        'group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn('flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto py-2', className)}
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn('flex shrink-0 flex-col gap-2 border-t border-border p-2', className)}
      {...props}
    />
  );
}

export function SidebarSeparator({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-separator"
      role="presentation"
      className={cn('mx-2 h-px shrink-0 bg-border', className)}
      {...props}
    />
  );
}

/**
 * SidebarBrand — the logo in the header, with the mark swapped in when the
 * rail is collapsed. The lockup would otherwise be clipped to its left 3.5rem.
 */
export function SidebarBrand({ className, ...props }: ComponentProps<'div'>) {
  const { collapsed, isMobile } = useSidebar();
  const showMark = collapsed && !isMobile;

  return (
    <div
      data-slot="sidebar-brand"
      className={cn('flex min-w-0 items-center', className)}
      {...props}
    >
      <Logo variant={showMark ? 'mark' : 'full'} />
    </div>
  );
}

/* ----------------------------------------------------------------- groups */

export function SidebarGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn('flex w-full min-w-0 flex-col px-2', className)}
      {...props}
    />
  );
}

/**
 * A group heading. Hidden when the rail is collapsed — a truncated section
 * label is noise, and the icons are the affordance at that width.
 *
 * `hidden` rather than `sr-only`, because it is decorative structure: the
 * items below it are individually labelled, so removing it costs nothing to a
 * screen reader and keeps the announcement short.
 */
export function SidebarGroupLabel({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        'flex h-8 shrink-0 items-center px-2 font-sans text-xs font-medium text-muted-foreground',
        'group-data-[state=collapsed]/sidebar:hidden',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="sidebar-group-content" className={cn('w-full min-w-0', className)} {...props} />
  );
}

export function SidebarMenu({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn('flex w-full min-w-0 flex-col gap-0.5', className)}
      {...props}
    />
  );
}

export function SidebarMenuItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  );
}

export function SidebarMenuSub({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn(
        'ml-4 flex min-w-0 flex-col gap-0.5 border-l border-border py-0.5 pl-2',
        'group-data-[state=collapsed]/sidebar:hidden',
        className,
      )}
      {...props}
    />
  );
}

export const SidebarMenuSubItem = SidebarMenuItem;

/* ----------------------------------------------------------------- button */

export interface SidebarMenuButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  isActive?: boolean;
  /**
   * Label shown in a tooltip when the rail is collapsed. Defaults to the
   * button's text content when that is a plain string.
   */
  tooltip?: string;
  /**
   * Replaces the `<button>` — pass the router's link for anything that
   * navigates, which is most of a sidebar.
   *
   *   <SidebarMenuButton render={<Link href="/secrets" />} …>
   */
  render?: ReactElement<{ className?: string; children?: ReactNode }>;
  /** Icon, always visible. */
  icon?: ReactNode;
  /** Right-hand slot — a count, a status dot. Hidden when collapsed. */
  badge?: ReactNode;
  children?: ReactNode;
}

/**
 * SidebarMenuButton — one navigation row.
 *
 * Three things it gets right that hand-rolled sidebars usually do not:
 *
 * 1. **`aria-current="page"` when active.** A left border and a background
 *    change say "you are here" to someone who can see it. This says it to
 *    everyone. Neither product sets it.
 * 2. **A real label when collapsed.** The text is `sr-only`, not removed, so
 *    the button keeps its accessible name at rail width. The tooltip is
 *    *additional* — a tooltip alone is unreachable by touch and is not
 *    announced when focus arrives by other means, which is the trap in
 *    labelling icon buttons this way.
 * 3. **A disabled item is a disabled control**, not a link to `/` with
 *    `pointer-events: none`, which is still focusable and still activatable
 *    by Enter.
 */
export function SidebarMenuButton({
  isActive = false,
  tooltip,
  render,
  icon,
  badge,
  className,
  children,
  disabled,
  ...props
}: SidebarMenuButtonProps) {
  const { collapsed, isMobile } = useSidebar();
  const showLabelsOnly = collapsed && !isMobile;

  const classes = cn(
    'flex h-9 w-full items-center gap-2.5 overflow-hidden rounded-md px-2 text-left',
    'font-sans text-sm transition-colors outline-none',
    'focus-visible:ring-[3px] focus-visible:ring-ring/50',
    "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    isActive
      ? 'bg-primary font-medium text-primary-foreground'
      : 'text-foreground hover:bg-secondary hover:text-secondary-foreground',
    disabled && 'pointer-events-none opacity-50',
    showLabelsOnly && 'justify-center px-0',
    className,
  );

  const inner = (
    <>
      {icon}
      <span className={cn('flex-1 truncate', showLabelsOnly && 'sr-only')}>{children}</span>
      {badge && !showLabelsOnly ? (
        <span className="ml-auto shrink-0 text-xs text-muted-foreground">{badge}</span>
      ) : null}
    </>
  );

  const shared = {
    'data-slot': 'sidebar-menu-button',
    'data-active': isActive || undefined,
    'aria-current': isActive ? ('page' as const) : undefined,
    className: classes,
  };

  const element =
    render && !disabled ? (
      cloneElement(render, { ...shared, className: cn(render.props.className, classes) }, inner)
    ) : (
      <button type="button" disabled={disabled} {...shared} {...props}>
        {inner}
      </button>
    );

  const label = tooltip ?? (typeof children === 'string' ? children : undefined);

  if (showLabelsOnly && label) {
    return (
      <Tooltip content={label} side="right">
        {element}
      </Tooltip>
    );
  }

  return element;
}

/* ---------------------------------------------------------------- trigger */

export interface SidebarTriggerProps extends ComponentProps<'button'> {
  /** Labels, in `[expand, collapse]` order. */
  labels?: readonly [string, string];
}

/**
 * SidebarTrigger — collapses the rail, or opens the drawer on mobile.
 *
 * The accessible name changes with the state ("Collapse sidebar" /
 * "Expand sidebar") rather than staying a generic "Toggle": a toggle whose
 * name does not say what it will do leaves a screen-reader user to press it
 * and find out.
 */
export function SidebarTrigger({
  className,
  labels = ['Expand sidebar', 'Collapse sidebar'],
  onClick,
  ...props
}: SidebarTriggerProps) {
  const { collapsed, toggle, isMobile, mobileOpen, setMobileOpen } = useSidebar();

  const open = isMobile ? mobileOpen : !collapsed;
  const [expandLabel, collapseLabel] = labels;

  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      aria-expanded={open}
      aria-label={open ? collapseLabel : expandLabel}
      onClick={(event) => {
        onClick?.(event);
        if (isMobile) setMobileOpen(!mobileOpen);
        else toggle();
      }}
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-md',
        'text-muted-foreground transition-colors outline-none',
        'hover:bg-secondary hover:text-secondary-foreground',
        'focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    >
      {open ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
    </button>
  );
}

/* -------------------------------------------------------------- nav data */

export interface NavItem {
  label: string;
  icon?: ReactNode;
  /** Plain destination. Ignored when `render` is set. */
  href?: string;
  /** The router's link element — `<Link href="…" />`, `<NavLink to="…" />`. */
  render?: ReactElement<{ className?: string; children?: ReactNode }>;
  isActive?: boolean;
  disabled?: boolean;
  /** Explains the disabled state in a tooltip. */
  disabledReason?: string;
  /** Count or status shown at the right-hand edge. */
  badge?: ReactNode;
  /** Nested items. */
  items?: readonly NavItem[];
  /**
   * Renders nested items behind a disclosure rather than always expanded.
   * Starts open when the item or any of its children is active.
   */
  collapsible?: boolean;
}

export interface NavSection {
  /** Heading above the group. Omit for an unlabelled group. */
  label?: string;
  items: readonly NavItem[];
  /** Shows a spinner in place of the items — a section whose data is loading. */
  loading?: boolean;
  /** Shown when `items` is empty. */
  emptyMessage?: string;
}

export interface SidebarNavProps {
  /** Groups rendered at the top. */
  sections: readonly NavSection[];
  /**
   * Groups pinned to the bottom, above the footer. One product's nav has a
   * group down there and the other's does not, so it is a separate list than a
   * flag on every section.
   */
  footerSections?: readonly NavSection[];
  className?: string;
}

/**
 * SidebarNav — the whole navigation tree from data.
 *
 * Both products already describe their navigation as an array and then
 * hand-render it.
 * This takes the array. Anything that does not fit — a nav item that is a
 * search box — composes `SidebarMenu` and friends directly.
 */
export function SidebarNav({ sections, footerSections, className }: SidebarNavProps) {
  return (
    <>
      <SidebarContent className={className}>
        {sections.map((section, index) => (
          <NavGroup key={section.label ?? index} section={section} />
        ))}
      </SidebarContent>
      {footerSections?.length ? (
        <div className="shrink-0 border-t border-border py-2">
          {footerSections.map((section, index) => (
            <NavGroup key={section.label ?? index} section={section} />
          ))}
        </div>
      ) : null}
    </>
  );
}

function NavGroup({ section }: { section: NavSection }) {
  const { collapsed, isMobile } = useSidebar();
  const showLabelsOnly = collapsed && !isMobile;

  return (
    <SidebarGroup>
      {section.label ? <SidebarGroupLabel>{section.label}</SidebarGroupLabel> : null}
      <SidebarGroupContent>
        {section.loading ? (
          <div className="flex justify-center py-2">
            <Spinner size="sm" label={`Loading ${section.label ?? 'navigation'}`} />
          </div>
        ) : section.items.length === 0 ? (
          showLabelsOnly ? null : (
            <p className="px-2 py-1 font-sans text-xs text-muted-foreground">
              {section.emptyMessage ?? 'Nothing here.'}
            </p>
          )
        ) : (
          <SidebarMenu>
            {section.items.map((item) => (
              <NavEntry key={item.label} item={item} />
            ))}
          </SidebarMenu>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

/** True when the item or anything under it is the current page. */
function containsActive(item: NavItem): boolean {
  return Boolean(item.isActive) || (item.items?.some(containsActive) ?? false);
}

function NavEntry({ item }: { item: NavItem }) {
  const button = (
    <SidebarMenuButton
      isActive={item.isActive}
      disabled={item.disabled}
      tooltip={item.disabled ? (item.disabledReason ?? item.label) : item.label}
      render={item.render ?? (item.href ? <a href={item.href} /> : undefined)}
      icon={item.icon}
      badge={item.badge}
    >
      {item.label}
    </SidebarMenuButton>
  );

  if (!item.items?.length) {
    return <SidebarMenuItem>{button}</SidebarMenuItem>;
  }

  if (!item.collapsible) {
    return (
      <SidebarMenuItem>
        {button}
        <SidebarMenuSub>
          {item.items.map((child) => (
            <NavEntry key={child.label} item={child} />
          ))}
        </SidebarMenuSub>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible.Root defaultOpen={containsActive(item)}>
        <div className="flex items-center gap-0.5">
          {button}
          <Collapsible.Trigger
            aria-label={`Toggle ${item.label}`}
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-md',
              'text-muted-foreground transition-colors outline-none',
              'hover:bg-secondary hover:text-secondary-foreground',
              'focus-visible:ring-[3px] focus-visible:ring-ring/50',
              'group-data-[state=collapsed]/sidebar:hidden',
            )}
          >
            <ChevronDown className="size-4 transition-transform data-panel-open:rotate-180" />
          </Collapsible.Trigger>
        </div>
        <Collapsible.Panel className="overflow-hidden">
          <SidebarMenuSub>
            {item.items.map((child) => (
              <NavEntry key={child.label} item={child} />
            ))}
          </SidebarMenuSub>
        </Collapsible.Panel>
      </Collapsible.Root>
    </SidebarMenuItem>
  );
}
