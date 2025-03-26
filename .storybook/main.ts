import type { StorybookConfig } from "@storybook/experimental-nextjs-vite";
import path from 'path';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],
  "framework": {
    "name": "@storybook/experimental-nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  "viteFinal": async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../'),
      };
    }
    // Add PostCSS configuration
    if (config.css) {
      config.css.postcss = require('./postcss.config.js');
    }
    return config;
  }
};

export default config;