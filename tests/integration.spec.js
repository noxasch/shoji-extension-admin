/**
 * @jest-environment puppeteer
 */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
// also count as e2e test since we run with actual chrome API
require('dotenv').config(); // include extension pem and
const pti = require('puppeteer-to-istanbul');
const ViewReloadButton = require('../src/popup/viewReloadButton');

// require('expect-puppeteer'); // for custom puppeteer setup

const extensionID = process.env.EXTENSION_ID;

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// function extract(jsHandle) {
//   return jsHandle.executionContext().evaluate((obj) => {
//     // serialize |obj| however you want
//     // return 'Obj ' + (typeof obj);
//     return obj;
//   }, jsHandle);
// }

describe('', () => {
  // this.timeout = '10000';
  beforeEach(async () => {
    await page.coverage.startJSCoverage();

    await page
      .goto(`chrome-extension://${extensionID}/popup.html`);
    // page.on('console', async (msg) => {
    //   const args = await Promise.all(msg.args().map((arg) => extract(arg)));
    //   console.log(msg.text(), ...args);
    // });
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

  test('Popup should contain 2 item in the list', async () => {
    const listItem = await page
      .$$('.list-item');
    expect(listItem).toBeTruthy();
    expect(listItem.length).toBe(2);
    const spinner = await page.$('.mdi-loading.mdi-spin');
    expect(spinner).toBeFalsy();
  }, 10000);

  test('Clicking the button', async () => {
    const dummyExt = await page.$(`.list-item:not([data-id="${extensionID}"])`);
    const checkbox = await dummyExt.$('.toggle .toggle-checkbox');
    expect(page.$(`#${ViewReloadButton.default.reloadBtnId}`)).resolves.toBeTruthy();
    expect(page.$('.mdi-reload')).resolves.toBeTruthy();
    await expect((await checkbox.getProperty('checked')).jsonValue()).resolves.toBeTruthy();
    await page.click(`#${ViewReloadButton.default.reloadBtnId}`);
    await delay(200); // wait 200ms for the animation to start
    expect(page.$('.mdi-loading.mdi-spin')).resolves.toBeTruthy();
    await delay(2000); // wait another 2sec
    expect(page.$('.mdi-loading.mdi-spin')).resolves.toBeFalsy();
    await expect((await checkbox.getProperty('checked')).jsonValue()).resolves.toBeTruthy();
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
    // await delay(5000);
  }, 10_000);

  test('toggleSwitch', async () => {
    const dummyExt = await page.$(`.list-item:not([data-id="${extensionID}"])`);
    const sw = await dummyExt.$('.toggle');
    const cbox = await sw.$('.toggle-checkbox');
    await sw.click();
    await delay(200);
    await expect((await cbox.getProperty('checked')).jsonValue()).resolves.toBeFalsy();
    await sw.click();
    await delay(200);
    await expect((await cbox.getProperty('checked')).jsonValue()).resolves.toBeTruthy();
  }, 10_000);

  test('search', async () => {
    let listItem = await page.$$('.list-item[data-id]');
    expect(listItem.length).toBe(2);
    await page.focus('#search');
    await page.keyboard.down('S');
    await page.keyboard.up('S');
    await page.keyboard.down('H');
    await page.keyboard.up('H');
    await delay(600);
    listItem = await page.$$('.list-item[data-id]');
    expect(listItem.length).toBe(1);
    await page.keyboard.down('Backspace');
    await page.keyboard.up('Backspace');
    await page.keyboard.down('Backspace');
    await page.keyboard.up('Backspace');
    await page.keyboard.down('Backspace');
    await page.keyboard.up('Backspace');
    await delay(600);
    listItem = await page.$$('.list-item[data-id]');
    expect(listItem.length).toBe(2);
  }, 10_000);
});
