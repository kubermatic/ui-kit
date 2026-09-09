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
import { Search } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders the title, description and action', () => {
    render(
      <EmptyState
        icon={<Search />}
        title="No secrets yet"
        description="Create one to get started."
        action={<button type="button">New secret</button>}
      />,
    );

    expect(screen.getByText('No secrets yet')).toBeInTheDocument();
    expect(screen.getByText('Create one to get started.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New secret' })).toBeInTheDocument();
  });

  /*
   * The title is a `<p>`, not a heading: an empty list sits inside a page that
   * already has an `<h1>`, and "No secrets yet" is not a section of the
   * document — an `<h2>` here puts a phantom entry in the outline.
   */
  it('emits no heading', () => {
    render(<EmptyState title="No secrets yet" />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('hides the decorative icon', () => {
    const { container } = render(<EmptyState icon={<Search />} title="Nothing" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('takes a dashed placeholder frame for a whole empty page', () => {
    const { container } = render(<EmptyState title="Nothing" variant="placeholder" />);
    expect(container.querySelector('[data-slot="empty-state"]')).toHaveClass('border-dashed');
  });
});
