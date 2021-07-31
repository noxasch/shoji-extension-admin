/**
 * @jest-environment puppeteer
 */
require('dotenv').config();
const pti = require('puppeteer-to-istanbul');
const ViewReloadButton = require('../src/popup/viewReloadButton');

// require('expect-puppeteer'); // for custom puppeteer setup

const extensionID = process.env.EXTENSION_ID;

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

describe('', () => {
  // this.timeout = '10000';
  beforeEach(async () => {
    await page.coverage.startJSCoverage();

    await page
      .goto(`chrome-extension://${extensionID}/popup.html`);
    // page.on('console', (msg) => {
    //   for (let i = 0; i < msg.args().length; i += 1) {
    //     console.log(`${i}: ${msg.args()[i]}`);
    //   }
    // });

    // await page.coverage.startCSSCoverage();
    // const targets = await browser.targets();
    // const backgroundPageTarget = targets.find(
    //   (target) => target.type() === 'background_page',
    // );
    // const backgroundPage = await backgroundPageTarget.page();
    // await backgroundPage.coverage.startJSCoverage();
    // backgroundPage.on('console', (msg) => {
    //   for (let i = 0; i < msg.args().length; i += 1) {
    //     console.log(`bg ${i}: ${msg.args()[i]}`);
    //   }
    // });

    jest.setTimeout(10000);
  }, 5000);

  afterEach(async () => {
    // const targets = await browser.targets();
    // const backgroundPageTarget = targets.find(
    //   (target) => target.type() === 'background_page',
    // );
    // const backgroundPage = await backgroundPageTarget.page();

    const [jsCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      // page.coverage.stopCSSCoverage(),
      // backgroundPage.coverage.stopJSCoverage(),
    ]);
    pti.write([...jsCoverage], {
      storagePath: './.nyc_output',
    });
  });

  // beforeEach(async () => {
  //   await page
  //     .goto(`chrome-extension://${extensionID}/popup.html`);
  //   page.on('console', (msg) => {
  //     for (let i = 0; i < msg.args().length; i += 1) {
  //       console.log(`${i}: ${msg.args()[i]}`);
  //     }
  //   });
  //   jest.setTimeout(10000);
  // }, 5000);

  test('test popup', async () => {
    await expect(page.title()).resolves.toMatch('Shoji Extension - Popup');
    const inputElement = await page
      .$$(`#${ViewReloadButton.default.reloadBtnId}`);
    expect(inputElement).toBeTruthy();
    expect(inputElement.length).toBe(1);
    await expect(page.$('.mdi-spin')).resolves.toBeFalsy();
    await expect(page.$('.mdi-reload')).resolves.toBeTruthy();
    await page.click(`#${ViewReloadButton.default.reloadBtnId}`);
    await delay(500);
    await expect(page.$('.mdi-reload')).resolves.toBeFalsy();
    await expect(page.$('.mdi-spin')).resolves.toBeTruthy();
    await delay(2000);
    await expect(page.$('.mdi-spin')).resolves.toBeFalsy();
    await expect(page.$('.mdi-reload')).resolves.toBeTruthy();
  }, 20000);

  test('Popup should contain 1 list item', async () => {
    const listItem = await page
      .$$('.list-item');
    expect(listItem).toBeTruthy();
    expect(listItem.length).toBe(1);
    const spinner = await page.$('.mdi-loading.mdi-spin');
    expect(spinner).toBeFalsy();
  }, 10000);

  test('Clicking the button', async () => {
    expect(page.$(`#${ViewReloadButton.default.reloadBtnId}`)).resolves.toBeTruthy();
    expect(page.$('.mdi-reload')).resolves.toBeTruthy();
    await page.click(`#${ViewReloadButton.default.reloadBtnId}`);
    await delay(200); // wait 200ms for the animation to start
    expect(page.$('.mdi-loading.mdi-spin')).resolves.toBeTruthy();
    await delay(2000); // wait another 2sec
    expect(page.$('.mdi-loading.mdi-spin')).resolves.toBeFalsy();
  });

  test('test background page', async () => {
    const targets = await browser.targets();
    const backgroundPageTarget = targets.find(
      (target) => target.type() === 'background_page',
    );
    const backgroundPage = await backgroundPageTarget.page();
    expect(backgroundPage).toBeTruthy();
    // background page exist but these keys does not seems to work
    // in puppeteer
    await page.keyboard.down('Alt');
    await page.keyboard.press('R');
    await page.keyboard.up('Alt');
    await delay(5000);
  }, 10000);
});
