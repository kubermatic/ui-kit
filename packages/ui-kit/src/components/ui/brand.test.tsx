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
import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BrandProvider, Logo, useBrand, type Brand } from './brand';

const brand: Brand = {
  name: 'Example Console',
  shortName: 'EC',
  company: 'Kubermatic',
};

describe('useBrand', () => {
  /*
   * Throws, like `useSidebar`. An earlier version returned
   * `{ name: 'Untitled' }` so a component could be dropped into a story with
   * no scaffolding — which meant forgetting the provider shipped "Untitled" to
   * production instead of failing on the first render. Storybook mounts a
   * brand globally instead, so nothing pays for the strictness.
   */
  it('refuses to work outside a provider', () => {
    expect(() => renderHook(() => useBrand())).toThrowError(/BrandProvider/);
  });
});

describe('Logo', () => {
  it('is named after the product', () => {
    render(
      <BrandProvider brand={brand}>
        <Logo />
      </BrandProvider>,
    );
    expect(screen.getByRole('link', { name: 'Example Console' })).toBeInTheDocument();
  });

  /* So the shell looks deliberate before any artwork exists. */
  it('renders the name as a wordmark when there is no logo', () => {
    render(
      <BrandProvider brand={brand}>
        <Logo />
      </BrandProvider>,
    );
    expect(screen.getByText('EC', { selector: '[aria-hidden="true"]' })).toBeInTheDocument();
  });

  it('renders initials as the mark when there is no artwork', () => {
    render(
      <BrandProvider brand={{ name: 'Example Platform' }}>
        <Logo variant="mark" />
      </BrandProvider>,
    );
    expect(screen.getByText('EP')).toBeInTheDocument();
  });

  it('uses the supplied artwork', () => {
    render(
      <BrandProvider brand={{ ...brand, logo: <img src="/sg.svg" alt="" data-testid="art" /> }}>
        <Logo />
      </BrandProvider>,
    );
    expect(screen.getByTestId('art')).toBeInTheDocument();
    // Still named once, from the brand — not twice, from the image's alt.
    expect(screen.getByRole('link', { name: 'Example Console' })).toBeInTheDocument();
  });

  it('links to the home route', () => {
    render(
      <BrandProvider brand={{ ...brand, href: '/dashboard' }}>
        <Logo />
      </BrandProvider>,
    );
    expect(screen.getByRole('link', { name: 'Example Console' })).toHaveAttribute(
      'href',
      '/dashboard',
    );
  });

  /* The router's own link element, so this file knows nothing about `to` vs `href`. */
  it('renders the router link element it was given', () => {
    render(
      <BrandProvider brand={{ ...brand, homeLink: <a href="/router-home" data-testid="rl" /> }}>
        <Logo />
      </BrandProvider>,
    );
    const link = screen.getByTestId('rl');
    expect(link).toHaveAttribute('href', '/router-home');
    expect(link).toHaveAccessibleName('Example Console');
  });

  it('can render without a link', () => {
    render(
      <BrandProvider brand={brand}>
        <Logo asLink={false} />
      </BrandProvider>,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Example Console')).toHaveClass('sr-only');
  });
});

describe('Logo class merging', () => {
  it("keeps the router link element's own classes", () => {
    render(
      <BrandProvider
        brand={{ ...brand, homeLink: <a href="/" className="shrink-0" data-testid="rl" /> }}
      >
        <Logo />
      </BrandProvider>,
    );

    const link = screen.getByTestId('rl');
    expect(link).toHaveClass('shrink-0');
    // …and gains the focus ring the kit puts on every link.
    expect(link.className).toContain('focus-visible:ring');
  });

  it('prefers the full name when there is no short name', () => {
    render(
      <BrandProvider brand={{ name: 'Example Platform' }}>
        <Logo />
      </BrandProvider>,
    );
    expect(
      screen.getByText('Example Platform', { selector: '[aria-hidden="true"]' }),
    ).toBeInTheDocument();
  });
});
