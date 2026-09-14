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
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button, buttonVariants } from './button';

describe('Button', () => {
  it('renders a native button by default', () => {
    render(<Button>Deploy</Button>);

    const button = screen.getByRole('button', { name: 'Deploy' });
    expect(button.tagName).toBe('BUTTON');
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Deploy</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Deploy' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick while disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Deploy
      </Button>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Deploy' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('composes with another element through the render prop', () => {
    render(<Button render={<a href="/docs" />}>Docs</Button>);

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
  });

  it('lets a consumer className override a variant utility', () => {
    render(<Button className="bg-muted">Deploy</Button>);

    const button = screen.getByRole('button', { name: 'Deploy' });
    // tailwind-merge should have dropped the base `bg-primary` in favour of
    // `bg-muted`. The `hover:bg-primary/90` variant is a different property
    // and legitimately survives, so assert on class tokens, not substrings.
    expect(button.classList.contains('bg-muted')).toBe(true);
    expect(button.classList.contains('bg-primary')).toBe(false);
  });
});

describe('buttonVariants as a link', () => {
  /*
   * The recommended spelling for "a link that looks like a button". Asserted
   * because the obvious alternative — `<Button render={<a />}>` — either warns
   * or, with `nativeButton={false}`, announces the anchor as a button and
   * takes away middle-click and open-in-new-tab.
   */
  it('keeps link semantics while looking like a button', () => {
    render(
      <a href="/docs" className={buttonVariants({ variant: 'outline' })}>
        Docs
      </a>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(link).toHaveClass('inline-flex');
  });

  it('does not warn, because Base UI is not involved', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <a href="/docs" className={buttonVariants()}>
        Docs
      </a>,
    );

    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
