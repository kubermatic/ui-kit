/*
Copyright 2026 The Kubermatic Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { useCallback, useRef, type ReactNode } from 'react';

import type { Decorator } from '@storybook/react-vite';

import { ThemeProvider, type ResolvedTheme } from '../packages/ui-kit/src/hooks/use-theme';

/**
 * Scopes the theme to the story canvas: the provider paints the wrapper
 * element instead of `<html>`, so switching themes restyles the story and
 * leaves Storybook's own chrome alone.
 *
 * `storageKey={null}` matters here. With persistence on, a story that changes
 * the theme would write it to localStorage and every *other* story would open
 * in that theme — including in the accessibility run, where a story's palette
 * would then depend on which story ran before it.
 */
function ThemeCanvas({
  theme,
  padded,
  children,
}: {
  theme: ResolvedTheme;
  padded: boolean;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const getThemeRoot = useCallback(() => rootRef.current, []);

  return (
    <div ref={rootRef}>
      <ThemeProvider key={theme} defaultTheme={theme} storageKey={null} getThemeRoot={getThemeRoot}>
        <div className={`bg-background text-foreground ${padded ? 'p-6' : ''}`}>{children}</div>
      </ThemeProvider>
    </div>
  );
}

/**
 * Applies the toolbar's theme to every story.
 *
 * The canvas still needs a background of its own — Storybook's iframe is white
 * regardless of theme, and a dark story on a white page is both ugly and a
 * false negative for contrast checking, since axe measures against whatever is
 * actually painted behind the text.
 */
export const withTheme: Decorator = (Story, context) => (
  <ThemeCanvas
    theme={context.globals.theme === 'dark' ? 'dark' : 'light'}
    // `fullscreen` stories lay out their own page and supply their own gutter.
    padded={context.parameters.layout !== 'fullscreen'}
  >
    <Story />
  </ThemeCanvas>
);
