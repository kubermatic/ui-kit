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
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarNav,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  type NavSection,
} from './sidebar';

const wrap = (children: ReactNode, props: Record<string, unknown> = {}) =>
  render(<SidebarProvider {...props}>{children}</SidebarProvider>);

afterEach(() => {
  window.localStorage.clear();
});

describe('useSidebar', () => {
  /*
   * Unlike `useBrand`, which has a usable default: a menu button that cannot
   * see the state renders its label at rail width and overflows it, which is a
   * silent visual bug rather than a missing string.
   */
  it('refuses to work outside a provider', () => {
    expect(() => renderHook(() => useSidebar())).toThrowError(/SidebarProvider/);
  });
});

describe('SidebarTrigger', () => {
  /*
   * A toggle whose name does not say what it will do leaves a screen-reader
   * user to press it and find out.
   */
  it('names itself after what it will do', async () => {
    wrap(<SidebarTrigger />);

    const trigger = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(trigger);

    const collapsed = screen.getByRole('button', { name: 'Expand sidebar' });
    expect(collapsed).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('SidebarProvider', () => {
  it('honours defaultCollapsed', () => {
    wrap(<SidebarTrigger />, { defaultCollapsed: true });
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();
  });

  it('reports state through the context', async () => {
    function Probe() {
      const { state } = useSidebar();
      return <span data-testid="state">{state}</span>;
    }
    wrap(
      <>
        <SidebarTrigger />
        <Probe />
      </>,
    );

    expect(screen.getByTestId('state')).toHaveTextContent('expanded');
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });

  it('lets the consumer own the state', async () => {
    const onCollapsedChange = vi.fn();
    wrap(<SidebarTrigger />, { collapsed: false, onCollapsedChange });

    await userEvent.click(screen.getByRole('button'));

    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    // Controlled: the prop did not change, so neither did the button.
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toBeInTheDocument();
  });

  it('persists the choice under the given key', async () => {
    wrap(<SidebarTrigger />, { persistKey: 'demo' });
    await userEvent.click(screen.getByRole('button'));

    expect(window.localStorage.getItem('kubermatic-ui-kit:sidebar:demo')).toBe('collapsed');
  });

  it('reads a stored choice back', () => {
    window.localStorage.setItem('kubermatic-ui-kit:sidebar:demo', 'collapsed');
    wrap(<SidebarTrigger />, { persistKey: 'demo' });

    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();
  });

  it('keeps working when storage is unavailable', async () => {
    const getItem = vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const setItem = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    wrap(<SidebarTrigger />, { persistKey: 'demo' });
    await userEvent.click(screen.getByRole('button'));

    // Not remembered, but it still collapsed.
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();

    getItem.mockRestore();
    setItem.mockRestore();
  });
});

describe('Sidebar', () => {
  /* "Primary" and "Secondary" is how a screen-reader user tells two
     navigation landmarks apart. */
  it('is a named navigation landmark', () => {
    wrap(<Sidebar label="Primary">nav</Sidebar>);
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('reports its collapsed state on the element', async () => {
    wrap(
      <>
        <SidebarTrigger />
        <Sidebar>nav</Sidebar>
      </>,
    );

    expect(screen.getByRole('navigation')).toHaveAttribute('data-state', 'expanded');
    await userEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(screen.getByRole('navigation')).toHaveAttribute('data-state', 'collapsed');
  });

  it('stays expanded when collapsing is turned off', async () => {
    wrap(
      <>
        <SidebarTrigger />
        <Sidebar collapsible="none">nav</Sidebar>
      </>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(screen.getByRole('navigation')).toHaveAttribute('data-state', 'expanded');
  });
});

describe('SidebarMenuButton', () => {
  it('marks the active item as the current page', () => {
    wrap(
      <Sidebar>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive>Secrets</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>,
    );

    expect(screen.getByRole('button', { name: 'Secrets' })).toHaveAttribute('aria-current', 'page');
  });

  it('leaves inactive items without aria-current', () => {
    wrap(
      <Sidebar>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Secrets</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>,
    );

    expect(screen.getByRole('button', { name: 'Secrets' })).not.toHaveAttribute('aria-current');
  });

  /*
   * The label is hidden, not removed, when the rail collapses — so the button
   * keeps its accessible name at icon width. A tooltip alone would not do: it
   * is unreachable by touch and is not announced when focus arrives by other
   * means.
   */
  it('keeps its accessible name when collapsed', async () => {
    wrap(
      <>
        <SidebarTrigger />
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Secrets</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

    const item = screen.getByRole('button', { name: 'Secrets' });
    expect(item).toBeInTheDocument();
    expect(screen.getByText('Secrets')).toHaveClass('sr-only');
  });

  /*
   * One product renders a disabled nav item as a link to `/` with
   * `pointer-events: none`, which is still focusable and still activatable by
   * Enter.
   */
  it('renders a disabled item as a disabled button, not a dead link', () => {
    wrap(
      <Sidebar>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled render={<a href="/nope" />}>
              Blueprints
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>,
    );

    const item = screen.getByRole('button', { name: 'Blueprints' });
    expect(item).toBeDisabled();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders an enabled item as the link it was given', () => {
    wrap(
      <Sidebar>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<a href="/secrets" />}>Secrets</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>,
    );

    expect(screen.getByRole('link', { name: 'Secrets' })).toHaveAttribute('href', '/secrets');
  });
});

describe('SidebarNav', () => {
  const sections: NavSection[] = [
    {
      label: 'Resources',
      items: [
        { label: 'Secrets', href: '/secrets', isActive: true },
        { label: 'Stores', href: '/stores' },
      ],
    },
  ];

  it('renders a section from data', () => {
    wrap(
      <Sidebar>
        <SidebarNav sections={sections} />
      </Sidebar>,
    );

    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Secrets' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Stores' })).not.toHaveAttribute('aria-current');
  });

  it('announces a loading section instead of rendering nothing', () => {
    wrap(
      <Sidebar>
        <SidebarNav sections={[{ label: 'Services', items: [], loading: true }]} />
      </Sidebar>,
    );

    /*
     * Asserted on the content rather than the accessible name: `status` is not
     * a name-from-content role, so the label is announced by the live region
     * updating, not by the element being named.
     */
    expect(screen.getByRole('status')).toHaveTextContent('Loading Services');
  });

  it('explains an empty section', () => {
    wrap(
      <Sidebar>
        <SidebarNav
          sections={[{ label: 'Services', items: [], emptyMessage: 'No services yet.' }]}
        />
      </Sidebar>,
    );

    expect(screen.getByText('No services yet.')).toBeInTheDocument();
  });

  it('renders nested items', () => {
    wrap(
      <Sidebar>
        <SidebarNav
          sections={[
            {
              items: [
                {
                  label: 'Services',
                  href: '/services',
                  items: [{ label: 'Postgres', href: '/services/pg' }],
                },
              ],
            },
          ]}
        />
      </Sidebar>,
    );

    expect(screen.getByRole('link', { name: 'Postgres' })).toBeInTheDocument();
  });

  it('puts footer sections after the main ones', () => {
    wrap(
      <Sidebar>
        <SidebarNav
          sections={[{ items: [{ label: 'Secrets', href: '/s' }] }]}
          footerSections={[{ items: [{ label: 'Settings', href: '/settings' }] }]}
        />
      </Sidebar>,
    );

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual(['Secrets', 'Settings']);
  });
});
