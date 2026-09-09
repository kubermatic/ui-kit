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
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BackButton, Page, PageContent, PageHeader, PageToolbar, Section } from './page';

describe('PageHeader', () => {
  /*
   * Exactly one `<h1>` per route. Both products currently emit either none —
   * the page title is a `<div>` with large text — or several, because each
   * card's title is an `<h2>` under no `<h1>`.
   */
  it('renders the title as the page heading', () => {
    render(<PageHeader title="Secrets" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Secrets' })).toBeInTheDocument();
  });

  it('can step down a level for a nested page', () => {
    render(<PageHeader title="Secrets" as="h2" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Secrets' })).toBeInTheDocument();
  });

  it('renders breadcrumbs, description, status and actions', () => {
    render(
      <PageHeader
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Secrets' }]}
        title="Secrets"
        description="In the selected namespace."
        status={<span>Healthy</span>}
        actions={<button type="button">New secret</button>}
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('In the selected namespace.')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New secret' })).toBeInTheDocument();
  });
});

describe('BackButton', () => {
  /*
   * One product's is always a button calling `navigate(-1)`, which cannot be
   * middle-clicked and goes somewhere unpredictable when the detail page was
   * opened from a bookmark.
   */
  it('is a link when it has a destination', () => {
    render(<BackButton label="Back to secrets" href="/secrets" />);
    expect(screen.getByRole('link', { name: 'Back to secrets' })).toHaveAttribute(
      'href',
      '/secrets',
    );
  });

  it('is a button when it goes back in history', async () => {
    const onClick = vi.fn();
    render(<BackButton label="Back" onClick={onClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('Section', () => {
  /*
   * A `<section>` with an accessible name is a region a screen reader can list
   * and jump between — which is how you skim a detail page with six panels.
   */
  it('is a region named by its own heading', () => {
    render(<Section title="Overview">body</Section>);

    const region = screen.getByRole('region', { name: 'Overview' });
    expect(region).toBeInTheDocument();
    expect(within(region).getByRole('heading', { level: 2, name: 'Overview' })).toBeInTheDocument();
  });

  it('takes a heading level, for nesting under another section', () => {
    render(
      <Section title="Conditions" as="h3">
        body
      </Section>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Conditions' })).toBeInTheDocument();
  });

  /*
   * An unlabelled `<section>` is not a region at all — it is skipped by the
   * landmark list, which is the right outcome for an untitled block. So the
   * labelling is conditional rather than always applied.
   */
  it('is not a landmark without a title', () => {
    render(<Section>body</Section>);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('renders its actions and description', () => {
    render(
      <Section
        title="Overview"
        description="What this resource is."
        actions={<button type="button">Edit</button>}
      >
        body
      </Section>,
    );
    expect(screen.getByText('What this resource is.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('drops the card surface when plain', () => {
    const { container } = render(
      <Section title="Overview" plain>
        body
      </Section>,
    );
    expect(container.querySelector('[data-slot="card"]')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Overview' })).toBeInTheDocument();
  });
});

describe('Page', () => {
  it('renders its parts', () => {
    render(
      <Page>
        <PageHeader title="Secrets" />
        <PageToolbar>filters</PageToolbar>
        <PageContent>content</PageContent>
      </Page>,
    );
    expect(screen.getByText('filters')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});

describe('BackButton with a router link', () => {
  it('renders the element it was given', () => {
    render(<BackButton label="Back" render={<a href="/router" data-testid="rl" />} />);
    expect(screen.getByTestId('rl')).toHaveAttribute('href', '/router');
  });
});
