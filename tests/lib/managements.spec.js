import management from '../../src/lib/management';
import extensionsInfo from '../fixtures/extensionsList';

describe('managements test', () => {
  test('getAll should return list of extensionInfo', () => {
    chrome.management.getAll.mockImplementation((cb) => cb(extensionsInfo));
    expect(management.getAll()).resolves.toEqual(extensionsInfo);
  });

  test('getAll should return error', () => {
    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.management.getAll.mockImplementation((cb) => {
      chrome.runtime.lastError = lastError;
      cb();
      delete chrome.runtime.lastError;
    });
    expect(management.getAll()).rejects.toEqual(lastErrorMessage);
  });

  test('get should return one extensionInfo', () => {
    const extId = extensionsInfo[1].id;
    chrome.management.get.mockImplementation((extensionId, cb) => {
      cb(extensionsInfo.find((item) => item.id === extensionId));
    });
    expect(management.get(extId)).resolves.toEqual(extensionsInfo[1]);
  });

  test('get should return error', async () => {
    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.management.get.mockImplementation((extensionId, cb) => {
      chrome.runtime.lastError = lastError;
      cb();
      delete chrome.runtime.lastError;
    });
    expect(management.get()).rejects.toEqual(lastErrorMessage);
  });

  test('getSelf should return one extensionInfo', () => {
    const ext = extensionsInfo[1];
    chrome.management.getSelf.mockImplementation((cb) => {
      cb(ext);
    });
    expect(management.getSelf()).resolves.toEqual(ext);
  });

  test('getSelf should return error', async () => {
    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.management.getSelf.mockImplementation((cb) => {
      chrome.runtime.lastError = lastError;
      cb();
      delete chrome.runtime.lastError;
    });
    expect(management.getSelf()).rejects.toEqual(lastErrorMessage);
  });

  test('setEnabled should not throw error', () => {
    chrome.management.setEnabled.mockImplementation((id, enabled, cb) => {
      cb();
    });
    expect(management.setEnabled('1234', true)).resolves.not.toThrow();
  });

  test('setEnabled should throw error', async () => {
    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.management.setEnabled.mockImplementation((id, enabled, cb) => {
      chrome.runtime.lastError = lastError;
      cb();
      delete chrome.runtime.lastError;
    });
    expect(management.setEnabled('1234', true)).rejects.toEqual(lastErrorMessage);
  });

  test('reload', async () => {
    jest.spyOn(management, 'setEnabled');
    management.setEnabled.mockImplementation((extId, enabled, cb) => null);
    await management.reload();
    expect(management.setEnabled).toBeCalledTimes(2);
  });

  test('filterDevExtension', async () => {
    expect(management.filterDevExtension(extensionsInfo)).toEqual([extensionsInfo[0]]);
  });

  test('reloadAllDev should not call manangement.getAll', async () => {
    jest.spyOn(management, 'getAll');
    jest.spyOn(management, 'filterDevExtension');
    jest.spyOn(management, 'reload');
    management.reload.mockImplementation(() => null);
    chrome.runtime.id = '123';
    await management.reloadAllDev(extensionsInfo);
    expect(management.getAll).not.toBeCalled();
    expect(management.reload).toBeCalledTimes(1);
  });
});
