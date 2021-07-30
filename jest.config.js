module.exports = {
  // testEnvironment: 'jsdom', // jest-puppeteer need to override
  modulePathIgnorePatterns: ['cypress'],
  preset: 'jest-puppeteer',
  // setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverage: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  // setupFiles: ['./tests/setup.js'],
  // testEnvironmentOptions: {
  // },
};
