/*
 * Copyright 2026 The Kubermatic ui-kit Authors.
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

import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormCombobox, type ComboboxOptionGroup } from './form-combobox';

const groups: ComboboxOptionGroup[] = [
  { label: '', options: [{ value: '', label: 'None (manual configuration)' }] },
  {
    label: 'Linux',
    options: [
      {
        value: 'centos.stream9',
        label: 'CentOS Stream 9',
        hint: 'centos.stream9',
      },
      {
        value: 'centos.stream9.desktop',
        label: 'CentOS Stream 9',
        hint: 'centos.stream9.desktop',
      },
    ],
  },
  {
    label: 'Windows',
    options: [{ value: 'windows.11', label: 'Windows 11', hint: 'windows.11' }],
  },
];

function renderGrouped(value = '') {
  const onValueChange = vi.fn();
  render(
    <FormCombobox
      groups={groups}
      value={value}
      onValueChange={onValueChange}
      placeholder="Select preset"
    />,
  );
  return {
    onValueChange,
    input: screen.getByRole('combobox') as HTMLInputElement,
  };
}

function renderItems(items: string[], value = '') {
  const onValueChange = vi.fn();
  render(
    <FormCombobox
      items={items}
      value={value}
      onValueChange={onValueChange}
      placeholder="Select storage class"
    />,
  );
  return {
    onValueChange,
    input: screen.getByRole('combobox') as HTMLInputElement,
  };
}

// The popup opens on the pointer sequence, not on a bare click.
function openPopup(input: HTMLElement) {
  fireEvent.pointerDown(input);
  fireEvent.mouseDown(input);
  fireEvent.click(input);
}

describe('FormCombobox with groups', () => {
  it('lists every group with its options', () => {
    const { input } = renderGrouped();

    openPopup(input);

    expect(screen.getByText('Linux')).toBeInTheDocument();
    expect(screen.getByText('Windows')).toBeInTheDocument();
    expect(screen.getAllByText('CentOS Stream 9')).toHaveLength(2);
    expect(screen.getByText('centos.stream9.desktop')).toBeInTheDocument();
  });

  it('keeps the unlabelled options out of an anonymous group', () => {
    const { input, onValueChange } = renderGrouped();

    openPopup(input);

    const list = screen.getByRole('listbox');
    expect(within(list).getAllByRole('group')).toHaveLength(2);

    fireEvent.click(screen.getByText('None (manual configuration)'));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('filters by the hint so repeated labels stay reachable', () => {
    const { input, onValueChange } = renderGrouped();

    openPopup(input);
    fireEvent.change(input, { target: { value: 'stream9.desktop' } });

    expect(screen.getAllByText('CentOS Stream 9')).toHaveLength(1);
    expect(screen.queryByText('Windows')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('centos.stream9.desktop'));

    expect(onValueChange).toHaveBeenCalledWith('centos.stream9.desktop');
  });
});

describe('FormCombobox with plain items', () => {
  it('filters as the user types and reports the selection', () => {
    const { input, onValueChange } = renderItems([
      'csi-rbd',
      'csi-cephfs',
      'local-path',
    ]);

    openPopup(input);
    fireEvent.change(input, { target: { value: 'ceph' } });

    expect(screen.queryByText('local-path')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('csi-cephfs'));

    expect(onValueChange).toHaveBeenCalledWith('csi-cephfs');
  });

  it('matches across punctuation the way the collator does', () => {
    const { input } = renderItems(['csi-rbd', 'local-path']);

    openPopup(input);
    fireEvent.change(input, { target: { value: 'csi rbd' } });

    expect(screen.getByText('csi-rbd')).toBeInTheDocument();
    expect(screen.queryByText('local-path')).not.toBeInTheDocument();
  });
});

// The custom filter never sees the reopen query: Base UI skips filtering while
// the query is still the untouched selected label. That is why the filter hook
// does not need its `value` option.
describe('FormCombobox reopened with a selection', () => {
  it('lists every option, not just the selected one', () => {
    const { input } = renderItems(
      ['csi-rbd', 'csi-cephfs', 'local-path'],
      'csi-rbd',
    );

    expect(input.value).toBe('csi-rbd');

    openPopup(input);

    expect(screen.getByText('csi-cephfs')).toBeInTheDocument();
    expect(screen.getByText('local-path')).toBeInTheDocument();
  });

  it('lists every group when the selected label is shared', () => {
    const { input } = renderGrouped('centos.stream9');

    expect(input.value).toBe('CentOS Stream 9');

    openPopup(input);

    expect(screen.getByText('Windows 11')).toBeInTheDocument();
    expect(screen.getByText('None (manual configuration)')).toBeInTheDocument();
  });
});

describe('FormCombobox select-on-focus', () => {
  it('selects the whole label so typing replaces it', () => {
    const { input } = renderItems(['csi-rbd', 'local-path'], 'csi-rbd');

    input.focus();

    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe('csi-rbd'.length);
  });

  // WebKit collapses that selection on the mouseup of the focusing click.
  it('suppresses the mouseup default on the click that moves focus in', () => {
    const { input } = renderItems(['csi-rbd', 'local-path'], 'csi-rbd');

    fireEvent.mouseDown(input);
    input.focus();

    expect(fireEvent.mouseUp(input)).toBe(false);
  });

  it('leaves a second click free to place the caret', () => {
    const { input } = renderItems(['csi-rbd', 'local-path'], 'csi-rbd');

    fireEvent.mouseDown(input);
    input.focus();
    fireEvent.mouseUp(input);

    fireEvent.mouseDown(input);

    expect(fireEvent.mouseUp(input)).toBe(true);
  });

  it('leaves a click after keyboard focus free to place the caret', () => {
    const { input } = renderItems(['csi-rbd', 'local-path'], 'csi-rbd');

    input.focus();
    fireEvent.mouseDown(input);

    expect(fireEvent.mouseUp(input)).toBe(true);
  });
});
