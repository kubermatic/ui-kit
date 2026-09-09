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
import { describe, expect, it } from 'vitest';

import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a textarea', () => {
    render(<Textarea aria-label="Notes" />);
    expect(screen.getByLabelText('Notes').tagName).toBe('TEXTAREA');
  });

  /*
   * The native props go on the rendered element, not on `Field.Control` —
   * whose props are typed against `<input>`, where `rows` does not exist.
   */
  it('passes textarea-only attributes through', () => {
    render(<Textarea aria-label="Notes" rows={8} />);
    expect(screen.getByLabelText('Notes')).toHaveAttribute('rows', '8');
  });

  it('takes typing', async () => {
    render(<Textarea aria-label="Notes" />);
    await userEvent.type(screen.getByLabelText('Notes'), 'hello');
    expect(screen.getByLabelText('Notes')).toHaveValue('hello');
  });
});
