/* eslint-disable no-empty-pattern */
import tabs from '../../src/lib/tabs';
import tabList from '../fixtures/tabList';

describe('tabs API', () => {
  test('getAll should return list of tabs', () => {
    chrome.tabs.query.mockImplementation(({}, cb) => cb(tabList));
    expect(tabs.getAll()).resolves.toEqual(tabList);
  });

  test('getAll should reject with error', () => {
    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.tabs.query.mockImplementation(({}, cb) => {
      chrome.runtime.lastError = lastError;
      cb();
      delete chrome.runtime.lastError;
    });
    expect(tabs.getAll()).rejects.toEqual(lastErrorMessage);
  });

  test('reload should return promise void', () => {
    chrome.tabs.reload.mockImplementation((tabId, opts, cb) => cb());
    expect(tabs.reload()).resolves.not.toThrow();
  });

  test('reload should reject with error', () => {
    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.tabs.reload.mockImplementation((tabId, opts, cb) => {
      chrome.runtime.lastError = lastError;
      cb();
      delete chrome.runtime.lastError;
    });
    expect(tabs.reload()).rejects.toEqual(lastErrorMessage);
  });
});
