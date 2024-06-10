import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/$1',
    '^test/(.*)$': '<rootDir>/../$1',
    "^@/decorators/(.*)$": "<rootDir>/decorators/$1",
    "^@/interceptors/(.*)$": "<rootDir>/interceptors/$1",
    "^@/middlewares/(.*)$": "<rootDir>/middlewares/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
    "^@/guards/(.*)$": "<rootDir>/guards/$1"
  },
  testEnvironment: 'node',
};

export default config;
