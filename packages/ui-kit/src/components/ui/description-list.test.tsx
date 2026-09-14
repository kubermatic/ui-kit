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

import { DescriptionItem, DescriptionList } from './description-list';

describe('DescriptionList', () => {
  /*
   * A `<dl>`, not a two-column table: a table asserts a relationship between
   * *rows* that does not exist here, and divs assert nothing at all.
   */
  it('renders real term/value pairs', () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionItem term="Namespace">kube-system</DescriptionItem>
        <DescriptionItem term="Created">Yesterday</DescriptionItem>
      </DescriptionList>,
    );

    expect(container.querySelector('dl')).toBeInTheDocument();
    expect([...container.querySelectorAll('dt')].map((n) => n.textContent)).toEqual([
      'Namespace',
      'Created',
    ]);
    expect([...container.querySelectorAll('dd')].map((n) => n.textContent)).toEqual([
      'kube-system',
      'Yesterday',
    ]);
  });

  /*
   * The pairs are direct children of the `<dl>` with no wrapper, which is what
   * lets the horizontal layout line the terms up down a real grid column.
   */
  it('puts dt and dd directly in the list', () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionItem term="Namespace">kube-system</DescriptionItem>
      </DescriptionList>,
    );

    const list = container.querySelector('dl')!;
    expect([...list.children].map((child) => child.tagName)).toEqual(['DT', 'DD']);
  });

  it('records its orientation for the layout to key off', () => {
    const { container } = render(
      <DescriptionList orientation="stacked">
        <DescriptionItem term="A">1</DescriptionItem>
      </DescriptionList>,
    );
    expect(container.querySelector('dl')).toHaveAttribute('data-orientation', 'stacked');
  });

  it('truncates a long value on request', () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionItem term="Token" truncate>
          ey...
        </DescriptionItem>
      </DescriptionList>,
    );
    expect(container.querySelector('dd')).toHaveClass('truncate');
  });

  it('shows the value text', () => {
    render(
      <DescriptionList>
        <DescriptionItem term="Namespace">kube-system</DescriptionItem>
      </DescriptionList>,
    );
    expect(screen.getByText('kube-system')).toBeInTheDocument();
  });
});
