import management from '../lib/management';
import popupFix from './popupfix';
import View from './view';
import ViewReloadButton from './viewReloadButton';

async function main() {
  const extensions = await management.getAllExt();
  const devExtensions = management.filterDevExtension(extensions);
  View.init(extensions, devExtensions);
  ViewReloadButton.init();
}

popupFix();
main();
