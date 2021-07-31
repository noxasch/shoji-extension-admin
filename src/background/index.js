import management from '../lib/management';
import notifications from '../lib/notifications';

function registerCommand() {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'Alt+R') {
      const extensions = await management.getAll();
      await management.reloadAllDev(extensions);
      notifications.createNotification();
    }
  });
}

async function main() {
  registerCommand();
}

main();
