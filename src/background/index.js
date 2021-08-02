import management from '../lib/management';
import notifications from '../lib/notifications';
import tabs from '../lib/tabs';

function registerCommand() {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'Alt+R') {
      const extensions = await management.getAllExt();
      const devExtIds = management.getActiveDevIds(extensions);
      await management.reloadAllDev(extensions);
      await tabs.reloadAllByUrlMatch(devExtIds);
      notifications.createNotification();
    }
  });
}

async function main() {
  registerCommand();
}

main();
