/* eslint-disable no-empty-pattern */
import tabs from '../../src/lib/tabs';
import tabList from '../fixtures/tabList';
import extensionInfos from '../fixtures/extensionsList';

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

  test('matchByUrls should return tabs matched by string id', () => {
    // const extIds = [extensionInfos[0].id];
    const matchedTabs = tabs._tabsMatchByUrls(tabList, [extensionInfos[0].id]);
    expect(matchedTabs.length).toBe(1);
    expect(matchedTabs[0]).toEqual(tabList[0]);
  });

  test('matchByUrls should return empty array', () => {
    const matchedTabs = tabs._tabsMatchByUrls(tabList, []);
    expect(matchedTabs).toEqual([]);
  });

  test('reloadAllByUrlMatch should execute reload once', async () => {
    jest.spyOn(tabs, 'reload');
    jest.spyOn(tabs, 'getAll');
    jest.spyOn(tabs, '_tabsMatchByUrls');
    tabs.getAll.mockImplementation(() => Promise.resolve(tabList));
    tabs.reload.mockImplementation(() => null);
    const extIds = [extensionInfos[0].id];
    await tabs.reloadAllByUrlMatch(extIds);
    expect(tabs.reload).toBeCalledTimes(1);
  });
});
