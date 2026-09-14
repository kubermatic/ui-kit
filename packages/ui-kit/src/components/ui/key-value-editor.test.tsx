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

import { KeyValueEditor, type KeyValuePair } from './key-value-editor';

const PAIRS: KeyValuePair[] = [
  { key: 'app', value: 'billing' },
  { key: 'tier', value: 'backend' },
];

describe('KeyValueEditor', () => {
  it('shows the empty message with no entries', () => {
    render(<KeyValueEditor value={[]} onValueChange={vi.fn()} emptyMessage="No labels." />);
    expect(screen.getByText('No labels.')).toBeInTheDocument();
  });

  it('appends a blank row', async () => {
    const onValueChange = vi.fn();
    render(<KeyValueEditor value={PAIRS} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Add entry' }));
    expect(onValueChange).toHaveBeenCalledWith([...PAIRS, { key: '', value: '' }]);
  });

  it('edits only the row that changed', async () => {
    const onValueChange = vi.fn();
    render(<KeyValueEditor value={PAIRS} onValueChange={onValueChange} />);

    await userEvent.type(screen.getByLabelText('Value 2'), '!');
    expect(onValueChange).toHaveBeenLastCalledWith([
      { key: 'app', value: 'billing' },
      { key: 'tier', value: 'backend!' },
    ]);
  });

  it('removes the row that was asked for', async () => {
    const onValueChange = vi.fn();
    render(<KeyValueEditor value={PAIRS} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Remove app' }));
    expect(onValueChange).toHaveBeenCalledWith([{ key: 'tier', value: 'backend' }]);
  });

  /*
   * Eleven icon buttons called "Remove" are eleven identical announcements, so
   * each one is named after the key it deletes — and the inputs are named by
   * position, since an empty new row has no key yet.
   */
  it('names every control', () => {
    render(<KeyValueEditor value={[{ key: '', value: '' }]} onValueChange={vi.fn()} />);
    expect(screen.getByLabelText('Key 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Value 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove entry 1' })).toBeInTheDocument();
  });

  it('offers no editing controls when read-only', () => {
    render(<KeyValueEditor value={PAIRS} onValueChange={vi.fn()} readOnly />);
    expect(screen.queryByRole('button', { name: /Remove/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add entry' })).not.toBeInTheDocument();
  });

  /*
   * A duplicate key is a validation concern the consumer's schema owns.
   * Dropping a row the user typed is worse than showing them the conflict.
   */
  it('keeps duplicate keys rather than silently dropping one', () => {
    const onValueChange = vi.fn();
    render(
      <KeyValueEditor
        value={[
          { key: 'app', value: 'a' },
          { key: 'app', value: 'b' },
        ]}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getAllByDisplayValue('app')).toHaveLength(2);
  });
});

describe('KeyValueEditor disabled', () => {
  it('disables every control but keeps them present', () => {
    render(<KeyValueEditor value={PAIRS} onValueChange={vi.fn()} disabled />);

    expect(screen.getByLabelText('Key 1')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove app' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Add entry' })).toBeDisabled();
  });

  it('takes custom placeholders and an add label', () => {
    render(
      <KeyValueEditor
        value={[{ key: '', value: '' }]}
        onValueChange={vi.fn()}
        keyPlaceholder="Label"
        valuePlaceholder="Contents"
        addLabel="Add label"
      />,
    );

    expect(screen.getByLabelText('Label 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Contents 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add label' })).toBeInTheDocument();
  });
});
