/**
 *
 * @typedef {Object} tabs
 */
const tabs = {
  /**
   * Get all extensions and app installed
   * @returns {Promise<chrome.tabs.Tab[]>} tabs
   */
  getAll: async () => new Promise((resolve, reject) => {
    chrome.tabs.query({}, (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      return resolve(result);
    });
  }),

  /**
   * 
   * @param {String} extensionId 
   * @returns {Promise<chrome.tabs.Tab[]>} tabs
   */
  getTabByExtId: async (extensionId) => new Promise((resolve, reject) => {
    chrome.tabs.query({ url: `chrome://extensions/?id=${extensionId}` }, (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      return resolve(result);
    });
  }),

  /**
   * 
   * @param {number} tabId 
   * @returns {Promise<void>}
   */
  activate: async (tabId) => new Promise((resolve, reject) => {
    chrome.tabs.update(tabId, { active: true }, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      return resolve();
    });
  }),

  /**
   * 
   * @param {String} extensionId 
   * @returns {Promise<chrome.tabs.Tab>}
   */
  createDetailsTab: async (extensionId) => new Promise((resolve, reject) => {
    chrome.tabs.create({
      active: false,
      url: `chrome://extensions/?id=${extensionId}`,
    }, (tab) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      return resolve(tab);
    });
  }),

  /**
   * 
   * @param {number} tabId 
   * @returns {Promise<void>}
   */
  reload: async (tabId) => new Promise((resolve, reject) => {
    chrome.tabs.reload(tabId, { bypassCache: true }, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      return resolve();
    });
  }),

  /**
   * 
   * @param {chrome.tabs.Tab[]} tabList
   * @param {String[]} partialUrls
   * @return {chrome.tabs.Tab[]} devTabs
   */
  _tabsMatchByUrls: (tabList, partialUrls) => {
    // console.warn(partialUrls);
    if (partialUrls.length === 0) return [];
    const re = new RegExp(`.*${partialUrls.join('|')}`, 'i');
    const devTabs = tabList.filter((tab) => {
      const url = tab?.url;
      if (url) return re.test(url);
      return false;
    });
    return devTabs;
  },

  /**
   * 
   * @param {String[]} partialUrls 
   */
  reloadAllByUrlMatch: async (partialUrls) => {
    if (partialUrls.length === 0) return;
    const allTabs = await tabs.getAll();
    const devTabs = await tabs._tabsMatchByUrls(allTabs, partialUrls);
    devTabs.forEach(async (tab) => {
      const id = tab?.id;
      if (id) await tabs.reload(id);
    });
  },
};

export default tabs;
