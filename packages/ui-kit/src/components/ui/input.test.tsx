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
import { Search, X } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input';

describe('Input', () => {
  it('is a bare input when it has no adornments', () => {
    const { container } = render(<Input aria-label="Name" />);
    // No wrapper to fight with in a flex layout.
    expect(container.querySelector('[data-slot="input-wrapper"]')).not.toBeInTheDocument();
  });

  it('wraps and pads when given a leading adornment', () => {
    const { container } = render(<Input aria-label="Search" startAdornment={<Search />} />);

    expect(container.querySelector('[data-slot="input-wrapper"]')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toHaveClass('pl-9');
  });

  it('hides a leading adornment from assistive technology', () => {
    const { container } = render(<Input aria-label="Search" startAdornment={<Search />} />);
    expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('pads for a trailing adornment', () => {
    render(<Input aria-label="Filter" endAdornment={<X />} />);
    expect(screen.getByLabelText('Filter')).toHaveClass('pr-9');
  });

  it('takes typing', async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Name'), 'abc');
    expect(screen.getByLabelText('Name')).toHaveValue('abc');
    expect(onChange).toHaveBeenCalled();
  });

  it('merges an incoming className over the variant', () => {
    render(<Input aria-label="Name" className="h-20" />);
    expect(screen.getByLabelText('Name')).toHaveClass('h-20');
  });

  it('takes a size', () => {
    render(<Input aria-label="Name" size="sm" />);
    expect(screen.getByLabelText('Name')).toHaveClass('h-8');
  });
});
