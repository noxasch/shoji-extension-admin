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
};

export default tabs;
