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
      iconUrl: 'chrome://favicon/https://developer.chrome.com/', // TODO: use extension icon
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

export default notifications;
