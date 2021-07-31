module.exports = {
  testEnvironment: 'jsdom', // jest-puppeteer cannot override
  preset: 'jest-puppeteer',
  collectCoverage: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  restoreMocks: true, // restore mock on each test without polluting test file
};
