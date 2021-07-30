/**
 * @jest-environment jsdom
 */
/* eslint-disable no-console */
import ViewReloadButton from '../../src/popup/viewReloadButton';

beforeEach(() => {
  document.body.innerHTML = '';
  // suppress jsdom console.error
  //  https://dev.to/martinemmert/hide-red-console-error-log-wall-while-testing-errors-with-jest-2bfn
  jest.spyOn(console, 'error');
  console.error.mockImplementation(() => null);
});

afterEach(() => {
  jest.useRealTimers();
  console.error.mockRestore();
});

test('', () => {
  jest.useFakeTimers();
  // eslint-disable-next-line max-len
  document.body.innerHTML = '<div class="s"></div>';
  // ViewReloadButton.registerReloadEvent();
  expect(() => ViewReloadButton.registerReloadEvent()).toThrow(TypeError);
});
