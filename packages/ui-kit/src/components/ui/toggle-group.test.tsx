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

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

describe('ToggleGroup', () => {
  it('reports which item is pressed', () => {
    render(
      <ToggleGroup aria-label="View" value={['table']} multiple={false}>
        <ToggleGroupItem value="table">Table</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByRole('button', { name: 'Table' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('changes the selection', async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        aria-label="View"
        value={['table']}
        multiple={false}
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="table">Table</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      </ToggleGroup>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Grid' }));
    expect(onValueChange).toHaveBeenCalledWith(['grid'], expect.anything());
  });

  /* One tab stop for the group, arrow keys within it. */
  it('is a single tab stop', () => {
    render(
      <ToggleGroup aria-label="View" value={['table']} multiple={false}>
        <ToggleGroupItem value="table">Table</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      </ToggleGroup>,
    );

    const tabbable = screen
      .getAllByRole('button')
      .filter((button) => button.getAttribute('tabindex') !== '-1');
    expect(tabbable).toHaveLength(1);
  });
});
