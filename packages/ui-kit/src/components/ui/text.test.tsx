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

import { Text } from './text';

describe('Text', () => {
  it('renders a paragraph by default', () => {
    render(<Text>Cluster is healthy</Text>);

    expect(screen.getByText('Cluster is healthy').tagName).toBe('P');
  });

  it('maps heading variants onto the matching semantic tag', () => {
    render(<Text variant="h2">Clusters</Text>);

    expect(screen.getByRole('heading', { level: 2, name: 'Clusters' })).toBeInTheDocument();
  });

  /* Type test as well as a runtime one: `href` requires real polymorphism. */
  it('renders as another element with that element’s props', () => {
    render(
      <Text variant="small" as="a" href="/docs">
        Docs
      </Text>,
    );

    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
  });

  it('honours an explicit `as` override', () => {
    render(
      <Text variant="h2" as="div">
        Looks like a heading, is not one
      </Text>,
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
