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
import { describe, expect, it, vi } from 'vitest';

import { DetailPage, type DetailTab } from './detail-page';

const TABS: DetailTab[] = [
  { value: 'overview', label: 'Overview', content: <p>overview body</p> },
  { value: 'yaml', label: 'YAML', content: <p>yaml body</p> },
];

describe('DetailPage', () => {
  it('renders the resource name as the page heading', () => {
    render(<DetailPage title="db-credentials" />);
    expect(screen.getByRole('heading', { level: 1, name: 'db-credentials' })).toBeInTheDocument();
  });

  /*
   * One product's `DetailTabs` is a row of `<button>`s with an `onChange`:
   * no tablist, no arrow keys, and no `aria-controls` linking a tab to its
   * panel.
   */
  it('renders real tabs wired to their panels', () => {
    render(<DetailPage title="db-credentials" tabs={TABS} />);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('overview body');
  });

  it('switches panel when a tab is chosen', async () => {
    render(<DetailPage title="db-credentials" tabs={TABS} />);

    await userEvent.click(screen.getByRole('tab', { name: 'YAML' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('yaml body');
  });

  /* Controlled, so the tab can live in the URL and survive a reload. */
  it('can be driven from outside', async () => {
    const onTabChange = vi.fn();
    render(<DetailPage title="x" tabs={TABS} tab="yaml" onTabChange={onTabChange} />);

    expect(screen.getByRole('tabpanel')).toHaveTextContent('yaml body');

    await userEvent.click(screen.getByRole('tab', { name: 'Overview' }));
    expect(onTabChange).toHaveBeenCalledWith('overview');
  });

  it('starts on the requested tab', () => {
    render(<DetailPage title="x" tabs={TABS} defaultTab="yaml" />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('yaml body');
  });

  it('renders plain children with no tabs', () => {
    render(<DetailPage title="x">just a body</DetailPage>);
    expect(screen.getByText('just a body')).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  describe('states', () => {
    it('keeps the header while the body loads', () => {
      render(<DetailPage title="db-credentials" tabs={TABS} loading />);

      expect(screen.getByRole('heading', { name: 'db-credentials' })).toBeInTheDocument();
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });

    it('shows an error with a retry', async () => {
      const onRetry = vi.fn();
      render(<DetailPage title="x" error={new Error('gateway timeout')} onRetry={onRetry} />);

      expect(screen.getByText('gateway timeout')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
      expect(onRetry).toHaveBeenCalledOnce();
    });

    /*
     * A 404 on a detail page is a normal outcome — someone deleted it, or the
     * link is stale — and it needs a way back, not a retry that will fail
     * again. That is why it is a separate prop from `error`.
     */
    it('offers a way out of a not-found page instead of a retry', () => {
      render(
        <DetailPage
          title="x"
          notFound
          onRetry={vi.fn()}
          back={{ label: 'Back to secrets', href: '/secrets' }}
        />,
      );

      expect(screen.getByText('Not found')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: 'Back to secrets' })).not.toHaveLength(0);
    });

    it('prefers not-found over error', () => {
      render(<DetailPage title="x" notFound error={new Error('boom')} />);
      expect(screen.getByText('Not found')).toBeInTheDocument();
      expect(screen.queryByText('boom')).not.toBeInTheDocument();
    });
  });
});
