import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.ts',
    '<rootDir>/src/**/*.test.ts'
  ],
  moduleNameMapper: {
    '^@pages$': '<rootDir>/src/pages',
    '^@components$': '<rootDir>/src/components',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@selectors$': '<rootDir>/src/services/selectors',
    '\\.(css|module\\.css)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx'
        }
      }
    ]
  }
};

export default config;
