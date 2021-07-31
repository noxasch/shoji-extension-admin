const extensionPath = 'dist/debug';
// use by jest-puppeteer to config puppeteer since we don't need setup files
module.exports = {
  launch: {
    dumpio: true,
    headless: false, // cannot be headless to load extension
    product: 'chrome',
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  },
  browserContext: 'default',
};
