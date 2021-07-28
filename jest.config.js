module.exports = {
  // testEnvironment: 'jsdom', // jest-puppeteer need to override
  modulePathIgnorePatterns: ['cypress'],
  preset: 'jest-puppeteer',
  // setupFilesAfterEnv: ['./jest.setup.js'],
  // collectCoverage: true,
  coverageReporters: ['json', 'text', 'lcov'],
  collectCoverage: true,
  // setupFiles: ['./tests/setup.js'],
  // testEnvironmentOptions: {
  // },
};
