const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',

  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transformIgnorePatterns: [
    '/node_modules/(?!lucide-react)/', // Ensure lucide-react is transpiled
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
