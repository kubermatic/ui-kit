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
import { describe, expect, it } from 'vitest';

import { AppShell } from './app-shell';

describe('AppShell', () => {
  /*
   * A page needs exactly one main landmark. Neither product has one — both
   * nest the content in divs, so "jump to main content" has nothing to jump to
   * and one product's skip link points at a `<div>`.
   */
  it('provides one main landmark, with an id', () => {
    render(<AppShell>content</AppShell>);

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
    expect(main).toHaveTextContent('content');
  });

  /*
   * Without `tabIndex={-1}` the browser scrolls to the target but leaves focus
   * where it was, so the next Tab starts from the top again.
   */
  it('makes the main region a real focus target for the skip link', () => {
    render(<AppShell>content</AppShell>);

    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });

  it('keeps the skip link pointed at a renamed main region', () => {
    render(<AppShell mainId="dashboard">content</AppShell>);

    expect(screen.getByRole('main')).toHaveAttribute('id', 'dashboard');
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#dashboard',
    );
  });

  it('can omit the skip link', () => {
    render(<AppShell skipLink={false}>content</AppShell>);
    expect(screen.queryByRole('link', { name: 'Skip to content' })).not.toBeInTheDocument();
  });

  /*
   * The one prop that had to exist: both products are "a sidebar, a header and
   * a content area" and they disagree about which of the two spans the corner.
   */
  describe('layout', () => {
    const slots = {
      sidebar: <div data-testid="sidebar">nav</div>,
      header: <div data-testid="header">bar</div>,
      footer: <div data-testid="footer">foot</div>,
    };

    it('puts the sidebar before the header in sidebar-first', () => {
      const { container } = render(
        <AppShell layout="sidebar-first" {...slots}>
          content
        </AppShell>,
      );

      const shell = container.querySelector('[data-slot="app-shell"]');
      expect(shell).toHaveAttribute('data-layout', 'sidebar-first');
      // The sidebar is a sibling of the column holding the header.
      expect(screen.getByTestId('sidebar').parentElement).toBe(shell);
      expect(screen.getByTestId('header').parentElement).not.toBe(shell);
    });

    it('puts the header above the sidebar in header-first', () => {
      const { container } = render(
        <AppShell layout="header-first" {...slots}>
          content
        </AppShell>,
      );

      const shell = container.querySelector('[data-slot="app-shell"]');
      expect(shell).toHaveAttribute('data-layout', 'header-first');
      expect(screen.getByTestId('header').parentElement).toBe(shell);
      expect(screen.getByTestId('sidebar').parentElement).not.toBe(shell);
    });

    it('renders every slot in both layouts', () => {
      for (const layout of ['sidebar-first', 'header-first'] as const) {
        const { unmount } = render(
          <AppShell layout={layout} {...slots}>
            content
          </AppShell>,
        );
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        unmount();
      }
    });
  });

  /*
   * Turning the providers off is for an app that needs the sidebar state
   * further up — a keyboard shortcut, a persisted layout. The frame must still
   * render.
   */
  it('renders without mounting its own providers', () => {
    render(
      <AppShell providers={false} skipLink={false}>
        content
      </AppShell>,
    );
    expect(screen.getByRole('main')).toHaveTextContent('content');
  });
});
