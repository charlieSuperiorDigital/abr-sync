import React from 'react';
import type { Preview } from "@storybook/react";
import '../app/[locale]/globals.css';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen p-4 bg-white">
        <div className="flex items-center justify-center">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default preview;
