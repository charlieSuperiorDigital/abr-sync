import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  js.configs.recommended,
  ...compat.config({
    extends: ['next/core-web-vitals', 'prettier'],
  }),
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          args: 'none',
          vars: 'all',
          caughtErrors: 'all',
          ignoreRestSiblings: true,
        },
      ],
      'prefer-const': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'off',
    },
  },
  // Add a new configuration object for test files
  {
    files: ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx'],
    env: {
      jest: true,
      node: true,
    },
    globals: {
      describe: 'readonly',
      it: 'readonly',
      expect: 'readonly',
      jest: 'readonly',
    },
  },
]

export default eslintConfig
