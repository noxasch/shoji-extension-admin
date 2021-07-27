import { management } from '../lib/management';

class View {
  constructor() {
    if (new.target === View) {
      throw new TypeError('Cannot construct View instances directly');
    }
  }

  static infoBarSelector = '.info-bar';

  static listBodySelector = '.list-view';

  static reloadBtnId = 'reload';

  static switchSelector = 'input[type="checkbox"]';

  /**
   * @param {chrome.management.ExtensionInfo[]} extensions
   * @param {chrome.management.ExtensionInfo[]} devEtensions
   */
  static async init(extensions, devEtensions) {
    const activeCount = extensions.reduce((res, item) => {
      if (item.enabled) return res + 1;
      return res;
    }, 0);
    View.renderInfo(extensions.length, activeCount, devEtensions.length);
    View.renderList(extensions);
    View.registerSwitchEvent();
  }

  /**
   * 
   * @param {!number} extensionCount 
   * @param {!number} activeCount
   * @param {!number} devCount
   */
  static renderInfo(extensionCount, activeCount, devCount) {
    const info = document.querySelector(View.infoBarSelector);
    if (info) {
      info.innerHTML = `You have a total of <span class="bold">\
        ${extensionCount}</span> extensions.\
        <span class="bold">${activeCount}</span> enabled extension. <span\
        class="bold">${devCount}</span> dev extension.`;
    }
  }

  /**
  * @param {!Element} element
  */
  static clearElement(element) {
    while (element.firstChild) element.removeChild(element.firstChild);
  }

  /**
   * 
   * @param {String} id 
   * @param {String} name
   * @param {String} version
   * @param {boolean} enabled 
   * @param {String} iconSrc
   * @param {String} installType
   * @returns 
   */
  static _listItemString(id, name, version, enabled, iconSrc, installType) {
    return /* html */`<li class="list-item p:12 flex" data-id="${id}"\
tabindex="0"><span class="item-icon">\
  <img src="${iconSrc}" ${enabled ? '' : 'class="grayscale"'}\
width="32px" height="32px" />\
</span>\
<div class="column fg:1">\
  <span class="title pb:4">${name}</span>\
  <div class="row">\
    <span class="subtitle fs:12">${version}</span>\
          ${installType === 'development'
    ? '<span class="pills bg:primary-grey fs:12">dev</span>' : ''}
  </div>\
</div>\
<label class="toggle" tabindex="0">\
  <input class="toggle-checkbox" type="checkbox" id="${id}" ${enabled
  ? 'checked' : ''}>\
    <div class="toggle-switch"></div>\
  </label>\
  <div class="w:10"></div>\
  <span class="mdi mdi-dots-vertical fs:24 toggle-dropdown"></span>\
</li>`;
  }

  /**
   * @param {chrome.management.ExtensionInfo} extensionInfo
   * @returns {String} iconSrc
   */
  static _getMaxResIcon(extensionInfo) {
    let iconSrc = '';
    if (extensionInfo.icons !== undefined && extensionInfo.icons) {
      const temp = extensionInfo.icons.pop();
      if (temp) {
        iconSrc = temp.url;
      }
    }
    return iconSrc;
  }

  /**
   * @param {chrome.management.ExtensionInfo[]} extensions
   */
  static renderList(extensions = []) {
    const html = extensions.reduce((res, item) => {
      const iconSrc = View._getMaxResIcon(item);
      return res
        + View._listItemString(
          item.id,
          item.name,
          item.version,
          item.enabled,
          iconSrc,
          item.installType,
        );
    }, '');

    const listBody = document.querySelector(View.listBodySelector);
    if (listBody) {
      View.clearElement(listBody);
      listBody.insertAdjacentHTML('beforeend', html);
    }
  }

  /**
   * @param {Event} event
   */
  static async onSwitchChange(event) {
    const el = event.target;
    if (el instanceof HTMLInputElement) {
      await management.setEnabled(el.id, el.checked);
    }
  }

  static registerSwitchEvent() {
    const switches = document.querySelectorAll(View.switchSelector);
    if (switches) {
      switches.forEach((sw) => {
        sw.addEventListener('change', View.onSwitchChange);
      });
    }
  }
}

export default View;
