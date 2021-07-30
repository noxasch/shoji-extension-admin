import { reloadAllDev } from '../lib/management';
import { createNotification } from '../lib/notifications';

class ViewReloadButton {
  // constructor() {
  //   this.reloading = false;
  // }
  static init() {
    this.registerReloadEvent();
  }

  static reloading = false;

  static reloadBtnId = 'reload';

  static spin() {
    const reloadBtn = document.getElementById(this.reloadBtnId);
    if (reloadBtn) {
      const icon = reloadBtn.querySelector('.mdi');
      if (icon) {
        requestAnimationFrame(() => {
          this.reloading = true;
          icon.classList.remove('mdi-reload');
          icon.classList.add('mdi-loading', 'mdi-spin');
        });
      } else {
        throw TypeError('mdi-reload is undefined');
      }
    } else {
      throw TypeError('Reload button is undefined');
    }
  }

  static removeSpin() {
    const reloadBtn = document.getElementById(this.reloadBtnId);
    if (reloadBtn) {
      const icon = reloadBtn.querySelector('.mdi');
      if (icon) {
        requestAnimationFrame(() => {
          icon.classList.remove('mdi-loading', 'mdi-spin');
          icon.classList.add('mdi-reload');
          this.reloading = false;
        });
      } else {
        throw TypeError('mdi-reload is undefined');
      }
    } else {
      throw TypeError('Reload button is undefined');
    }
  }

  /**
   * 
   * @param {MouseEvent} event 
   */
  static async onClickReloadButton(event) {
    if (!ViewReloadButton.reloading) {
      ViewReloadButton.spin();
      await reloadAllDev(null);
      setTimeout(() => {
        ViewReloadButton.removeSpin();
        createNotification();
        // const extName = chrome.runtime.getManifest().name;
        // if (chrome.runtime.lastError) {
        //   const { message } = chrome.runtime.lastError;
        //   if (message) {
        //     notifications.create(extName, message);
        //   }
        // } else {
        //   notifications.create(extName, 'All dev extension has been reloaded');
        // }
      }, 2000);
    }
  }

  static registerReloadEvent() {
    const reloadBtn = document.getElementById(ViewReloadButton.reloadBtnId);
    if (reloadBtn) {
      reloadBtn.addEventListener('click', ViewReloadButton.onClickReloadButton);
    } else {
      throw TypeError('Reload button is undefined');
    }
  }
}

export default ViewReloadButton;
