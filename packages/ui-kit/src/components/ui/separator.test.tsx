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

import { Separator } from './separator';

describe('Separator', () => {
  /*
   * The difference between a divider a screen reader can use to understand the
   * grouping and a `<div>` with a border.
   */
  it('is announced as a separator, with its orientation', () => {
    render(<Separator />);
    expect(screen.getByRole('separator')).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('takes a vertical orientation', () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
    expect(separator).toHaveClass('w-px');
  });
});
