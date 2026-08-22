import * as React from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';

import './preview.css';

/**
 * The kit ships light and dark token sets, with dark selected by a `.dark`
 * class on an ancestor. Every story renders inside that wrapper so the toolbar
 * switch exercises the same mechanism a consuming app uses.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark';

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.style.background = 'var(--background)';
  }, [theme]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="bg-background text-foreground p-6">
        <Story />
      </div>
    </div>
  );
};

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
