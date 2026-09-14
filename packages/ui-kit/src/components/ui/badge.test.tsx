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

import { Badge } from './badge';

describe('Badge', () => {
  it('renders a span by default', () => {
    render(<Badge>Running</Badge>);

    expect(screen.getByText('Running').tagName).toBe('SPAN');
  });

  it('applies the variant surface and its paired foreground', () => {
    render(<Badge variant="honey">Degraded</Badge>);

    const badge = screen.getByText('Degraded');
    expect(badge.classList.contains('bg-highlight-honey')).toBe(true);
    expect(badge.classList.contains('text-highlight-honey-foreground')).toBe(true);
  });

  /*
   * Doubles as a type test. `href` only typechecks if `BadgeProps` is
   * genuinely polymorphic — the previous non-generic version pinned props to
   * `span`, so the usage its own doc comment recommended was a compile error.
   * `npm run typecheck` covers this file, so a regression fails there too.
   */
  it('renders as another element with that element’s props', () => {
    render(
      <Badge as="a" href="/tags/prod">
        prod
      </Badge>,
    );

    const link = screen.getByRole('link', { name: 'prod' });
    expect(link).toHaveAttribute('href', '/tags/prod');
    expect(link.classList.contains('bg-accent')).toBe(true);
  });

  it('lets a consumer className override a variant utility', () => {
    render(<Badge className="bg-muted">Running</Badge>);

    const badge = screen.getByText('Running');
    expect(badge.classList.contains('bg-muted')).toBe(true);
    expect(badge.classList.contains('bg-accent')).toBe(false);
  });
});
