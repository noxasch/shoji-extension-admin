require('dotenv').config();
const pti = require('puppeteer-to-istanbul');
const ViewReloadButton = require('../src/popup/viewReloadButton');

// require('expect-puppeteer');

const extensionID = process.env.EXTENSION_ID;

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

describe('', () => {
  // this.timeout = '10000';
  beforeAll(async () => {
    await page.coverage.startJSCoverage();
    await page.coverage.startCSSCoverage();
  }, 5000);

  afterAll(async () => {
    const [jsCoverage, cssCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage(),
    ]);
    pti.write([...jsCoverage, ...cssCoverage], {
      storagePath: './.nyc_output',
    });
  });

  beforeEach(async () => {
    await page
      .goto(`chrome-extension://${extensionID}/popup.html`);
    // page.on('console', (msg) => {
    //   for (let i = 0; i < msg.args().length; i += 1) {
    //     console.log(`${i}: ${msg.args()[i]}`);
    //   }
    // });
    jest.setTimeout(10000);
  }, 5000);

  test('test popup', async () => {
    await expect(page.title()).resolves.toMatch('Shoji Extension - Popup');
    const inputElement = await page
      .$$(`#${ViewReloadButton.default.reloadBtnId}`);
    expect(inputElement).toBeTruthy();
    expect(inputElement.length).toBe(1);
    await page.click(`#${ViewReloadButton.default.reloadBtnId}`);
    const spinner = await page.$('.mdi-loading');
    // expect(spinner).toBeTruthy();
    await delay(5000);
    expect(spinner).toBeFalsy();
  }, 10000);

  test('test popup', async () => {
    const listItem = await page
      .$$('.list-item');
    expect(listItem).toBeTruthy();
    expect(listItem.length).toBe(1);
    // await page.click(`#${ViewReloadButton.default.reloadBtnId}`);
    const spinner = await page.$('.mdi-loading');
    // // expect(spinner).toBeTruthy();
    await delay(5000);
    expect(spinner).toBeFalsy();
  }, 10000);

  test('test background page', async () => {
    const targets = await browser.targets();
    const backgroundPageTarget = targets.find(
      (target) => target.type() === 'background_page',
    );
    const backgroundPage = await backgroundPageTarget.page();
    expect(backgroundPage).toBeTruthy();
    await backgroundPage.keyboard.down('Alt');
    await backgroundPage.keyboard.press('R');
    await backgroundPage.keyboard.up('Alt');
    await delay(5000);
  }, 10000);
});
