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

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

describe('Card', () => {
  it('renders every part', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>What this is.</CardDescription>
          <CardAction>
            <button type="button">Edit</button>
          </CardAction>
        </CardHeader>
        <CardContent>body</CardContent>
        <CardFooter>footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('What this is.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
    expect(screen.getByText('footer')).toBeInTheDocument();
  });

  /* So a card that *is* a labelled region of the page can be a `<section>`. */
  it('renders as another element when asked', () => {
    render(<Card as="section" aria-label="Panel" />);
    expect(screen.getByRole('region', { name: 'Panel' })).toBeInTheDocument();
  });

  it('renders the title as a heading when asked', () => {
    render(<CardTitle as="h2">Conditions</CardTitle>);
    expect(screen.getByRole('heading', { level: 2, name: 'Conditions' })).toBeInTheDocument();
  });

  it('lets an incoming className win', () => {
    const { container } = render(<Card className="bg-muted" />);
    expect(container.querySelector('[data-slot="card"]')).toHaveClass('bg-muted');
    expect(container.querySelector('[data-slot="card"]')).not.toHaveClass('bg-background');
  });
});
