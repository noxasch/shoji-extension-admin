import management from '../lib/management';
import View from './view';

/**
 * 
 * @param {chrome.management.ExtensionInfo[]} extensions
 * @returns {chrome.management.ExtensionInfo[]} devExtensions
 */
function getDevExtension(extensions) {
  const extension = extensions;
  const devExtensions = extension
    .filter((item) => item.installType === 'development');
  return devExtensions;
}

async function main() {
  const extensions = await management.getAll();
  const devExtensions = getDevExtension(extensions);
  View.init(extensions, devExtensions);
}

main();
