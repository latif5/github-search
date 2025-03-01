import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-fixed-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        module: 'esnext', 
      }
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
