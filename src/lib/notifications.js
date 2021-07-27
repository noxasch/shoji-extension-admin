/**
 * @typedef {Object} notification
 */
const notifications = {
  /**
   * 
   * @param {String} title 
   * @param {String} message 
   * @returns {Promise<String>} notificationId
   */
  create: async (title, message) => new Promise((resolve, reject) => {
    chrome.notifications.create('', {
      iconUrl: 'chrome://favicon/https://developer.chrome.com/',
      title: title, // 'An extension',
      message: message, // `${extensionInfo.name} has been ${extensionInfo.enabled ? 'enabled' : 'disabled'}`,
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

export default notifications;
