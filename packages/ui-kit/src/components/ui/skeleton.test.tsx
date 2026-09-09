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
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton, SkeletonText } from './skeleton';

describe('Skeleton', () => {
  /*
   * `bg-muted`, not a Tailwind palette grey — a product's `bg-slate-200` is
   * invisible on the dark palette and unreachable by any theme override.
   */
  it('paints with a theme role', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('[data-slot="skeleton"]')).toHaveClass('bg-muted');
  });

  /*
   * No `role="status"`: a page full of skeletons would announce a dozen busy
   * regions. One `aria-busy` region around the loading area is the job of
   * whatever is loading.
   */
  it('announces nothing on its own', () => {
    const { container } = render(<Skeleton />);
    const el = container.querySelector('[data-slot="skeleton"]')!;
    expect(el).not.toHaveAttribute('role');
    expect(el).not.toHaveAttribute('aria-live');
  });
});

describe('SkeletonText', () => {
  it('renders the requested number of lines', () => {
    const { container } = render(<SkeletonText lines={4} />);
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(4);
  });

  /* The short last line is what makes it read as a paragraph. */
  it('shortens the last line of a multi-line block', () => {
    const { container } = render(<SkeletonText lines={3} />);
    const lines = [...container.querySelectorAll('[data-slot="skeleton"]')];
    expect(lines.at(-1)).toHaveClass('w-2/3');
    expect(lines[0]).toHaveClass('w-full');
  });

  it('leaves a single line full width', () => {
    const { container } = render(<SkeletonText lines={1} />);
    expect(container.querySelector('[data-slot="skeleton"]')).toHaveClass('w-full');
  });
});
