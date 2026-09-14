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

import { TagInput } from './tag-input';

describe('TagInput', () => {
  it('commits on Enter', async () => {
    const onValueChange = vi.fn();
    render(<TagInput value={[]} onValueChange={onValueChange} />);

    await userEvent.type(screen.getByRole('textbox'), 'production{Enter}');
    expect(onValueChange).toHaveBeenCalledWith(['production']);
  });

  /* Pasting a comma-separated list is how people enter several at once. */
  it('commits on a comma without inserting it', async () => {
    const onValueChange = vi.fn();
    render(<TagInput value={[]} onValueChange={onValueChange} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'staging,');
    expect(onValueChange).toHaveBeenCalledWith(['staging']);
    expect(input).toHaveValue('');
  });

  /*
   * The most common complaint about this control: you type a tag, click Save,
   * and the tag was never added.
   */
  it('commits on blur', async () => {
    const onValueChange = vi.fn();
    render(<TagInput value={[]} onValueChange={onValueChange} />);

    await userEvent.type(screen.getByRole('textbox'), 'dev');
    await userEvent.tab();
    expect(onValueChange).toHaveBeenCalledWith(['dev']);
  });

  it('ignores whitespace-only input', async () => {
    const onValueChange = vi.fn();
    render(<TagInput value={[]} onValueChange={onValueChange} />);

    await userEvent.type(screen.getByRole('textbox'), '   {Enter}');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('rejects a duplicate unless duplicates are allowed', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<TagInput value={['dev']} onValueChange={onValueChange} />);

    await userEvent.type(screen.getByRole('textbox'), 'dev{Enter}');
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(<TagInput value={['dev']} onValueChange={onValueChange} allowDuplicates />);
    await userEvent.type(screen.getByRole('textbox'), 'dev{Enter}');
    expect(onValueChange).toHaveBeenCalledWith(['dev', 'dev']);
  });

  /* The behaviour everyone tries first. */
  it('removes the last chip on Backspace in an empty input', async () => {
    const onValueChange = vi.fn();
    render(<TagInput value={['a', 'b']} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.keyboard('{Backspace}');
    expect(onValueChange).toHaveBeenCalledWith(['a']);
  });

  it('does not remove a chip when Backspace is editing text', async () => {
    const onValueChange = vi.fn();
    render(<TagInput value={['a']} onValueChange={onValueChange} />);

    await userEvent.type(screen.getByRole('textbox'), 'xy{Backspace}');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('names each remove button after its tag', async () => {
    const onValueChange = vi.fn();
    render(<TagInput value={['prod']} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Remove prod' }));
    expect(onValueChange).toHaveBeenCalledWith([]);
  });
});

describe('TagInput disabled', () => {
  it('shows the chips but offers no way to remove them', () => {
    render(<TagInput value={['prod', 'eu']} onValueChange={vi.fn()} disabled />);

    expect(screen.getByText('prod')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Remove/ })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('takes custom commit keys', async () => {
    const onValueChange = vi.fn();
    render(<TagInput value={[]} onValueChange={onValueChange} commitKeys={[' ']} />);

    await userEvent.type(screen.getByRole('textbox'), 'prod ');
    expect(onValueChange).toHaveBeenCalledWith(['prod']);
  });
});
