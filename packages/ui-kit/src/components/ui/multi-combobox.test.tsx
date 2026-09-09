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
import { useState } from 'react';

import { MultiCombobox } from './combobox';
import { Field } from './field';

const NAMESPACES = ['backend', 'payments', 'ingress', 'data-pipeline'];

/* A controlled harness, since every interaction here changes the value. */
function Harness({ initial = [] as string[] }: { initial?: string[] }) {
  const [value, setValue] = useState<string[]>(initial);
  return (
    <MultiCombobox
      options={NAMESPACES}
      value={value}
      onValueChange={setValue}
      placeholder="Select namespaces…"
      aria-label="Namespaces"
      data-testid="picker"
    />
  );
}

describe('MultiCombobox', () => {
  it('renders a chip per selected value', () => {
    render(
      <MultiCombobox
        options={NAMESPACES}
        value={['backend', 'ingress']}
        onValueChange={vi.fn()}
        aria-label="Namespaces"
      />,
    );
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('ingress')).toBeInTheDocument();
  });

  it('adds to the selection rather than replacing it', async () => {
    const onValueChange = vi.fn();
    render(
      <MultiCombobox
        options={NAMESPACES}
        value={['backend']}
        onValueChange={onValueChange}
        aria-label="Namespaces"
        data-testid="picker"
      />,
    );

    await userEvent.click(screen.getByTestId('picker'));
    await userEvent.click(screen.getByRole('option', { name: 'payments' }));
    expect(onValueChange).toHaveBeenCalledWith(['backend', 'payments']);
  });

  it('filters the list as you type', async () => {
    render(<Harness />);
    await userEvent.type(screen.getByTestId('picker'), 'pay');
    expect(screen.getByRole('option', { name: 'payments' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'backend' })).not.toBeInTheDocument();
  });

  /*
   * The point of using Base UI's chips rather than `<span>`s: each one is a
   * real button with an accessible name, so a selection can be undone without
   * a mouse and a screen reader can enumerate what is selected.
   */
  it('removes a selection from its chip', async () => {
    render(<Harness initial={['backend', 'payments']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove backend' }));
    expect(screen.queryByText('backend')).not.toBeInTheDocument();
    expect(screen.getByText('payments')).toBeInTheDocument();
  });

  it('hides the placeholder once something is selected', async () => {
    render(<Harness />);
    expect(screen.getByPlaceholderText('Select namespaces…')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('picker'));
    await userEvent.click(screen.getByRole('option', { name: 'backend' }));
    expect(screen.queryByPlaceholderText('Select namespaces…')).not.toBeInTheDocument();
  });

  it('takes its accessible name from a surrounding Field', () => {
    render(
      <Field label="Target namespaces">
        <MultiCombobox
          options={NAMESPACES}
          value={[]}
          onValueChange={vi.fn()}
          data-testid="picker"
        />
      </Field>,
    );
    expect(screen.getByTestId('picker')).toHaveAccessibleName('Target namespaces');
  });
});
