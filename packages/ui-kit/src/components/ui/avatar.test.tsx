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

import { Avatar, initialsOf } from './avatar';

describe('initialsOf', () => {
  it('takes the first letter of the first two words', () => {
    expect(initialsOf('Ada Lovelace')).toBe('AL');
    expect(initialsOf('Grace Brewster Murray Hopper')).toBe('GB');
  });

  it('takes one letter from a single word', () => {
    expect(initialsOf('Ada')).toBe('A');
  });

  /*
   * An email has no spaces, so one initial is the correct answer — inventing a
   * second from the domain would produce "AE" for ada@example.com.
   */
  it('gives one initial for an email address', () => {
    expect(initialsOf('ada@example.com')).toBe('A');
  });

  it('collapses runs of whitespace rather than emitting a blank initial', () => {
    expect(initialsOf('  Ada   Lovelace  ')).toBe('AL');
  });

  it('is empty for an empty name', () => {
    expect(initialsOf('   ')).toBe('');
  });

  /*
   * `charAt(0)` would return a lone surrogate here — half of a code point,
   * which renders as a replacement character.
   */
  it('keeps an astral-plane first character whole', () => {
    expect(initialsOf('𝒜da')).toBe('𝒜');
    expect(Array.from(initialsOf('🐙 Squid'))).toHaveLength(2);
  });
});

describe('Avatar', () => {
  it('is hidden from assistive technology', () => {
    // An avatar beside a name is decoration; announcing "AL, Ada Lovelace"
    // reads the same person twice.
    const { container } = render(<Avatar name="Ada Lovelace" />);
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows initials when there is no image', () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByText('AL')).toBeInTheDocument();
  });
});

describe('Avatar sizes and image', () => {
  it('renders the image when there is one', () => {
    const { container } = render(<Avatar src="/ada.png" name="Ada Lovelace" />);
    // Base UI keeps the fallback until the image loads, which jsdom never
    // reports — so the assertion is that the <img> was requested at all.
    expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
  });

  it('takes a size', () => {
    const { container } = render(<Avatar name="Ada" size="lg" />);
    expect(container.querySelector('[data-slot="avatar"]')).toHaveClass('size-10');
  });

  it('renders nothing legible with no name', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
  });
});

describe('Avatar without a name', () => {
  it('gives an image an empty alt when there is nothing to call it', () => {
    const { container } = render(<Avatar src="/ada.png" />);
    // Decorative: the whole avatar is aria-hidden, so alt text would be noise.
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('handles a name made only of separators', () => {
    expect(initialsOf('- -')).toBe('--');
  });
});
