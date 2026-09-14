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

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('toggles', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Select all" onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole('checkbox', { name: 'Select all' });
    expect(box).not.toBeChecked();

    await userEvent.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  /*
   * The state a table's select-all header needs. Base UI takes it as a real
   * prop — both products set `.indeterminate` on the DOM node in an effect
   * instead, which is a render behind the truth.
   */
  it('reports the indeterminate state to assistive technology', () => {
    render(<Checkbox aria-label="Select all" indeterminate checked={false} />);
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  });

  /*
   * Base UI marks it `aria-disabled` rather than setting the `disabled`
   * attribute, which keeps the control focusable — a disabled control that
   * cannot be focused is one a keyboard user cannot discover at all, and the
   * reason it is greyed out is then unreachable.
   */
  it('stays focusable when disabled, and says it is disabled', () => {
    render(<Checkbox aria-label="Select all" disabled />);

    const box = screen.getByRole('checkbox', { name: 'Select all' });
    expect(box).toHaveAttribute('aria-disabled', 'true');
    expect(box).toHaveAttribute('data-disabled');
  });
});
