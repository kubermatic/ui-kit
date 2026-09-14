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

import {
  FilterSelect,
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

async function openListbox(name: string | RegExp) {
  screen.getByRole('combobox', { name }).focus();
  await userEvent.keyboard('{Enter}');
}

describe('Select', () => {
  it('shows the placeholder until something is chosen', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Namespace">
          <SelectValue placeholder="All namespaces" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">default</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByText('All namespaces')).toBeInTheDocument();
  });

  it('picks an option', async () => {
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger aria-label="Namespace">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">default</SelectItem>
          <SelectItem value="kube-system">kube-system</SelectItem>
        </SelectContent>
      </Select>,
    );

    await openListbox('Namespace');
    await userEvent.click(screen.getByRole('option', { name: 'kube-system' }));
    expect(onValueChange).toHaveBeenCalledWith('kube-system', expect.anything());
  });
});

describe('FilterSelect', () => {
  const options = ['All', 'Synced', 'Degraded'];

  /*
   * The inline label names the control, rather than just sitting next to it —
   * otherwise a toolbar of four filters announces "All, All, Synced, All".
   */
  it('names the control with its inline label', () => {
    render(
      <FilterSelect label="Status" value="Synced" onValueChange={vi.fn()} options={options} />,
    );

    expect(screen.getByRole('combobox', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByText('Synced')).toBeInTheDocument();
  });

  it('reports the new value as a plain string', async () => {
    const onValueChange = vi.fn();
    render(
      <FilterSelect label="Status" value="All" onValueChange={onValueChange} options={options} />,
    );

    await openListbox('Status');
    await userEvent.click(screen.getByRole('option', { name: 'Degraded' }));
    expect(onValueChange).toHaveBeenCalledWith('Degraded');
  });

  it('takes value/label pairs when the two differ', () => {
    render(
      <FilterSelect
        label="Status"
        value="degraded"
        onValueChange={vi.fn()}
        options={[{ value: 'degraded', label: 'Needs attention' }]}
      />,
    );
    expect(screen.getByText('Needs attention')).toBeInTheDocument();
  });
});

describe('Select grouping', () => {
  it('renders a labelled group and a separator', async () => {
    render(
      <Select>
        <SelectTrigger aria-label="Namespace">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectGroupLabel>System</SelectGroupLabel>
            <SelectItem value="kube-system">kube-system</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectGroupLabel>Workloads</SelectGroupLabel>
            <SelectItem value="billing">billing</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    await openListbox('Namespace');
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('Workloads')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'billing' })).toBeInTheDocument();
  });
});

describe('FilterSelect without a label', () => {
  it('renders the control alone', () => {
    render(<FilterSelect value="All" onValueChange={vi.fn()} options={['All']} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
