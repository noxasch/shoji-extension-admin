import { reloadAllDev } from '../lib/management';
import { createNotification } from '../lib/notifications';

function registerCommand() {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'Alt+R') {
      await reloadAllDev(null);
      createNotification();
    }
  });
}

async function main() {
  registerCommand();
}

main();
