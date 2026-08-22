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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
