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

import { AppFooter } from './app-footer';
import { BrandProvider } from './brand';

describe('AppFooter', () => {
  /* `AppFooter` reads `company` and `docsUrl` from the brand, so it needs one. */
  it('is a contentinfo landmark', () => {
    render(
      <BrandProvider brand={{ name: 'Example Console' }}>
        <AppFooter />
      </BrandProvider>,
    );
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('refuses to render without a BrandProvider', () => {
    // Loud rather than "Powered by undefined".
    expect(() => render(<AppFooter />)).toThrowError(/BrandProvider/);
  });

  it('credits the company from the brand', () => {
    render(
      <BrandProvider brand={{ name: 'Example Console', company: 'Kubermatic' }}>
        <AppFooter />
      </BrandProvider>,
    );
    expect(screen.getByText('Powered by Kubermatic')).toBeInTheDocument();
  });

  /* "Powered by undefined" is the failure mode of doing this with props. */
  it('omits the credit when there is no company', () => {
    render(
      <BrandProvider brand={{ name: 'Example Console' }}>
        <AppFooter />
      </BrandProvider>,
    );
    expect(screen.queryByText(/Powered by/)).not.toBeInTheDocument();
  });

  /*
   * "Documentation", not "Docs": a link's accessible name should make sense
   * read out of context, which is how a screen reader's link list shows it.
   */
  it('links to the docs when the brand has a URL', () => {
    render(
      <BrandProvider brand={{ name: 'Example Console', docsUrl: 'https://docs.example.com' }}>
        <AppFooter />
      </BrandProvider>,
    );

    const link = screen.getByRole('link', { name: 'Documentation' });
    expect(link).toHaveAttribute('href', 'https://docs.example.com');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders its actions slot', () => {
    render(
      <BrandProvider brand={{ name: 'Example Console' }}>
        <AppFooter actions={<button type="button">Theme</button>} />
      </BrandProvider>,
    );
    expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument();
  });
});
