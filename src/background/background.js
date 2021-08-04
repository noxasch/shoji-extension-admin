import Command from '../lib/command';
import management from '../lib/management';
// import notifications from '../lib/notifications';
import tabs from '../lib/tabs';

const background = {
  showBadge: () => {
    chrome.browserAction.setBadgeBackgroundColor({ color: '#3c96d6' });
    chrome.browserAction.setBadgeText({ text: 'OK' });
    setTimeout(() => {
      chrome.browserAction.setBadgeText({ text: '' });
    }, 2_000);
  },

  /** 
 * @param {any} msg
 * @param {chrome.runtime.MessageSender} response
 */
  handleShowBadge: (msg, response) => {
    if (msg.command === Command.showBadge) {
      background.showBadge();
    }
  },

  registerListeners: () => {
    chrome.runtime.onMessage.addListener(background.handleShowBadge);
  },

  /**
 * 
 * @param {String} command 
 * @param {?chrome.tabs.Tab} tab
 */
  handleCommand: async (command, tab) => {
    if (command === Command.reloadShortcut) {
      const extensions = await management.getAllExt();
      const devExtIds = management.getActiveDevIds(extensions);
      await management.reloadAllDev(extensions);
      await tabs.reloadAllByUrlMatch(devExtIds);
      background.showBadge();
    // notifications.createNotification();
    }
  },

  registerCommand: () => {
    chrome.commands.onCommand.addListener(background.handleCommand);
  },
};

export default background;
