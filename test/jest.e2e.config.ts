import type { Config } from 'jest';
import { default as projectConfig } from '../jest.config';

const config: Config = {
  ...projectConfig,
  rootDir: '.',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^@/(.*)$': '<rootDir>/../src/$1',
    '^test/(.*)$': '<rootDir>/$1',
  },
  testRegex: '.e2e-spec.ts$',
};

export default config;
