import Commands from '../../src/lib/command';

describe('command lib', () => {
  test('getAll', async () => {
    const cmdList = [{
      name: '',
      shortcut: '',
      description: '',
    }];
    chrome.commands.getAll.mockImplementation((cb) => cb(cmdList));
    const res = await Commands.getAll();
    expect(chrome.commands.getAll).toBeCalled();
    expect(res).toBe(cmdList);
  });

  test('getAll should return error', () => {
    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.commands.getAll.mockImplementation((cb) => {
      chrome.runtime.lastError = lastError;
      cb();
      delete chrome.runtime.lastError;
    });
    expect(Commands.getAll()).rejects.toEqual(lastErrorMessage);
  });

  test('getCommandString should return Alt+R', async () => {
    const cmdList = [{
      name: Commands.reloadShortcut,
      shortcut: '⌥R',
      description: '',
    }];
    chrome.commands.getAll.mockImplementation((cb) => cb(cmdList));
    const res = await Commands.getCommandString();
    expect(res).toBe('<kbd>⌥</kbd>+<kbd>R</kbd>');
  });
});
