import notifications from '../../src/lib/notifications';

describe('Notifications', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create should return id', async () => {
    const notificationId = '1234';
    chrome.notifications.create.mockImplementation((id, opts, cb) => cb(notificationId));
    const id = await notifications.create('', {});
    expect(id).toBe(notificationId);
  });

  test('create should reject with error', () => {
    const notificationId = '1234';
    chrome.runtime.getURL.mockImplementation((url) => `chrome://extension-icon/${url}`);

    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.notifications.create.mockImplementation((id, opts, cb) => {
      chrome.runtime.lastError = lastError;
      cb(notificationId);
      delete chrome.runtime.lastError;
    });

    expect(notifications.create('', {})).rejects.toBe(lastErrorMessage);
  });

  test('createNotification', async () => {
    jest.spyOn(notifications, 'create');
    notifications.create.mockImplementation(() => Promise.resolve());
    const manifest = {
      name: 'my chrome extension',
      manifest_version: 2,
      version: '1.0.0',
    };
    chrome.runtime.getManifest.mockImplementation(() => manifest);
    expect(chrome.runtime.getManifest()).toEqual(manifest);
    expect(chrome.runtime.getManifest).toBeCalled();
    await notifications.createNotification();
    expect(notifications.create).toBeCalled();
  });
});
