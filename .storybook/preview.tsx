import * as React from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';

import './preview.css';

/**
 * Dialogs, dropdowns and tooltips portal into `document.body`, outside the
 * decorator's wrapper, so the class is toggled on `documentElement` as well —
 * otherwise portalled content would stay light while the story goes dark.
 */
function ThemeWrapper({
  theme,
  children,
}: {
  theme: 'light' | 'dark';
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="bg-background text-foreground p-6">{children}</div>
    </div>
  );
}

const withTheme: Decorator = (Story, context) => (
  <ThemeWrapper theme={context.globals.theme as 'light' | 'dark'}>
    <Story />
  </ThemeWrapper>
);

const preview: Preview = {
  decorators: [withTheme],
  /*
   * Autodocs: every meta gets a generated Docs page listing its stories, the
   * JSDoc above each one, and — where the meta names a `component` — a props
   * table derived from its types. Opt-out per meta with `tags: ['!autodocs']`.
   */
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Design token set',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    /*
     * Sidebar order. Without this the sections sort alphabetically, which puts
     * Foundations above the Welcome page and leaves the Storybook opening on a
     * token catalogue rather than on the install instructions.
     */
    options: {
      storySort: {
        order: ['Welcome', 'Foundations', 'Primitives'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      /*
       * 'error' - fail the test run on any axe violation
       * 'todo'  - report in the a11y panel only, never fail
       * 'off'   - skip the checks entirely
       *
       * Enforced rather than advisory: a violation that only ever appears in a
       * panel is a violation nobody reads. Every story is an axe run, so a
       * primitive cannot regress its own accessibility without failing CI.
       *
       * A story that renders a deliberately incomplete fragment can opt out with
       * `parameters: { a11y: { test: 'todo' } }` — say so in a comment when you do.
       */
      test: 'error',
      /*
       * Every axe rule is on, `color-contrast` included.
       *
       * It was off for a while: the palette had six failing token pairs and the
       * rule reported them ~169 times across every story that rendered muted
       * text. Those are fixed at the token level now, so the rule is back to
       * doing what it is good at — catching a *new* pairing that misses AA.
       *
       * `Foundations/Contrast` still exists and is not redundant. Story-level
       * a11y runs against the default globals only, so axe never sees the dark
       * theme; that story measures both, reports exact ratios, and fails if the
       * known-failing set changes in either direction.
       */
    },
  },
};

export default preview;
