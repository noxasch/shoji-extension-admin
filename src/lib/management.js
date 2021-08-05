/** 
 * 
 * @typedef {Object} management
 */
const management = {
  /**
   * Get all extensions and app installed
   * @returns {Promise<chrome.management.ExtensionInfo[]>} extensions
   */
  getAll: async () => new Promise((resolve, reject) => {
    chrome.management.getAll((result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      return resolve(result);
    });
  }),

  /**
   * Get all extensions only
   * @returns {Promise<chrome.management.ExtensionInfo[]>} extensions
   */
  getAllExt: async () => new Promise((resolve, reject) => {
    chrome.management.getAll((result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      return resolve(result.filter((item) => item.type === 'extension'));
    });
  }),

  /**
   * Get extension by Id
   * @param {*} extensionId 
   * @returns {Promise<chrome.management.ExtensionInfo>}
   */
  get: async (extensionId) => new Promise((resolve, reject) => {
    chrome.management.get(extensionId, (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      return resolve(result);
    });
  }),

  /**
   * 
   * @returns {Promise<chrome.management.ExtensionInfo>}
   */
  getSelf: async () => new Promise((resolve, reject) => {
    chrome.management.getSelf((result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      return resolve(result);
    });
  }),

  /**
   * 
   * @param {String} extensionId 
   * @returns {Promise<void>}
   */
  removeExtensionById: async (extensionId) => new Promise((resolve, reject) => {
    chrome.management.uninstall(extensionId, {}, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      return resolve();
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
        return reject(chrome.runtime.lastError.message);
      }
      return resolve();
    });
  }),

  /**
   *
   * @param {String} extensionId
   */
  reload: async (extensionId) => {
    await management.setEnabled(extensionId, false);
    await management.setEnabled(extensionId, true);
    // show feedback
  },

  /**
   * @param {chrome.management.ExtensionInfo[]} extensions
   * @returns {chrome.management.ExtensionInfo[]} devExtensions
   */
  filterDevExtension: (extensions) => {
    const extension = extensions;
    const devExtensions = extension
      .filter((item) => item.installType === 'development');
    return devExtensions;
  },

  /**
   * 
   * @param {chrome.management.ExtensionInfo[]} extensions
   * @returns {String[]} devIds
   */
  getActiveDevIds: (extensions) => {
    const enabledDevExtensions = management.filterDevExtension(extensions)
      .filter((item) => item.enabled && item.id !== chrome.runtime.id); // exclude self
    return enabledDevExtensions.map((item) => item.id);
  },

  /**
   * @param {!chrome.management.ExtensionInfo[]} extensions
   * @returns {Promise<Void>}
   */
  reloadAllDev: async (extensions) => {
    const devIds = management.getActiveDevIds(extensions);
    devIds.forEach(async (id) => {
      if (id) await management.reload(id);
    });
  },
};

export default management;
