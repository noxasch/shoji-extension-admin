/* eslint-disable max-len */
import background from '../../src/background/background';
import command from '../../src/lib/command';
import management from '../../src/lib/management';
import tabs from '../../src/lib/tabs';

describe('background unit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('showBadge', () => {
    chrome.browserAction.setBadgeBackgroundColor.mockImplementation((obj, cb) => null);
    chrome.browserAction.setBadgeText.mockImplementation((obj, cb) => null);
    background.showBadge();
    expect(chrome.browserAction.setBadgeBackgroundColor).toBeCalled();
    expect(chrome.browserAction.setBadgeText).toBeCalled();
    jest.runAllTimers();
    expect(setTimeout).toBeCalled();
    expect(chrome.browserAction.setBadgeText).toBeCalledTimes(2);
  });

  test('handleShowBadge should call showBadge', () => {
    background.handleShowBadge({ command: command.showBadge });
    expect(chrome.browserAction.setBadgeBackgroundColor).toBeCalled();
    expect(chrome.browserAction.setBadgeText).toBeCalled();
    jest.runAllTimers();
    expect(setTimeout).toBeCalled();
    expect(chrome.browserAction.setBadgeText).toBeCalledTimes(2);
  });

  test('handleShowBadge should do nothing', () => {
    background.handleShowBadge({ command: '' });
    expect(chrome.browserAction.setBadgeBackgroundColor).not.toBeCalled();
    expect(chrome.browserAction.setBadgeText).not.toBeCalled();
    jest.runAllTimers();
    expect(setTimeout).not.toBeCalled();
    expect(chrome.browserAction.setBadgeText).not.toBeCalledTimes(2);
  });

  test('registerListeners', () => {
    chrome.browserAction.setBadgeBackgroundColor.mockImplementation((obj, cb) => null);
    chrome.browserAction.setBadgeText.mockImplementation((obj, cb) => null);

    background.registerListeners();
    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);

    chrome.runtime.onMessage.callListeners(
      { command: command.showBadge },
    );

    expect(chrome.browserAction.setBadgeBackgroundColor).toBeCalled();
    expect(chrome.browserAction.setBadgeText).toBeCalledTimes(1);
    jest.runAllTimers();
    expect(setTimeout).toBeCalled();
    expect(chrome.browserAction.setBadgeText).toBeCalledTimes(2);
  });

  test('handleCommand', async () => {
    // registerCommand();
    jest.spyOn(management, 'getAllExt');
    jest.spyOn(management, 'getActiveDevIds');
    jest.spyOn(management, 'reloadAllDev');
    jest.spyOn(tabs, 'reloadAllByUrlMatch');

    management.getAllExt.mockImplementation(() => Promise.resolve());
    management.getActiveDevIds.mockImplementation(() => null);
    management.reloadAllDev.mockImplementation(() => Promise.resolve());
    tabs.reloadAllByUrlMatch.mockImplementation(() => Promise.resolve());

    await background.handleCommand('Alt+R', null);
    expect(management.getAllExt).toBeCalledTimes(1);
    expect(management.getActiveDevIds).toBeCalledTimes(1);
    expect(management.reloadAllDev).toBeCalledTimes(1);
    expect(tabs.reloadAllByUrlMatch).toBeCalledTimes(1);
    // showBadge
    expect(chrome.browserAction.setBadgeBackgroundColor).toBeCalled();
    expect(chrome.browserAction.setBadgeText).toBeCalledTimes(1);
    jest.runAllTimers();
    expect(setTimeout).toBeCalled();
    expect(chrome.browserAction.setBadgeText).toBeCalledTimes(2);
  });

  test('registerCommand', () => {
    const spy = jest.fn();
    chrome.commands.onCommand.addListener(spy);
    chrome.commands.onCommand.callListeners('Alt+R');
    expect(spy).toBeCalledWith('Alt+R');

    jest.spyOn(background, 'handleCommand');
    background.handleCommand.mockImplementation(() => Promise.resolve);
    background.registerCommand();
    chrome.commands.onCommand.callListeners('Alt+R');
    expect(background.handleCommand).toBeCalledTimes(1);
  });
});
