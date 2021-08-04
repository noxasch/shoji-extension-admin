import Command from '../lib/command';
import management from '../lib/management';
// import notifications from '../lib/notifications';
import tabs from '../lib/tabs';

export function showBadge() {
  chrome.browserAction.setBadgeBackgroundColor({ color: '#3c96d6' });
  chrome.browserAction.setBadgeText({ text: 'OK' });
  setTimeout(() => {
    chrome.browserAction.setBadgeText({ text: '' });
  }, 2_000);
}

/** 
 * @param {any} msg
 * @param {chrome.runtime.MessageSender} response
 */
export function handleShowBadge(msg, response) {
  if (msg.command === Command.showBadge) {
    showBadge();
  }
}

export function registerListeners() {
  chrome.runtime.onMessage.addListener(handleShowBadge);
}

/**
 * 
 * @param {String} command 
 * @param {?chrome.tabs.Tab} tab
 */
export async function handleCommand(command, tab) {
  if (command === Command.altR) {
    const extensions = await management.getAllExt();
    const devExtIds = management.getActiveDevIds(extensions);
    await management.reloadAllDev(extensions);
    await tabs.reloadAllByUrlMatch(devExtIds);
    showBadge();
    // notifications.createNotification();
  }
}

export function registerCommand() {
  chrome.commands.onCommand.addListener(handleCommand);
}

function main() {
  registerListeners();
  registerCommand();
}

main();
