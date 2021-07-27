import { reloadAllDev } from '../lib/management';

function registerCommand() {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'Alt+R') {
      await reloadAllDev(null);
    }
  });
}

async function main() {
  registerCommand();
}

main();
