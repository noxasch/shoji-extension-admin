const extensionPath = 'dist/debug';
const dummyExtPath = 'tests/fixtures/dummy_ext';
// use by jest-puppeteer to config puppeteer since we don't need setup files
module.exports = {
  launch: {
    dumpio: true,
    headless: false, // cannot be headless to load extension
    product: 'chrome',
    args: [
      `--disable-extensions-except=${extensionPath},${dummyExtPath}`,
      `--load-extension=${extensionPath},${dummyExtPath}`,
    ],
  },
  browserContext: 'default',
};
