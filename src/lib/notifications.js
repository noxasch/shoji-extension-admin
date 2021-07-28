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
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(notificationId);
    });
  }),
};

export function createNotification() {
  const extName = chrome.runtime.getManifest().name;
  if (chrome.runtime.lastError) {
    const { message } = chrome.runtime.lastError;
    if (message) {
      notifications.create(extName, message);
    }
  } else {
    notifications.create(extName, 'All dev extension has been reloaded');
  }
}
