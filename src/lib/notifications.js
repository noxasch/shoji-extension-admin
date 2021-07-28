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

export default notifications;
