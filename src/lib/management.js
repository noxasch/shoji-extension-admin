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
      }
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
      }
      resolve(result);
    });
  }),

  /**
   * 
   * @returns {Promise<chrome.management.ExtensionInfo>}
   */
  getSelf: async () => new Promise((resolve, reject) => {
    chrome.management.getSelf((result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
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
      }
      resolve();
    });
  }),
};

/**
 * 
 * @param {String} extensionId 
 */
export async function reload(extensionId) {
  await management.setEnabled(extensionId, false);
  await management.setEnabled(extensionId, true);
  // show feedback
}

/**
 * @param {chrome.management.ExtensionInfo[]} extensions
 * @returns {chrome.management.ExtensionInfo[]} devExtensions
 */
export function getDevExtension(extensions) {
  const extension = extensions;
  const devExtensions = extension
    .filter((item) => item.installType === 'development');
  return devExtensions;
}

/**
 * @param {?chrome.management.ExtensionInfo[]} extensions
 * @returns {Promise<Void>}
 */
export async function reloadAllDev(extensions) {
  const exts = extensions ?? await management.getAll();
  const enabledDevExtensions = getDevExtension(exts)
    .filter((item) => item.enabled);
  let devIds = enabledDevExtensions.map((item) => item.id);
  devIds = devIds.filter((id) => id !== chrome.runtime.id);
  devIds.forEach(async (id) => {
    if (id) await reload(id);
  });
}
