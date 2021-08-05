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

  test('reloadAllByUrlMatch should return without calling any function', async () => {
    jest.spyOn(tabs, 'reload');
    jest.spyOn(tabs, 'getAll');
    jest.spyOn(tabs, '_tabsMatchByUrls');
    tabs.getAll.mockImplementation(() => Promise.resolve(tabList));
    tabs.reload.mockImplementation(() => null);
    await tabs.reloadAllByUrlMatch([]);
    expect(tabs._tabsMatchByUrls).not.toBeCalled();
    expect(tabs.getAll).not.toBeCalled();
    expect(tabs.reload).not.toBeCalled();
  });

  test('getTabbyExtId', () => {
    chrome.tabs.query.mockImplementation((queryInfo, cb) => cb());
    expect(tabs.getTabbyExtId('abcdefghijklmno')).resolves.not.toThrow();
  });

  test('getTabbyExtId', () => {
    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.tabs.query.mockImplementation((opts, cb) => {
      chrome.runtime.lastError = lastError;
      cb();
      delete chrome.runtime.lastError;
    });
    expect(tabs.getTabbyExtId('abcdefghijklmno')).rejects.toBe(lastErrorMessage);
  });

  test('activate', () => {
    chrome.tabs.update.mockImplementation((tabId, propsObj, cb) => cb());
    expect(tabs.activate()).resolves.not.toThrow();
  });

  test('activate should throw error', () => {
    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.tabs.update.mockImplementation((tabId, propsObj, cb) => {
      chrome.runtime.lastError = lastError;
      cb();
      delete chrome.runtime.lastError;
    });
    expect(tabs.activate()).rejects.toBe(lastErrorMessage);
  });

  test('createDetailsTab', () => {
    const tab = {
      id: 1,
      url: '',
    };
    chrome.tabs.create.mockImplementation((opts, cb) => cb(tab));
    expect(tabs.createDetailsTab('abcdefghijkl')).resolves.toBe(tab);
  });

  test('createDetailsTab should reject with error', () => {
    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.tabs.create.mockImplementation((opts, cb) => {
      chrome.runtime.lastError = lastError;
      cb();
      delete chrome.runtime.lastError;
    });
    expect(tabs.createDetailsTab()).rejects.toBe(lastErrorMessage);
  });
});
