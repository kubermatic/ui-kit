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

import { AppHeader } from './app-header';
import { BrandProvider } from './brand';
import { SidebarProvider } from './sidebar';

describe('AppHeader', () => {
  /* A `banner` landmark, so "jump to banner" works. */
  it('is a banner landmark', () => {
    render(
      <SidebarProvider>
        <AppHeader />
      </SidebarProvider>,
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders each slot', () => {
    render(
      <BrandProvider brand={{ name: 'Example Console' }}>
        <SidebarProvider>
          <AppHeader
            brand={<span>brand</span>}
            actions={<button type="button">Catalog</button>}
            user={<span>user</span>}
          >
            <span>breadcrumbs</span>
          </AppHeader>
        </SidebarProvider>
      </BrandProvider>,
    );

    expect(screen.getByText('brand')).toBeInTheDocument();
    expect(screen.getByText('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Catalog' })).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  /*
   * `mobile` is the default: on desktop the rail has its own trigger, and a
   * second control for the same thing in the header is one too many. The test
   * environment reports a desktop viewport.
   */
  it('hides the sidebar trigger on desktop by default', () => {
    render(
      <SidebarProvider>
        <AppHeader />
      </SidebarProvider>,
    );
    expect(screen.queryByRole('button', { name: /sidebar/i })).not.toBeInTheDocument();
  });

  it('can always show the sidebar trigger', () => {
    render(
      <SidebarProvider>
        <AppHeader sidebarTrigger="always" />
      </SidebarProvider>,
    );
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toBeInTheDocument();
  });

  /*
   * `useSidebar` throws without a provider, so the `never` case must not reach
   * it — a sign-in screen has a header and no sidebar.
   */
  it('works with no sidebar provider at all', () => {
    render(<AppHeader sidebarTrigger="never">content</AppHeader>);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
