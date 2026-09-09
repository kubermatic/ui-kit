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

import { Timeline, TimelineItem } from './timeline';

describe('Timeline', () => {
  /* An ordered list, because the order is the content. */
  it('is an ordered list of events', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem tone="success" title="Synced" timestamp="2 min ago" />
        <TimelineItem tone="error" title="Failed" timestamp="1 h ago">
          connection refused
        </TimelineItem>
      </Timeline>,
    );

    expect(container.querySelector('ol')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders the title, timestamp and body', () => {
    render(
      <Timeline>
        <TimelineItem title="Failed" timestamp="1 h ago">
          connection refused
        </TimelineItem>
      </Timeline>,
    );

    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('1 h ago')).toBeInTheDocument();
    expect(screen.getByText('connection refused')).toBeInTheDocument();
  });

  it('takes a custom marker', () => {
    render(
      <Timeline>
        <TimelineItem title="Deployed" marker={<span data-testid="marker">*</span>} />
      </Timeline>,
    );
    expect(screen.getByTestId('marker')).toBeInTheDocument();
  });
});
