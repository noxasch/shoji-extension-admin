import { management, getDevExtension } from '../lib/management';
import View from './view';

async function main() {
  const extensions = await management.getAll();
  const devExtensions = getDevExtension(extensions);
  View.init(extensions, devExtensions);
}

main();
