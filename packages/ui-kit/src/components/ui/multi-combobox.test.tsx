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

/*
 * Widths for the anchoring test below. They differ so that `--anchor-width`
 * names which element Base UI measured rather than merely agreeing by
 * coincidence; jsdom reports every rect as zero, so without a stub the two
 * candidates are indistinguishable.
 */
const FIELD_WIDTH = 400;
const INPUT_WIDTH = 96;

function stubFieldAndInputWidths() {
  const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect');
  spy.mockImplementation(function (this: Element) {
    const width = this.matches('[data-slot="multi-combobox"]')
      ? FIELD_WIDTH
      : this.tagName === 'INPUT'
        ? INPUT_WIDTH
        : 0;
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: 36,
      width,
      height: 36,
      toJSON: () => ({}),
    };
  });
  return () => {
    spy.mockRestore();
  };
}

/* The positioner is whichever ancestor of the popup carries the anchor vars. */
function positionerOf(popup: Element): HTMLElement {
  for (let el = popup.parentElement; el; el = el.parentElement) {
    if (el.style.getPropertyValue('--anchor-width')) return el;
  }
  throw new Error('no positioner with --anchor-width found above the popup');
}

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

  /*
   * The popup is sized `w-[var(--anchor-width)]`, and Base UI resolves that
   * anchor as `inputGroupElement ?? inputElement`. Only `Combobox.InputGroup`
   * registers the former, so a control that renders the chips container alone
   * anchors its popup to the `<input>` — which here is `flex-1` beside the
   * chips, so the popup took the width of the gap left on the chip row and
   * resized on every selection (#49).
   */
  it('anchors the popup to the field box rather than to the input', async () => {
    const restore = stubFieldAndInputWidths();
    try {
      render(<Harness initial={['backend', 'payments']} />);
      await userEvent.click(screen.getByTestId('picker'));

      const popup = document.querySelector('[data-slot="combobox-content"]');
      expect(popup).not.toBeNull();
      expect(positionerOf(popup!).style.getPropertyValue('--anchor-width')).toBe(
        `${FIELD_WIDTH}px`,
      );
    } finally {
      restore();
    }
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
