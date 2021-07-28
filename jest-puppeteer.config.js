const extensionPath = 'dist/debug';

module.exports = {
  launch: {
    dumpio: true,
    headless: false,
    product: 'chrome',
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  },
  browserContext: 'default',
};
