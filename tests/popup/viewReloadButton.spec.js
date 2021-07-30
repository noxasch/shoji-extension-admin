/**
 * @jest-environment jsdom
 */
/* eslint-disable no-console */
import userEvent from '@testing-library/user-event';
import ViewReloadButton from '../../src/popup/viewReloadButton';
import popupHtml from '../fixtures/popup';
import { reloadAllDev } from '../../src/lib/management';
import { createNotification } from '../../src/lib/notifications';

jest.mock('../../src/lib/management');
jest.mock('../../src/lib/notifications');

describe('ViewReloadButton', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.useFakeTimers(); // sequence matter
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
    // suppress jsdom console.error
    //  https://dev.to/martinemmert/hide-red-console-error-log-wall-while-testing-errors-with-jest-2bfn
    jest.spyOn(console, 'error');
    console.error.mockImplementation(() => null);
  });

  afterEach(() => {
    // sequence matter
    window.requestAnimationFrame.mockRestore();
    console.error.mockRestore();
    // jest.useRealTimers();
    jest.clearAllTimers(); // avoid infinite loop
  });

  test('Should throw an error', () => {
    document.body.innerHTML = '<div class="s"></div>';
    expect(() => ViewReloadButton.registerReloadEvent()).toThrow(TypeError);
  });

  test('Should register event with no error', () => {
    document.body.innerHTML = popupHtml;
    expect(() => ViewReloadButton.registerReloadEvent()).not.toThrow(TypeError);
  });

  test('Spin should throw error', () => {
    document.body.innerHTML = `<div id="${ViewReloadButton.reloadBtnId}"></div>`;
    expect(() => ViewReloadButton.spin())
      .toThrow(TypeError('mdi-reload is undefined'));

    document.body.innerHTML = '<div id="othername"></div>';
    expect(() => ViewReloadButton.spin())
      .toThrow(TypeError('Reload button is undefined'));
  });

  test('Should add loading state', () => {
    document.body.innerHTML = popupHtml;
    expect(document.querySelector('.mdi-reload')).toBeTruthy();
    expect(() => ViewReloadButton.spin()).not
      .toThrow(TypeError('mdi-reload is undefined'));
    // ViewReloadButton.spin();
    expect(window.requestAnimationFrame).toBeCalled();
    expect(ViewReloadButton.reloading).toBeTruthy();
    expect(document.querySelector('.mdi-loading.mdi-spin')).toBeTruthy();
    expect(document.querySelector('.mdi-reload')).toBeFalsy();
  });

  test('removeSpin should throw error', () => {
    document.body.innerHTML = `<div id="${ViewReloadButton.reloadBtnId}"></div>`;
    expect(() => ViewReloadButton.removeSpin())
      .toThrow(TypeError('mdi-reload is undefined'));

    document.body.innerHTML = '<div id="othername"></div>';
    expect(() => ViewReloadButton.removeSpin())
      .toThrow(TypeError('Reload button is undefined'));
  });

  test('Should remove loading state', () => {
    document.body.innerHTML = popupHtml;
    ViewReloadButton.spin();
    expect(ViewReloadButton.reloading).toBeTruthy();
    ViewReloadButton.removeSpin();
    expect(window.requestAnimationFrame).toBeCalledTimes(2);
    expect(ViewReloadButton.reloading).toBeFalsy();
    expect(document.querySelector('.mdi-loading.mdi-spin')).toBeFalsy();
    expect(document.querySelector('.mdi-reload')).toBeTruthy();
  });

  test('Should call onClickReloadButton', async () => {
    jest.spyOn(ViewReloadButton, 'onClickReloadButton');
    jest.spyOn(ViewReloadButton, 'spin');
    jest.spyOn(ViewReloadButton, 'removeSpin');
    reloadAllDev.mockImplementation(() => Promise.resolve());
    createNotification.mockRestore(() => null);
    // jest.spyOn(window, 'setTimeOut');
    // jest.spyOn(ViewReloadButton, 'spin');
    document.body.innerHTML = popupHtml;
    ViewReloadButton.registerReloadEvent();
    expect(ViewReloadButton.reloading).toBeFalsy();
    // jest.useFakeTimers();
    userEvent.click(document.getElementById(ViewReloadButton.reloadBtnId));
    expect(ViewReloadButton.onClickReloadButton).toBeCalled();
    expect(ViewReloadButton.spin).toBeCalled();
    // expect(() => reloadAllDev).resolves.toBeCalled();
    await reloadAllDev();
    // expect(reloadAllDev).toBeCalled();
    expect(setTimeout).toBeCalled();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2000);
    jest.runAllTimers();
    expect(ViewReloadButton.removeSpin).toBeCalled();
    expect(createNotification).toBeCalled();
  });

  test('Should call init', () => {
    jest.spyOn(ViewReloadButton, 'registerReloadEvent');
    document.body.innerHTML = popupHtml;
    ViewReloadButton.init();
    expect(ViewReloadButton.registerReloadEvent).toBeCalled();
  });
});
