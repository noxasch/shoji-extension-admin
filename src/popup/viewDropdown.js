import management from '../lib/management';
import tabs from '../lib/tabs';

class ViewDropdown {
  constructor() {
    if (new.target === ViewDropdown) {
      throw new TypeError('Cannot construct ViewDropdown instances directly');
    }
  }

  static init() {
    const toggleDropdownBtn = document.querySelectorAll('.toggle-dropdown');
    toggleDropdownBtn.forEach((td) => {
      td.addEventListener('click', ViewDropdown.toggleDropdown);
    });
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach((li) => {
      li.addEventListener('click', ViewDropdown.removeDropdown);
    });
  }

  /**
   * 
   * @param {Event} event
   */
  static toggleDropdown(event) {
    event.stopPropagation();
    const menu = event.target;
    const bodyHeight = document.body.clientHeight;
    const isOverEdge = (event instanceof MouseEvent)
      ? bodyHeight - event.clientY < 200 : false;
    // TODO: refactor this into its own function
    const html = /* html */`
    <div class="dropdown menu fs:12"
        ${isOverEdge ? 'style="top: auto; bottom: 60%;"' : ''}>
      <ul class="dropdown-list">
        <li class="dropdown-list-item" id="details">
          <span class="mdi mdi-card-bulleted-outline fs:16"></span>
          <span class="i:box w:10"></span>
          Details
        </li>
        <li class="dropdown-list-item" id="remove">
          <span class="mdi mdi-delete-forever-outline fs:16"></span>
          <span class="i:box w:10"></span>
          Remove
        </li>
        <li class="dropdown-list-item" id="cancel">
          <span class="mdi mdi-close fs:16"></span>
          <span class="i:box w:10"></span>
          Cancel
        </li>
      </ul>
    </div>
  `.replace(/\s+/g, ' ');

    if (menu instanceof HTMLElement) {
      const extId = menu.dataset.id ?? '';
      if (menu.querySelector('.dropdown.menu')) {
        ViewDropdown.removeDropdown();
      } else {
        ViewDropdown.removeDropdown();
        menu.insertAdjacentHTML('beforeend', html);
        ViewDropdown.registerMenuEvent(extId);
      }
    }
  }

  static removeDropdown() {
    const menu = document.querySelector('.dropdown.menu');
    if (menu) {
      menu.remove();
    }
  }

  /**
   * 
   * @param {String} extensionId 
   */
  static async detailEvent(extensionId) {
    const tab = await tabs.getTabByExtId(extensionId);
    if (tab.length > 0) {
      // if target details tab already exist, just switch to
      const tabId = tab[0].id;
      if (tabId) tabs.activate(tabId); // activate will close popup
    } else {
      await tabs.createDetailsTab(extensionId);
      ViewDropdown.removeDropdown();
    }
  }

  /**
   *
   * @param {String} extensionId
   */
  static async removeEvent(extensionId) {
    try {
      await management.removeExtensionById(extensionId);
      ViewDropdown.removeDropdown();
      ViewDropdown.removeItemById(extensionId);
      // remove extension from view
    } catch (error) {
      // do nothing since user cancel
      console.warn(error);
    }
  }

  /**
   * 
   * @param {String} dataId 
   */
  static removeItemById(dataId) {
    const item = document.querySelector(`.list-item[data-id="${dataId}"]`);
    if (item) {
      item.remove();
    }
  }

  /**
   * 
   * @param {Event} event 
   * @param {String} extensionId
   */
  static async menuEvent(event, extensionId) {
    event.stopPropagation();
    if (event.target instanceof HTMLElement) {
      switch (event.target.id) {
      case 'details':
        ViewDropdown.detailEvent(extensionId);
        break;
      case 'remove':
        ViewDropdown.removeEvent(extensionId);
        break;
      default:
        ViewDropdown.removeDropdown();
        break;
      }
    }
  }

  /**
   * 
   * @param {String} extensionId 
   */
  static registerMenuEvent(extensionId) {
    const menuItems = document.querySelectorAll('.dropdown.menu li');
    menuItems.forEach((item) => {
      item.addEventListener('click',
        (event) => ViewDropdown.menuEvent(event, extensionId));
    });
  }
}

export default ViewDropdown;
