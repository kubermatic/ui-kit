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

import { Tabs, TabsList, TabsPanel, TabsTab } from './tabs';

const setup = (variant?: 'underline' | 'pill') =>
  render(
    <Tabs defaultValue="overview">
      <TabsList variant={variant}>
        <TabsTab value="overview" variant={variant}>
          Overview
        </TabsTab>
        <TabsTab value="yaml" variant={variant}>
          YAML
        </TabsTab>
      </TabsList>
      <TabsPanel value="overview">overview body</TabsPanel>
      <TabsPanel value="yaml">yaml body</TabsPanel>
    </Tabs>,
  );

describe('Tabs', () => {
  /*
   * One product's `DetailTabs` is a row of `<button>`s with an `onChange`: no
   * tablist, no arrow-key movement, and no `aria-controls` linking a tab to
   * its panel.
   */
  it('is a real tablist with linked panels', () => {
    setup();

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const tab = screen.getByRole('tab', { name: 'Overview' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('aria-controls', screen.getByRole('tabpanel').id);
  });

  it('switches on click', async () => {
    setup();
    await userEvent.click(screen.getByRole('tab', { name: 'YAML' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('yaml body');
  });

  /*
   * Base UI moves focus with the arrows and activates on Enter — manual
   * activation, which is the right default for tabs whose panels cost
   * something to render: automatic activation would fetch every tab's data on
   * the way past it.
   */
  it('moves focus with the arrow keys and activates on Enter', async () => {
    setup();

    screen.getByRole('tab', { name: 'Overview' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'YAML' })).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('tab', { name: 'YAML' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('yaml body');
  });

  describe.each([
    ['underline', 'data-active:text-primary'],
    ['pill', 'data-active:text-foreground'],
  ] as const)('%s variant', (variant, selectedStyling) => {
    it('keys its selected styling off the attribute Base UI sets', async () => {
      setup(variant);
      const overview = screen.getByRole('tab', { name: 'Overview' });
      const yaml = screen.getByRole('tab', { name: 'YAML' });

      expect(overview).toHaveClass(selectedStyling);
      expect(overview).toHaveAttribute('data-active');
      expect(yaml).not.toHaveAttribute('data-active');

      await userEvent.click(yaml);
      expect(yaml).toHaveAttribute('data-active');
      expect(overview).not.toHaveAttribute('data-active');
    });
  });

  it('styles the pill variant differently from the underline one', () => {
    const { unmount } = setup('underline');
    expect(screen.getByRole('tablist')).toHaveClass('border-b');
    unmount();

    setup('pill');
    expect(screen.getByRole('tablist')).toHaveClass('bg-muted');
  });
});
