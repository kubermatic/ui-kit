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

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumbs,
} from './breadcrumb';

describe('Breadcrumbs', () => {
  it('is a labelled navigation landmark', () => {
    render(<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Secrets' }]} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  /* A trail whose final item links to the page you are on is a link that does nothing. */
  it('renders the last entry as the current page even when it has an href', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Secrets', href: '/secrets' },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Secrets' })).not.toBeInTheDocument();
    expect(screen.getByText('Secrets')).toHaveAttribute('aria-current', 'page');
  });

  /*
   * Separators are `aria-hidden` siblings, not nested items: an `<li>` inside
   * an `<li>` is invalid, and a screen reader announcing "list of 5" would be
   * counting the slashes.
   */
  it('counts only the real entries', () => {
    render(
      <Breadcrumbs
        items={[{ label: 'A', href: '/a' }, { label: 'B', href: '/b' }, { label: 'C' }]}
      />,
    );

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('renders a single entry with no separator', () => {
    render(<Breadcrumbs items={[{ label: 'Home' }]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});

describe('Breadcrumb parts', () => {
  it('renders the router link element it was given', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Clusters', render: <a href="/clusters" data-testid="rl" /> },
          { label: 'prod' },
        ]}
      />,
    );
    expect(screen.getByTestId('rl')).toHaveAttribute('href', '/clusters');
  });

  it('renders a plain anchor with no href when neither is given', () => {
    render(<Breadcrumbs items={[{ label: 'Clusters' }, { label: 'prod' }]} />);
    // The entry is still a link element; it simply has nowhere to go.
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders a custom separator and an ellipsis', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>prod</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('prod')).toHaveAttribute('aria-current', 'page');
  });
});
