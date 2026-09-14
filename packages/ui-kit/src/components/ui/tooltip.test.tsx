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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from './tooltip';

describe('Tooltip', () => {
  /*
   * A tooltip is supplementary — `aria-describedby`, not a label. So it must
   * never be the only place information exists: an icon button still needs its
   * own `aria-label`, because a tooltip is unreachable by touch.
   */
  it('describes its trigger without naming it', async () => {
    render(
      <TooltipProvider delay={0}>
        <Tooltip content="Copies the kubeconfig">
          <Button aria-label="Copy kubeconfig">C</Button>
        </Tooltip>
      </TooltipProvider>,
    );

    /*
     * Focused by tabbing rather than by calling `.focus()`: Base UI opens on
     * `:focus-visible`, which a programmatic focus does not set — correct
     * behaviour, since a tooltip should not appear when a click moved focus.
     */
    await userEvent.tab();

    const trigger = screen.getByRole('button', { name: 'Copy kubeconfig' });
    await waitFor(() => expect(trigger).toHaveAccessibleDescription('Copies the kubeconfig'));
  });

  it('hides again when focus leaves', async () => {
    render(
      <TooltipProvider delay={0}>
        <Tooltip content="Copies the kubeconfig">
          <Button aria-label="Copy">C</Button>
        </Tooltip>
      </TooltipProvider>,
    );

    await userEvent.tab();
    await waitFor(() => expect(screen.getByText('Copies the kubeconfig')).toBeInTheDocument());

    await userEvent.tab();
    await waitFor(() =>
      expect(screen.queryByText('Copies the kubeconfig')).not.toBeInTheDocument(),
    );
  });
});

describe('TooltipContent', () => {
  it('can draw an arrow', async () => {
    render(
      <TooltipProvider delay={0}>
        <TooltipRoot defaultOpen>
          <TooltipTrigger render={<Button aria-label="Info">i</Button>} />
          <TooltipContent arrow side="bottom">
            Details
          </TooltipContent>
        </TooltipRoot>
      </TooltipProvider>,
    );

    await waitFor(() => expect(screen.getByText('Details')).toBeInTheDocument());
  });
});
