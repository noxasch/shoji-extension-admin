module.exports = {
  testEnvironment: 'jsdom', // jest-puppeteer cannot override
  preset: 'jest-puppeteer',
  collectCoverage: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};
