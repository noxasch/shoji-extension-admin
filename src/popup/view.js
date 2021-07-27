class View {
  constructor() {
    if (new.target === View) {
      throw new TypeError('Cannot construct View instances directly');
    }
  }

  static infoBarSelector = '.info-bar';

  static listBodySelector = '.list-view';

  /**
   * @param {chrome.management.ExtensionInfo[]} extensions
   * @param {chrome.management.ExtensionInfo[]} devEtensions
   */
  static async init(extensions, devEtensions) {
    const activeCount = extensions.reduce((res, item) => {
      if (item.enabled) return res + 1;
      return res;
    }, 0);
    this.renderInfo(extensions.length, activeCount, devEtensions.length);
    this.renderList(extensions);
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
    return /* html */`<li class="list-item p:12 flex" data-id="${id}">\
      <span class="item-icon placeholder">\
        <img src="${iconSrc}" width="16px" height="16px" />\
      </span>\
      <div class="column fg:1">\
        <span class="title pb:4">${name}</span>\
        <div class="row">\
          <span class="subtitle fs:12">${version}</span>\
          ${installType === 'development'
    ? '<span class="pills bg:primary-grey fs:12">dev</span>' : ''}
        </div>\
      </div>\
      <label class="toggle">\
        <input class="toggle-checkbox" type="checkbox" id="${id}" ${enabled
  ? 'checked' : ''}>\
          <div class="toggle-switch"></div>\
        </label>\
        <div class="w:10"></div>\
        <span class="mdi mdi-dots-vertical fs:24 toggle-dropdown"></span>\
      </li>`;
  }

  /**
   * @param {chrome.management.ExtensionInfo[]} extensions
   */
  static renderList(extensions = []) {
    const html = extensions.reduce((res, item) => {
      let iconSrc = '';
      if (item.icons !== undefined && item.icons) {
        iconSrc = item.icons[0].url;
      }
      return res
        + this._listItemString(
          item.id,
          item.name,
          item.version,
          item.enabled,
          iconSrc,
          item.installType,
        );
    }, '');

    const listBody = document.querySelector(this.listBodySelector);
    if (listBody) {
      this.clearElement(listBody);
      listBody.insertAdjacentHTML('beforeend', `<ul>${html}</ul>`);
    }
  }
}

export default View;
