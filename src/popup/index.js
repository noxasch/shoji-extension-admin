import management from '../lib/management';
import popupFix from './popupfix';
import View from './view';
import ViewReloadButton from './viewReloadButton';

async function main() {
  View.init();
  ViewReloadButton.init();
}

popupFix();
main();
