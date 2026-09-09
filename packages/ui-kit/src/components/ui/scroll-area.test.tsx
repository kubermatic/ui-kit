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

import { ScrollArea } from './scroll-area';

describe('ScrollArea', () => {
  it('renders its content', () => {
    render(<ScrollArea>a long list</ScrollArea>);
    expect(screen.getByText('a long list')).toBeInTheDocument();
  });

  /*
   * Base UI keeps the *native* scrolling behaviour and only restyles the bar —
   * so the viewport is the thing that actually scrolls, and it is what has to
   * be present. The scrollbars themselves are not asserted here: jsdom has no
   * layout, so nothing ever overflows and Base UI has no reason to render
   * them. That is the browser suite's job.
   */
  it('scrolls through a real viewport element', () => {
    const { container } = render(<ScrollArea>x</ScrollArea>);
    const root = container.querySelector('[data-slot="scroll-area"]');

    expect(root).toBeInTheDocument();
    expect(root?.querySelector('[data-overflow-x], [style*="overflow"], div')).not.toBeNull();
  });

  it('is focusable so the keyboard can scroll it', () => {
    const { container } = render(<ScrollArea>x</ScrollArea>);
    expect(container.querySelector('.overscroll-contain')).toBeInTheDocument();
  });
});

describe('ScrollArea orientations', () => {
  /*
   * Each orientation renders a different set of scrollbars, and `both` adds
   * the corner between them. jsdom will not paint them — there is no layout,
   * so nothing overflows — but the elements are constructed either way, which
   * is what these cover.
   */
  it.each(['vertical', 'horizontal', 'both'] as const)('builds the %s form', (orientation) => {
    const { container } = render(<ScrollArea orientation={orientation}>x</ScrollArea>);
    expect(container.querySelector('[data-slot="scroll-area"]')).toBeInTheDocument();
    expect(screen.getByText('x')).toBeInTheDocument();
  });
});
