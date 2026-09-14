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

import { StatusBadge, StatusDot, statusBadgeVariants } from './status-badge';

describe('StatusBadge', () => {
  it('renders its label', () => {
    render(<StatusBadge tone="success">Synced</StatusBadge>);
    expect(screen.getByText('Synced')).toBeInTheDocument();
  });

  it('carries the tone as a data attribute for tests and styling hooks', () => {
    render(<StatusBadge tone="error">Failed</StatusBadge>);
    expect(screen.getByText('Failed')).toHaveAttribute('data-tone', 'error');
  });

  /*
   * The dot inherits the resolved foreground rather than carrying a colour of
   * its own — a dot with its own colour would be a surface/foreground pair
   * nobody measured.
   */
  it('draws the optional dot in the current colour', () => {
    const { container } = render(
      <StatusBadge tone="success" dot>
        Ready
      </StatusBadge>,
    );
    const dot = container.querySelector('span[aria-hidden="true"]');
    expect(dot).toHaveClass('bg-current');
  });

  /*
   * `--secondary` is a pale surface: as text on `--background` it is about
   * 1.05:1. The outline variant therefore has to fall back to the muted role
   * for the two tones that have no colour of their own.
   */
  it('never puts the secondary surface colour on text', () => {
    for (const tone of ['pending', 'neutral'] as const) {
      const classes = statusBadgeVariants({ tone, variant: 'outline' });
      expect(classes).toContain('text-muted-foreground');
      expect(classes).not.toContain('text-secondary');
    }
  });
});

describe('StatusDot', () => {
  /*
   * A bare coloured circle is the textbook SC 1.4.1 failure. The label is a
   * required prop so the component cannot reproduce it.
   */
  it('announces what the colour means', () => {
    render(<StatusDot tone="error" label="Disconnected" />);
    expect(screen.getByText('Disconnected')).toHaveClass('sr-only');
  });

  it('hides the circle itself from assistive technology', () => {
    const { container } = render(<StatusDot tone="success" label="Connected" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});

describe('StatusBadge tone matrix', () => {
  const tones = ['success', 'warning', 'error', 'info', 'pending', 'neutral'] as const;

  it.each(tones)('gives %s a solid surface and its foreground', (tone) => {
    const classes = statusBadgeVariants({ tone, variant: 'solid' });
    // Every solid pair is one `CONTRAST_PAIRS` measures.
    expect(classes).toMatch(/bg-(success|warning|destructive|primary|secondary|muted)\b/);
    expect(classes).toMatch(/text-\S+/);
  });

  it.each(tones)('gives %s an outline with a border of the same role', (tone) => {
    const classes = statusBadgeVariants({ tone, variant: 'outline' });
    expect(classes).toContain('bg-background');
    expect(classes).toMatch(/border-(success|warning|destructive|primary|border)\b/);
  });

  it('renders the outline variant', () => {
    render(
      <StatusBadge tone="success" variant="outline" dot>
        Synced
      </StatusBadge>,
    );
    expect(screen.getByText('Synced')).toHaveClass('bg-background');
  });
});

describe('StatusDot sizes', () => {
  it.each(['sm', 'default', 'lg'] as const)('takes the %s size', (size) => {
    const { container } = render(<StatusDot tone="info" size={size} label="Info" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});

describe('StatusBadge defaults', () => {
  it('falls back to the neutral tone', () => {
    render(<StatusBadge>Unknown</StatusBadge>);
    expect(screen.getByText('Unknown')).toHaveAttribute('data-tone', 'neutral');
  });

  it('renders no dot unless asked', () => {
    const { container } = render(<StatusBadge tone="info">Info</StatusBadge>);
    expect(container.querySelector('span[aria-hidden="true"]')).not.toBeInTheDocument();
  });
});
