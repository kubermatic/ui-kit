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
import { describe, expect, it } from 'vitest';

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './drawer';

const setup = (side?: 'left' | 'right' | 'top' | 'bottom') =>
  render(
    <Drawer defaultOpen>
      <DrawerContent side={side}>
        <DrawerHeader>
          <DrawerTitle>Sync errors</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>the trace</DrawerBody>
        <DrawerFooter>footer</DrawerFooter>
      </DrawerContent>
    </Drawer>,
  );

describe('Drawer', () => {
  /*
   * Built on Base UI's Dialog, so it brings the focus trap, the inert
   * background and the escape handling with it — which is what one product's
   * hand-rolled panel lacks.
   */
  it('is a named modal dialog', () => {
    setup();
    expect(screen.getByRole('dialog', { name: 'Sync errors' })).toBeInTheDocument();
    expect(screen.getByText('the trace')).toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    setup();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('slides in from the requested edge', () => {
    const { unmount } = setup('left');
    expect(screen.getByRole('dialog')).toHaveClass('left-0');
    unmount();

    setup('bottom');
    expect(screen.getByRole('dialog')).toHaveClass('bottom-0');
  });

  it('defaults to the right edge', () => {
    setup();
    expect(screen.getByRole('dialog')).toHaveClass('right-0');
  });
});

describe('Drawer parts', () => {
  it('renders a description and takes a width', () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent size="lg">
          <DrawerHeader>
            <DrawerTitle>Sync errors</DrawerTitle>
            <DrawerDescription>Last 24 hours.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByRole('dialog', { name: 'Sync errors' })).toHaveAccessibleDescription(
      'Last 24 hours.',
    );
    expect(screen.getByRole('dialog')).toHaveClass('sm:max-w-2xl');
  });

  it('can omit the close button', () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent showClose={false}>
          <DrawerTitle>Busy</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('slides in from the top edge', () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent side="top">
          <DrawerTitle>Notice</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('top-0');
  });
});
