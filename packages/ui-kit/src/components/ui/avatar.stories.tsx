/*
 * Copyright 2026 The Kubermatic ui-kit Authors.
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

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const MEMBERS = [
  { initials: 'AK', name: 'Anna Kern' },
  { initials: 'RS', name: 'Rui Santos' },
  { initials: 'MB', name: 'Mira Blum' },
  { initials: 'TO', name: 'Tomas Oleks' },
] as const;

/**
 * A placeholder portrait, drawn from the resolved design tokens.
 *
 * The obvious ways to source an avatar image are both wrong here. A remote URL
 * turns the story into a flaky test the moment the network is unavailable, and a
 * hard-coded data URI would put a literal colour in a story, which the token
 * rule forbids for good reason — it would be the one graphic in the kit that a
 * re-brand silently missed.
 *
 * Reading `--primary` and `--primary-foreground` back off the DOM avoids both:
 * the fixture is offline, deterministic, and re-renders on a theme change
 * because of the observer below. It uses a designed contrast pair rather than
 * two arbitrary tokens, so the silhouette stays legible in either theme.
 */
function useTokenPortrait() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [src, setSrc] = React.useState<string>();

  React.useEffect(() => {
    const read = () => {
      const element = ref.current;
      if (!element) {
        return;
      }

      const styles = getComputedStyle(element);
      const background = styles.getPropertyValue('--primary').trim();
      const figure = styles.getPropertyValue('--primary-foreground').trim();

      // An unresolved property reads back empty; emitting it would produce an
      // SVG that silently renders black rather than failing.
      if (!background || !figure) {
        return;
      }

      const svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">',
        `<rect width="64" height="64" fill="${background}"/>`,
        `<circle cx="32" cy="25" r="11" fill="${figure}"/>`,
        `<path d="M10 64c0-12 10-19 22-19s22 7 22 19Z" fill="${figure}"/>`,
        '</svg>',
      ].join('');

      setSrc(`data:image/svg+xml,${encodeURIComponent(svg)}`);
    };

    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return [ref, src] as const;
}

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Initials are the normal case here — these dashboards authenticate against an
 * OIDC provider and rarely receive a picture claim, so the fallback is what
 * renders almost every time.
 */
export const Playground: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
  ),
};

/**
 * The loaded path: the image resolves, so Base UI unmounts the fallback rather
 * than stacking the two.
 *
 * That unmount is the assertion worth making. An `AvatarImage` that failed to
 * load looks *almost* right — the fallback is still a round monogram in the same
 * spot — so checking only that something rendered would pass either way.
 */
export const Loaded: Story = {
  render: function LoadedPortrait() {
    const [ref, src] = useTokenPortrait();

    return (
      <div ref={ref} className="flex items-center gap-3">
        <Avatar>
          {src && <AvatarImage src={src} alt="Anna Kern" />}
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <span className="text-sm">Anna Kern</span>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const image = await canvas.findByRole('img', { name: 'Anna Kern' });
    await expect(image).toBeVisible();

    // Loading is async, so the fallback is still mounted for the first frames.
    await waitFor(async () => {
      await expect(canvas.queryByText('AK')).toBeNull();
    });
  },
};

/**
 * The other half of the contract: the `src` cannot resolve, so Base UI swaps in
 * the fallback. Anything that renders only a fallback without an `AvatarImage`
 * beside it never exercises that swap.
 */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/does-not-resolve.png" alt="" />
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('AK')).toBeVisible();
  },
};

/** Size comes from the root's utility classes; the parts fill it. */
export const Sizes: Story = {
  render: function SizedPortraits() {
    const [ref, src] = useTokenPortrait();

    return (
      <div ref={ref} className="flex items-center gap-4">
        <Avatar className="size-6">
          {src && <AvatarImage src={src} alt="" />}
          <AvatarFallback className="text-[0.625rem]">AK</AvatarFallback>
        </Avatar>
        <Avatar>
          {src && <AvatarImage src={src} alt="" />}
          <AvatarFallback className="text-xs">AK</AvatarFallback>
        </Avatar>
        <Avatar className="size-12">
          {src && <AvatarImage src={src} alt="" />}
          <AvatarFallback className="text-sm">AK</AvatarFallback>
        </Avatar>
      </div>
    );
  },
};

/**
 * The stack a project-members column renders. The ring is drawn in the page
 * background colour so overlapping avatars separate cleanly in both themes — a
 * fixed white ring would smear in dark.
 */
export const Stack: Story = {
  render: () => (
    <div className="flex items-center">
      {MEMBERS.map((member) => (
        <Avatar
          key={member.initials}
          className="ring-background -ml-2 ring-2 first:ml-0"
        >
          <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
        </Avatar>
      ))}
      <Avatar className="ring-background -ml-2 ring-2">
        <AvatarFallback className="text-muted-foreground text-xs">
          +7
        </AvatarFallback>
      </Avatar>
    </div>
  ),
};
