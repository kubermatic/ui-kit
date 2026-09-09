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
import { describe, expect, it } from 'vitest';

import { Field } from './field';
import { Input } from './input';
import { Textarea } from './textarea';

describe('Field', () => {
  /* The whole point of the component: the label points at the control. */
  it('labels the control it wraps', () => {
    render(
      <Field label="Namespace">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText('Namespace')).toBeInTheDocument();
  });

  it('labels a textarea the same way', () => {
    render(
      <Field label="Notes">
        <Textarea />
      </Field>,
    );
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('describes the control with the helper text', () => {
    render(
      <Field label="Name" description="Lowercase letters and dashes.">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText('Name')).toHaveAccessibleDescription(
      'Lowercase letters and dashes.',
    );
  });

  /*
   * `error` is a plain node so react-hook-form stays the consumer's
   * dependency — `errors.name?.message` goes straight in, and a falsy value
   * renders nothing.
   */
  it('shows an externally supplied error and hides it when falsy', () => {
    const { rerender } = render(
      <Field label="Name" error="Required.">
        <Input />
      </Field>,
    );
    expect(screen.getByText('Required.')).toBeInTheDocument();

    rerender(
      <Field label="Name" error={undefined}>
        <Input />
      </Field>,
    );
    expect(screen.queryByText('Required.')).not.toBeInTheDocument();
  });

  it('marks a required label without announcing the asterisk', () => {
    render(
      <Field label="Name" required>
        <Input required />
      </Field>,
    );
    /*
     * Queried by accessible name, which excludes `aria-hidden` content — so
     * this asserts both that the label reaches the control and that the star
     * is not part of what gets announced. The label's *text* is "Name*"; its
     * accessible name is "Name".
     */
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toBeRequired();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('works without a label, for a control named some other way', () => {
    render(
      <Field>
        <Input aria-label="Search" />
      </Field>,
    );
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });
});

describe('Field layout', () => {
  it('lays the control out beside the label when horizontal', () => {
    const { container } = render(
      <Field label="Enabled" orientation="horizontal">
        <Input />
      </Field>,
    );
    expect(container.querySelector('[data-slot="field"]')).toHaveClass('justify-between');
  });
});
