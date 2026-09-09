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
import { act } from 'react';
import { describe, expect, it } from 'vitest';

import { setPrefersDark } from '@/test/match-media';

import { useMediaQuery } from './use-media-query';

function Probe() {
  const matches = useMediaQuery('(prefers-color-scheme: dark)');
  return <span data-testid="probe">{String(matches)}</span>;
}

describe('useMediaQuery', () => {
  it('reports the current match after mount', () => {
    setPrefersDark(true);
    render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveTextContent('true');
  });

  it('reports false when the query does not match', () => {
    render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveTextContent('false');
  });

  it('updates when the query starts matching', () => {
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('false');

    act(() => setPrefersDark(true));

    expect(screen.getByTestId('probe')).toHaveTextContent('true');
  });
});
