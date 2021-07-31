module.exports = {
  preset: 'jest-puppeteer',
  testRegex: 'integration',
  collectCoverage: true,
  testMatch: [
    'integration.spec.js',
  ],
};
// an alternative jest.config.js when we plan to use two kind of test
// with different config for e2e only
