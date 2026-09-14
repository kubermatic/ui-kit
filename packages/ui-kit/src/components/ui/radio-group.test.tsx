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

import { RadioGroup, RadioGroupItem } from './radio-group';

describe('RadioGroup', () => {
  const options = (
    <>
      <RadioGroupItem value="cluster">Whole cluster</RadioGroupItem>
      <RadioGroupItem value="namespace">One namespace</RadioGroupItem>
    </>
  );

  it('groups its options', () => {
    render(<RadioGroup aria-label="Scope">{options}</RadioGroup>);
    expect(screen.getByRole('radiogroup', { name: 'Scope' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  /*
   * The label wraps the control, so the hit target is the whole row — a 16px
   * dot alone fails WCAG 2.2's 24px target-size minimum.
   */
  it('is selectable by its label', async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Scope" onValueChange={onValueChange}>
        {options}
      </RadioGroup>,
    );

    await userEvent.click(screen.getByText('One namespace'));
    expect(onValueChange).toHaveBeenCalledWith('namespace', expect.anything());
  });

  it('renders the dot alone when given no label', () => {
    render(
      <RadioGroup aria-label="Scope">
        <RadioGroupItem value="a" aria-label="A" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'A' })).toBeInTheDocument();
  });
});

describe('RadioGroup orientation', () => {
  it('lays out horizontally when asked', () => {
    const { container } = render(
      <RadioGroup aria-label="Scope" orientation="horizontal">
        <RadioGroupItem value="a">A</RadioGroupItem>
      </RadioGroup>,
    );
    expect(container.querySelector('[data-slot="radio-group"]')).toHaveClass('flex-row');
  });
});
