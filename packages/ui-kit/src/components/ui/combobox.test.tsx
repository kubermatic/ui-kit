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

import { Combobox } from './combobox';
import { Field } from './field';

const CLUSTERS = ['prod-eu-1', 'prod-us-1', 'staging'];

/*
 * See the anchoring test at the end of this file. The two widths differ so
 * that `--anchor-width` names which element Base UI measured — jsdom reports
 * every rect as zero, so without a stub the candidates are indistinguishable.
 */
const FIELD_WIDTH = 400;
const INPUT_WIDTH = 96;

function stubFieldAndInputWidths() {
  const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect');
  spy.mockImplementation(function (this: Element) {
    const width = this.matches('[data-slot="combobox"]')
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

describe('Combobox', () => {
  it('shows the selected option in the input', () => {
    render(
      <Combobox options={CLUSTERS} value="staging" onValueChange={vi.fn()} data-testid="picker" />,
    );
    expect(screen.getByTestId('picker')).toHaveValue('staging');
  });

  it('filters as you type and selects with Enter', async () => {
    const onValueChange = vi.fn();
    render(
      <Combobox
        options={CLUSTERS}
        value={null}
        onValueChange={onValueChange}
        data-testid="picker"
      />,
    );

    await userEvent.type(screen.getByTestId('picker'), 'us');
    expect(screen.getByRole('option', { name: 'prod-us-1' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'staging' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('option', { name: 'prod-us-1' }));
    // The public value is a plain string, not Base UI's option object.
    expect(onValueChange).toHaveBeenCalledWith('prod-us-1');
  });

  it('says so when nothing matches', async () => {
    render(
      <Combobox
        options={CLUSTERS}
        value={null}
        onValueChange={vi.fn()}
        emptyMessage="No clusters found."
        data-testid="picker"
      />,
    );

    await userEvent.type(screen.getByTestId('picker'), 'zzz');
    expect(screen.getByText('No clusters found.')).toBeInTheDocument();
  });

  /* A cluster picker needs a status dot after the name. */
  it('decorates list rows without changing the input display', async () => {
    render(
      <Combobox
        options={CLUSTERS}
        value="staging"
        onValueChange={vi.fn()}
        renderItem={(item) => <span>{item.label} ●</span>}
        data-testid="picker"
      />,
    );

    // Opened from the keyboard: Base UI opens on pointerdown, which jsdom
    // does not implement.
    screen.getByRole('button', { name: 'Open list' }).focus();
    await userEvent.keyboard('{Enter}');

    expect(screen.getByText(/staging/)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /staging/ })).toBeInTheDocument();
    // The input still shows the plain label.
    expect(screen.getByTestId('picker')).toHaveValue('staging');
  });

  it('offers a clear button only when something is selected', () => {
    const { rerender } = render(
      <Combobox options={CLUSTERS} value={null} onValueChange={vi.fn()} clearable />,
    );
    expect(screen.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();

    rerender(<Combobox options={CLUSTERS} value="staging" onValueChange={vi.fn()} clearable />);
    expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument();
  });
});

describe('Combobox extras', () => {
  it('renders a leading adornment and a placeholder', () => {
    render(
      <Combobox
        options={CLUSTERS}
        value={null}
        onValueChange={vi.fn()}
        placeholder="Any cluster"
        startAdornment={<span data-testid="icon">S</span>}
        data-testid="picker"
      />,
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByTestId('picker')).toHaveAttribute('placeholder', 'Any cluster');
  });

  it('can be disabled and required', () => {
    render(
      <Combobox
        options={CLUSTERS}
        value={null}
        onValueChange={vi.fn()}
        disabled
        required
        name="cluster"
        data-testid="picker"
      />,
    );
    expect(screen.getByTestId('picker')).toBeDisabled();
  });

  it('clears the selection', async () => {
    const onValueChange = vi.fn();
    render(<Combobox options={CLUSTERS} value="staging" onValueChange={onValueChange} clearable />);

    await userEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it('accepts value/label pairs', () => {
    render(
      <Combobox
        options={[{ value: 'prod-eu-1', label: 'Production (EU)' }]}
        value="prod-eu-1"
        onValueChange={vi.fn()}
        data-testid="picker"
      />,
    );
    expect(screen.getByTestId('picker')).toHaveValue('Production (EU)');
  });
});

describe('Combobox labelling', () => {
  /*
   * Base UI generates the input's id, so there is no element for a caller to
   * point a `<label for>` at. Standalone, the only way to name it is these
   * two props — and without one it is an unlabelled form field, which is what
   * the axe run reported before they existed.
   */
  it('takes an accessible name', () => {
    render(
      <Combobox options={CLUSTERS} value="staging" onValueChange={vi.fn()} aria-label="Cluster" />,
    );
    expect(screen.getByRole('combobox', { name: 'Cluster' })).toBeInTheDocument();
  });

  it('takes aria-labelledby instead', () => {
    render(
      <>
        <span id="cluster-label">Cluster</span>
        <Combobox
          options={CLUSTERS}
          value={null}
          onValueChange={vi.fn()}
          aria-labelledby="cluster-label"
        />
      </>,
    );
    expect(screen.getByRole('combobox', { name: 'Cluster' })).toBeInTheDocument();
  });

  /* Inside a `Field`, Base UI wires the label to the generated id itself. */
  it('needs neither inside a Field', () => {
    render(
      <Field label="Cluster">
        <Combobox options={CLUSTERS} value="staging" onValueChange={vi.fn()} />
      </Field>,
    );
    expect(screen.getByRole('combobox', { name: 'Cluster' })).toBeInTheDocument();
  });

  /*
   * The regression that sent one product back to remounting this on a key: a
   * `value` changed from elsewhere — the URL, a sibling control — must show up
   * in the input, including after the user has typed a filter into it.
   */
  it('re-syncs the input when the value changes from outside', async () => {
    function Harness() {
      const [value, setValue] = useState<string | null>('staging');
      return (
        <>
          <Combobox
            options={CLUSTERS}
            value={value}
            onValueChange={setValue}
            data-testid="picker"
          />
          <button onClick={() => setValue('prod-eu-1')}>elsewhere</button>
          <button onClick={() => setValue(null)}>reset</button>
        </>
      );
    }

    render(<Harness />);
    expect(screen.getByTestId('picker')).toHaveValue('staging');

    await userEvent.type(screen.getByTestId('picker'), 'zz');
    expect(screen.getByTestId('picker')).toHaveValue('stagingzz');

    // Typing opens the popup, which marks the rest of the page hidden.
    await userEvent.keyboard('{Escape}');
    await userEvent.click(screen.getByRole('button', { name: 'elsewhere' }));
    expect(screen.getByTestId('picker')).toHaveValue('prod-eu-1');

    await userEvent.click(screen.getByRole('button', { name: 'reset' }));
    expect(screen.getByTestId('picker')).toHaveValue('');
  });

  it('does not fight the user while they type', async () => {
    render(
      <Combobox options={CLUSTERS} value={null} onValueChange={vi.fn()} data-testid="picker" />,
    );
    await userEvent.type(screen.getByTestId('picker'), 'prod');
    expect(screen.getByTestId('picker')).toHaveValue('prod');
  });

  /*
   * The same anchoring contract the multi-select has, asserted here too. This
   * control's input is `w-full`, so anchoring to it looked right and was not —
   * the input excludes the field's borders, which left the popup two pixels
   * narrow and a pixel off. Declaring the anchor fixes that and, more to the
   * point, stops the single-select from depending on a coincidence the
   * multi-select already lost (#49).
   */
  it('anchors the popup to the field box rather than to the input', async () => {
    const restore = stubFieldAndInputWidths();
    try {
      render(
        <Combobox options={CLUSTERS} value={null} onValueChange={vi.fn()} data-testid="picker" />,
      );
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
});
