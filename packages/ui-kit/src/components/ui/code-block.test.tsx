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

import { Code, CodeBlock } from './code-block';

describe('Code', () => {
  it('renders an inline code element', () => {
    const { container } = render(<Code>kubectl</Code>);
    expect(container.querySelector('code')).toHaveTextContent('kubectl');
  });
});

describe('CodeBlock', () => {
  it('renders the code', () => {
    render(<CodeBlock>{'apiVersion: v1\nkind: Secret'}</CodeBlock>);
    expect(screen.getByText(/apiVersion: v1/)).toBeInTheDocument();
  });

  /*
   * A scrollable region that only responds to the mouse is unreachable: SC
   * 2.1.1 requires the keyboard to be able to scroll it, and a `<pre>` is not
   * focusable by default.
   */
  it('is reachable by keyboard so it can be scrolled', () => {
    const { container } = render(<CodeBlock>{'x'}</CodeBlock>);
    expect(container.querySelector('pre')).toHaveAttribute('tabindex', '0');
  });

  /*
   * `children` is typed as a string because the copy button needs the exact
   * text — one product's `Pre` casts `props.children as string` and copies
   * "[object Object]" whenever anything nests inside it.
   */
  it('names the copy button after the language', () => {
    render(<CodeBlock language="yaml">{'kind: Secret'}</CodeBlock>);
    expect(screen.getByRole('button', { name: 'Copy yaml' })).toBeInTheDocument();
  });

  it('can omit the copy button', () => {
    render(<CodeBlock copyable={false}>{'x'}</CodeBlock>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders extra actions beside the copy button', () => {
    render(<CodeBlock actions={<button type="button">Download</button>}>{'x'}</CodeBlock>);
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
  });
});

describe('CodeBlock labelling', () => {
  it('takes an explicit copy label', () => {
    render(
      <CodeBlock language="yaml" copyLabel="Copy the manifest">
        {'kind: Secret'}
      </CodeBlock>,
    );
    expect(screen.getByRole('button', { name: 'Copy the manifest' })).toBeInTheDocument();
  });

  it('falls back to a generic label with no language', () => {
    render(<CodeBlock>{'echo hi'}</CodeBlock>);
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
  });

  it('shows the language in the corner', () => {
    render(<CodeBlock language="json">{'{}'}</CodeBlock>);
    expect(screen.getByText('json')).toHaveAttribute('aria-hidden', 'true');
  });
});
