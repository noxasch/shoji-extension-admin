/** 
 * 
 * @typedef {Object} management
 */
export const management = {
  /**
   * Get all extensions and app installed
   * @returns {Promise<chrome.management.ExtensionInfo[]>} extensions
   */
  getAll: async () => new Promise((resolve, reject) => {
    chrome.management.getAll((result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      };
      resolve(result);
    });
  }),

  /**
   * Get all extensions and app installed
   * @param {*} extensionId 
   * @returns {Promise<chrome.management.ExtensionInfo>}
   */
  get: async (extensionId) => new Promise((resolve, reject) => {
    chrome.management.get(extensionId, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      };
      resolve(result);
    });
  }),

  /**
   * 
   * @param {String} id 
   * @param {boolean} enabled 
   * @returns {Promise<void>}
   */
  setEnabled: async (id, enabled) => new Promise((resolve, reject) => {
    chrome.management.setEnabled(id, enabled, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      };
      resolve();
    });
  }),
};
