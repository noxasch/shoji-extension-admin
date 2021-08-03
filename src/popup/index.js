import popupFix from './popupfix';
import ViewSearch from './search';
import View from './view';
import ViewReloadButton from './viewReloadButton';

async function main() {
  View.init();
  ViewSearch.init();
  ViewReloadButton.init();
}

popupFix();
main();
