import Command from '../lib/command';
import management from '../lib/management';
// import notifications from '../lib/notifications';
import tabs from '../lib/tabs';

function showBadge() {
  chrome.browserAction.setBadgeBackgroundColor({ color: '#3c96d6' });
  chrome.browserAction.setBadgeText({ text: 'OK' });
  setTimeout(() => {
    chrome.browserAction.setBadgeText({ text: '' });
  }, 2_000);
}

function registerListeners() {
  chrome.runtime.onMessage.addListener((msg, cb) => {
    if (msg.command === Command.showBadge) {
      showBadge();
    }
  });
}

function registerCommand() {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'Alt+R') {
      const extensions = await management.getAllExt();
      const devExtIds = management.getActiveDevIds(extensions);
      await management.reloadAllDev(extensions);
      await tabs.reloadAllByUrlMatch(devExtIds);
      showBadge();
      // notifications.createNotification();
    }
  });
}

function main() {
  registerListeners();
  registerCommand();
}

main();
