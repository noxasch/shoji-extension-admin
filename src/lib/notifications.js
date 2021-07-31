/**
 * @typedef {Object} notification
 */
export const notifications = {
  /**
   * 
   * @param {String} title 
   * @param {String} message 
   * @returns {Promise<String>} notificationId
   */
  create: async (title, message) => new Promise((resolve, reject) => {
    const iconUrl = chrome.runtime.getURL('icon48.png');
    chrome.notifications.create('', {
      iconUrl: iconUrl,
      title: title,
      message: message,
      type: 'basic',
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      return resolve(notificationId);
    });
  }),
};

export async function createNotification() {
  const extName = chrome.runtime.getManifest().name;
  await notifications.create(extName, 'All dev extension has been reloaded');
}
