import userEvent from '@testing-library/user-event';
import View from '../../src/popup/view';
import ViewDropdown from '../../src/popup/viewDropdown';
import popupHtml from '../fixtures/popup';
import extensions from '../fixtures/extensionsList';
import tabs from '../../src/lib/tabs';
import management from '../../src/lib/management';

describe('viewDropdown test', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // // sequence matter
    // jest.useFakeTimers();
    // jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
    // jest.spyOn(console, 'error');
    // console.error.mockImplementation(() => null);
  });

  afterEach(() => {
    // sequence matter
    // window.requestAnimationFrame.mockRestore();
    // console.error.mockRestore();
    // jest.clearAllTimers(); // avoid infinite loop
    // jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('View Should throw error if instantiate', () => {
    expect(() => new ViewDropdown()).toThrow(TypeError);
  });

  test('init should register event', () => {
    document.body.innerHTML = popupHtml;
    jest.spyOn(ViewDropdown, 'toggleDropdown');
    jest.spyOn(ViewDropdown, 'removeDropdown');
    ViewDropdown.toggleDropdown.mockImplementation(() => null);
    ViewDropdown.removeDropdown.mockImplementation(() => null);
    View.renderList([extensions[0]]);
    ViewDropdown.init();
    userEvent.click(document.querySelector('.toggle-dropdown'));
    expect(ViewDropdown.toggleDropdown).toBeCalledTimes(1);
    userEvent.click(document.querySelector('.list-item[data-id]'));
    expect(ViewDropdown.removeDropdown).toBeCalled();
  });

  test('removeDropdown', () => {
    document.body.innerHTML = popupHtml;
    jest.spyOn(ViewDropdown, 'removeDropdown');
    View.renderList([extensions[0]]);
    ViewDropdown.init();
    const isOverEdge = false;
    document.querySelector('.toggle-dropdown').insertAdjacentHTML('beforeend',
      `<div class="dropdown menu fs:12"
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
  `.replace(/\s+/g, ' '));
    expect(document.querySelector('.dropdown.menu')).toBeTruthy();
    ViewDropdown.removeDropdown();
    expect(document.querySelector('.dropdown.menu')).toBeFalsy();
  });

  test('toggleDropdown should add new menu', () => {
    document.body.innerHTML = popupHtml;
    jest.spyOn(ViewDropdown, 'toggleDropdown');
    jest.spyOn(ViewDropdown, 'removeDropdown');
    View.renderList([extensions[0]]);
    ViewDropdown.init();
    userEvent.click(document.querySelector('.toggle-dropdown'));
    expect(ViewDropdown.toggleDropdown).toBeCalled();
    expect(document.querySelector('.dropdown.menu')).toBeTruthy();
    userEvent.click(document.querySelector('.toggle-dropdown'));
    expect(document.querySelector('.dropdown.menu')).toBeFalsy();
  });

  test('detailEvent should activate tab', async () => {
    jest.spyOn(tabs, 'getTabByExtId');
    tabs.getTabByExtId.mockImplementation((extId) => [{ id: 1 }]);
    jest.spyOn(tabs, 'activate');
    tabs.activate.mockImplementation(() => null);
    jest.spyOn(tabs, 'createDetailsTab');
    tabs.createDetailsTab.mockImplementation(() => null);
    jest.spyOn(ViewDropdown, 'removeDropdown');
    ViewDropdown.removeDropdown.mockImplementation(() => null);

    await ViewDropdown.detailEvent('abcdefghijkl');
    expect(tabs.getTabByExtId).toBeCalled();
    expect(tabs.activate).toBeCalled();
    expect(tabs.createDetailsTab).not.toBeCalled();
    expect(ViewDropdown.removeDropdown).not.toBeCalled();
  });

  test('detailEvent should create tab', async () => {
    jest.spyOn(tabs, 'getTabByExtId');
    tabs.getTabByExtId.mockImplementation((extId) => []);
    jest.spyOn(tabs, 'activate');
    tabs.activate.mockImplementation(() => null);
    jest.spyOn(tabs, 'createDetailsTab');
    tabs.createDetailsTab.mockImplementation(() => null);
    jest.spyOn(ViewDropdown, 'removeDropdown');
    ViewDropdown.removeDropdown.mockImplementation(() => null);

    await ViewDropdown.detailEvent('abcdefghijkl');
    expect(tabs.getTabByExtId).toBeCalled();
    expect(tabs.activate).not.toBeCalled();
    expect(tabs.createDetailsTab).toBeCalled();
    expect(ViewDropdown.removeDropdown).toBeCalled();
  });

  test('removeEvent', async () => {
    jest.spyOn(management, 'removeExtensionById');
    jest.spyOn(ViewDropdown, 'removeDropdown');
    jest.spyOn(ViewDropdown, 'removeItemById');
    chrome.management.uninstall.mockImplementation((id, opt, cb) => cb());
    ViewDropdown.removeItemById.mockImplementation(() => null);
    ViewDropdown.removeDropdown.mockImplementation(() => null);

    await ViewDropdown.removeEvent('abcdefghijkl');
    expect(management.removeExtensionById).toBeCalledTimes(1);
    expect(ViewDropdown.removeDropdown).toBeCalledTimes(1);
    expect(ViewDropdown.removeItemById).toBeCalledTimes(1);
    expect(chrome.management.uninstall).toBeCalledTimes(1);
  });

  test('removeEvent should catch error', async () => {
    jest.spyOn(management, 'removeExtensionById');
    jest.spyOn(ViewDropdown, 'removeDropdown');
    jest.spyOn(ViewDropdown, 'removeItemById');
    const lastErrorMessage = 'this is an error';
    const lastErrorGetter = jest.fn(() => lastErrorMessage);
    const lastError = {
      get message() {
        return lastErrorGetter();
      },
    };
    chrome.management.uninstall.mockImplementation((extId, opt, cb) => {
      chrome.runtime.lastError = lastError;
      cb();
      delete chrome.runtime.lastError;
    });
    ViewDropdown.removeItemById.mockImplementation(() => null);
    ViewDropdown.removeDropdown.mockImplementation(() => null);
    // jest.spyOn(console, 'error');
    jest.spyOn(global.console, 'warn');
    global.console.warn.mockImplementation(() => null);

    await ViewDropdown.removeEvent('abcdefghijkl');
    expect(management.removeExtensionById).toBeCalledTimes(1);
    expect(ViewDropdown.removeDropdown).not.toBeCalledTimes(1);
    expect(ViewDropdown.removeItemById).not.toBeCalledTimes(1);
    expect(chrome.management.uninstall).toBeCalledTimes(1);
    expect(global.console.warn).toBeCalledTimes(1);
  });

  test('removeItemById', () => {
    document.body.innerHTML = popupHtml;
    View.renderList([extensions[0]]);
    expect(document.querySelector('.list-item[data-id')).toBeTruthy();
    ViewDropdown.removeItemById(extensions[0].id);
    expect(document.querySelector('.list-item[data-id')).toBeFalsy();
  });

  test('menuEvent should call appropriate event', () => {
    const target = document.createElement('div');
    const ev = {
      stopPropagation: () => null,
      target: target,
    };

    const extId = 'abcdefghjkl';
    jest.spyOn(ViewDropdown, 'detailEvent');
    jest.spyOn(ViewDropdown, 'removeEvent');
    jest.spyOn(ViewDropdown, 'removeDropdown');
    ViewDropdown.detailEvent.mockImplementation(() => null);
    ViewDropdown.removeEvent.mockImplementation(() => null);
    ViewDropdown.removeDropdown.mockImplementation(() => null);
    target.id = 'details';
    ViewDropdown.menuEvent(ev, extId);
    expect(ViewDropdown.detailEvent).toBeCalledTimes(1);

    target.id = 'remove';
    ViewDropdown.menuEvent(ev, extId);
    expect(ViewDropdown.removeEvent).toBeCalledTimes(1);

    target.id = 'cancel';
    ViewDropdown.menuEvent(ev, extId);
    expect(ViewDropdown.removeDropdown).toBeCalledTimes(1);
  });

  test('registerMenuEvent', () => {
    document.body.innerHTML = popupHtml;
    jest.spyOn(ViewDropdown, 'menuEvent');
    ViewDropdown.menuEvent.mockImplementation(() => null);
    View.renderList([extensions[0]]);
    const isOverEdge = false;
    document.querySelector('.toggle-dropdown').insertAdjacentHTML('beforeend',
      `<div class="dropdown menu fs:12"
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
  `.replace(/\s+/g, ' '));

    ViewDropdown.registerMenuEvent('abcdefghijkl');
    userEvent.click(document.querySelector('.dropdown.menu li'));
    expect(ViewDropdown.menuEvent).toBeCalled();
  });
});
