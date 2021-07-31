import management from '../lib/management';
import View from './view';
import ViewReloadButton from './viewReloadButton';

async function main() {
  const res = await management.getAll();
  const extensions = res.filter((item) => item.type === 'extension');
  const devExtensions = management.filterDevExtension(extensions);
  View.init(extensions, devExtensions);
  ViewReloadButton.init();
}

main();
