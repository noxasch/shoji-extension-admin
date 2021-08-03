import management from '../lib/management';
import View from './view';

// partial import that being used in default import
// or with each other cannot be mock
// hence we wrapped it all in a class or object literal to solve that
class ViewSearch {
  /**
   * @type {?ReturnType<typeof setTimeout>} typingTimer
   */
  static typingTimer = null;

  static typeInterval = 500;

  static searchInputId = 'search';

  static init() {
    const searchBox = document.getElementById(ViewSearch.searchInputId);
    if (searchBox instanceof HTMLInputElement) {
      searchBox.addEventListener('keydown', ViewSearch.keydown);
      searchBox.addEventListener('change', ViewSearch.change);
      searchBox.addEventListener('input', ViewSearch.input);
    } else {
      throw TypeError('SearchBox is undefined');
    }
  }

  /**
   * 
   * @param {String} input 
   * @returns {String} regex escaped string
   */
  static escapeRegExp(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  /**
   * 
   * @param {String} query 
   * @returns {RegExp} regex
   */
  static prepareRegex(query) {
    let regexContent = query.trim().split(' ');
    regexContent = regexContent.map((word) => `(?=.*${ViewSearch.escapeRegExp(word)})`);
    const regexString = `^${regexContent.join('')}.*$`;
    return new RegExp(regexString, 'i');
  }

  /**
   * @param {chrome.management.ExtensionInfo[]} extensions
   * @param {String} query 
   * @returns {chrome.management.ExtensionInfo[]} QueriedExtension
   */
  static searchQuery(extensions, query) {
    const re = ViewSearch.prepareRegex(query);
    const results = extensions
      .filter((item) => re.test(`${item.name.replace(/\s+/g, ' ')}`));
    return results;
  }

  /**
   * 
   * @param {String} inputText 
   */
  static async handleSearch(inputText) {
    const extensions = await management.getAllExt();
    if (inputText) {
      const results = ViewSearch.searchQuery(extensions, inputText);
      View.renderSearchResults(results, extensions.length, inputText);
    } else {
      const devExtensions = management.filterDevExtension(extensions);
      View.resetView(extensions, devExtensions);
    }
  }

  /**
   * @param {Event} event
   * The name correspond to the 'change' event
   */
  static change(event) { // only fired when input is commited
    if (ViewSearch.typingTimer) {
      clearTimeout(ViewSearch.typingTimer);
      ViewSearch.typingTimer = null;
    }

    if (event.target instanceof HTMLInputElement) {
      const inputText = event.target.value;
      ViewSearch.typingTimer = setTimeout(() => {
        ViewSearch.handleSearch(inputText);
      }, ViewSearch.typeInterval);
    }
  }

  /**
   * @param {Event} event
   * The name correspond to the 'keydown' event
   */
  static keydown(event) {
    if (ViewSearch.typingTimer) {
      clearTimeout(ViewSearch.typingTimer);
      ViewSearch.typingTimer = null;
    }
  }

  /**
   * @param {Event} event
   * The name correspond to the 'input' event
   */
  static input(event) { // fired each time input change
    if (ViewSearch.typingTimer) {
      clearTimeout(ViewSearch.typingTimer);
      ViewSearch.typingTimer = null;
    }
    if (event.target instanceof HTMLInputElement) {
      const inputText = event.target.value;
      ViewSearch.typingTimer = setTimeout(() => {
        ViewSearch.handleSearch(inputText);
      }, ViewSearch.typeInterval);
    }
  }
}

export default ViewSearch;
