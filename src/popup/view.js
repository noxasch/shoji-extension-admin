import management from '../lib/management';
import utils from '../lib/utilities';

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
   * 
   * @param {!number} extensionCount
   * @param {!number} activeCount
   * @param {!number} devCount
   * @returns {String}
   */
  static mainSummaryInfo(extensionCount, activeCount, devCount) {
    return `You have a total of <span class="bold">\
${extensionCount}</span> extensions.\
 <span class="bold">${activeCount}</span> enabled extension.\
 <span class="bold">${devCount}</span> dev extension.`.replace(/\s+/g, ' ');
  }

  /**
   * 
   * @param {number} foundCount 
   * @param {number} totalCount 
   * @param {String} searchQuery
   * @returns {String}
   */
  static searchSummaryInfo(foundCount, totalCount, searchQuery) {
    if (foundCount > 0) {
      return `Found <span class="bold">${foundCount}</span> out of\
     ${totalCount} extensions matching\
     <span class="bold">${searchQuery}</span>`.replace(/\s+/g, ' ');
    }
    return `No result found for <span class="bold">${searchQuery}</span>`;
  }

  /**
   * 
   * @param {chrome.management.ExtensionInfo[]} extensions extensions
   * @returns {number}
   */
  static getActiveExtensionCount(extensions) {
    return extensions.reduce((res, item) => {
      if (item.enabled) return res + 1;
      return res;
    }, 0);
  }

  static async init() {
    const extensions = await management.getAllExt();
    const devExtensions = management.filterDevExtension(extensions);
    View.resetView(extensions, devExtensions);
    View.registerSwitchEvent();
  }

  /**
   * 
   * @param {chrome.management.ExtensionInfo[]} extensions
   * @param {chrome.management.ExtensionInfo[]} devExtensions
   */
  static resetView(extensions, devExtensions) {
    const activeCount = View.getActiveExtensionCount(extensions);
    View.renderInfo(View.mainSummaryInfo.bind(
      null,
      extensions.length,
      activeCount,
      devExtensions.length,
    ));
    View.renderList(extensions);
  }

  /**
   * @param {Function} InfoStringFn
   */
  static renderInfo(InfoStringFn) {
    const infoBar = document.querySelector(View.infoBarSelector);
    if (infoBar) {
      infoBar.innerHTML = InfoStringFn();
    } else {
      throw TypeError(`${View.infoBarSelector} is undefined`);
    }
  }

  /**
   * 
   * @param {chrome.management.ExtensionInfo[]} searchResults
   * @param {number} totalCount 
   * @param {String} searchQuery 
   */
  static renderSearchResults(searchResults, totalCount, searchQuery) {
    View.renderInfo(View.searchSummaryInfo.bind(
      null, searchResults.length, totalCount, searchQuery,
    ));
    View.renderList(searchResults);
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
   * @returns {String}
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
   * 
   * @param {String} name 
   * @returns {String} image URL in base64
   */
  static _generateBase64Img(name) {
    const firstLetter = name[0];
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    // const ctx = /** @type {CanvasRenderingContext2D} */ canvas.getContext('2d');
    const ctx = utils.assertNonNull(canvas.getContext('2d'));
    ctx.fillStyle = '#6B6B6B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px sans-serif';
    const textSize = ctx.measureText(firstLetter);
    ctx.fillText(firstLetter, (canvas.width / 2) - (textSize.width / 2), 35);
    return canvas.toDataURL(); // png is the default base64 format
  }

  /**
   * @param {chrome.management.ExtensionInfo} extensionInfo
   * @returns {String} iconSrc
   */
  static _getMaxResIcon(extensionInfo) {
    if (extensionInfo.icons !== undefined && extensionInfo.icons.length > 0) {
      const icons = extensionInfo.icons.length > 3
        ? extensionInfo.icons.slice(0, 2) : [...extensionInfo.icons];
      const temp = icons.pop();
      if (temp) {
        return temp.url;
      }
    }
    return View._generateBase64Img(extensionInfo.name);
  }

  /**
   * @param {chrome.management.ExtensionInfo[]} extensions
   */
  static renderList(extensions) {
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
      const img = document.querySelector(`li[data-id="${el.id}"] img`);
      if (img instanceof HTMLImageElement) {
        img.classList.toggle('grayscale');
      }
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
