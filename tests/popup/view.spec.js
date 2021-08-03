/**
 * @jest-environment jsdom
 */
/* eslint-disable no-console */
import userEvent from '@testing-library/user-event';
import popupHtml from '../fixtures/popup';
import extensions from '../fixtures/extensionsList';
import management from '../../src/lib/management';
import View from '../../src/popup/view';

describe('Basic UI Test', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // sequence matter
    jest.useFakeTimers();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
    jest.spyOn(console, 'error');
    console.error.mockImplementation(() => null);
  });

  afterEach(() => {
    // sequence matter
    window.requestAnimationFrame.mockRestore();
    console.error.mockRestore();
    jest.clearAllTimers(); // avoid infinite loop
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('View Should throw error if instantiate', () => {
    expect(() => new View()).toThrow(TypeError);
  });

  test('renderInfo should throw error', () => {
    expect(() => View.renderInfo(10, 5, 1))
      .toThrow(TypeError(`${View.infoBarSelector} is undefined`));
  });

  test('render mainSummaryInfo', () => {
    const params = {
      extensionCount: 10,
      activeCount: 5,
      devCount: 1,
    };
    const expectedOutput = View.mainSummaryInfo(
      params.extensionCount,
      params.activeCount,
      params.devCount,
    );

    document.body.innerHTML = popupHtml;
    View.renderInfo(View.mainSummaryInfo.bind(
      null,
      params.extensionCount,
      params.activeCount,
      params.devCount,
    ));
    const res = document.querySelector(`${View.infoBarSelector}`).innerHTML;
    expect(res).toBe(expectedOutput);
  });

  test('render searchSummaryInfo', () => {
    const params = {
      found: 2,
      total: 10,
      devCount: 1,
    };
    const expectedOutput = View.searchSummaryInfo(
      params.found,
      params.total,
      params.devCount,
    );

    document.body.innerHTML = popupHtml;
    View.renderInfo(View.searchSummaryInfo.bind(
      null,
      params.found,
      params.total,
      params.devCount,
    ));
    const res = document.querySelector(`${View.infoBarSelector}`).innerHTML;
    expect(res).toBe(expectedOutput);
  });

  test('render searchSummaryInfo no item found', () => {
    const params = {
      found: 0,
      total: 10,
      devCount: 1,
    };
    const expectedOutput = View.searchSummaryInfo(
      params.found,
      params.total,
      params.devCount,
    );

    document.body.innerHTML = popupHtml;
    View.renderInfo(View.searchSummaryInfo.bind(
      null,
      params.found,
      params.total,
      params.devCount,
    ));
    const res = document.querySelector(`${View.infoBarSelector}`).innerHTML;
    expect(res).toBe(expectedOutput);
  });

  test('should be a valid base64 with png format', () => {
    // eslint-disable-next-line max-len
    const validBase64 = '^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$';
    const output = View._generateBase64Img('String');
    const base64String = output.split(',')[1];
    const format = output.split(';')[0].split(':')[1];
    expect(base64String).toMatch(new RegExp(validBase64));
    expect(format).toBe('image/png');
    // console.log(output);
  });

  test('should remove all list item', () => {
    document.body.innerHTML = '<ul id="list"><li>1</li><li>2</li><li>3</li></ul>';
    View.clearElement(document.getElementById('list'));
    expect(document.getElementById('list').innerHTML).toBe('');
  });

  test('Should execute generateBase64Image', () => {
    jest.spyOn(View, '_generateBase64Img');
    const extension = extensions[0];
    View._getMaxResIcon(extension);
    expect(View._generateBase64Img).toBeCalled();
  });

  test('Should not called _generateBase64Img', () => {
    jest.spyOn(View, '_generateBase64Img');
    const extension = extensions[1];
    // console.log(extension);
    View._getMaxResIcon(extension);
    expect(View._generateBase64Img).not.toBeCalled();
    // expect(res).toBe(extension.icons[2]);
  });

  test('Should return the last image', () => {
    const extension = extensions[1];
    const res = View._getMaxResIcon(extension);
    const expected = extension.icons[2].url;
    expect(res).toBe(expected);
  });

  test('removeReloadButton should remove button', () => {
    document.body.innerHTML = popupHtml;
    View.removeReloadButton();
    expect(document.getElementById(View.reloadBtnId)).toBeFalsy();
  });

  test('init should call four function', async () => {
    // jest.spyOn(View, 'renderInfo');
    jest.spyOn(View, 'renderList');
    jest.spyOn(View, 'registerSwitchEvent');
    jest.spyOn(management, 'getAllExt');
    jest.spyOn(management, 'filterDevExtension');
    management.getAllExt.mockImplementation(() => Promise.resolve(extensions));
    document.body.innerHTML = popupHtml;
    await View.init();
    expect(management.getAllExt).toBeCalled();
    expect(management.filterDevExtension).toBeCalled();
    expect(View.renderList).toBeCalled();
    expect(View.registerSwitchEvent).toBeCalled();
  });

  test('init should remove reload button', async () => {
    // jest.spyOn(View, 'renderInfo');
    jest.spyOn(View, 'renderList');
    jest.spyOn(View, 'registerSwitchEvent');
    jest.spyOn(View, 'removeReloadButton');
    jest.spyOn(management, 'getAllExt');
    jest.spyOn(management, 'filterDevExtension');
    management.getAllExt.mockImplementation(() => Promise.resolve([]));
    document.body.innerHTML = popupHtml;
    await View.init();
    expect(management.getAllExt).toBeCalled();
    expect(management.filterDevExtension).toBeCalled();
    expect(View.removeReloadButton).toBeCalled();
    expect(View.renderList).toBeCalled();
    expect(View.registerSwitchEvent).toBeCalled();
  });

  test('Should execute onSwitchChange', () => {
    jest.spyOn(View, 'onSwitchChange');
    View.onSwitchChange.mockImplementation(() => null);
    document.body.innerHTML = '<div><input type="checkbox"/><div>';
    View.registerSwitchEvent();
    userEvent.click(document.querySelector(View.switchSelector));
    expect(View.onSwitchChange).toBeCalled();
  });

  test('onSwitchChange should called setEnabled', async () => {
    jest.spyOn(management, 'setEnabled');
    jest.spyOn(management, 'getAllExt');
    jest.spyOn(View, 'renderInfo');
    management.setEnabled.mockImplementation(() => Promise.resolve());
    management.getAllExt.mockImplementation(() => Promise.resolve(extensions));
    View.renderInfo.mockImplementation(() => null);
    const el = document.createElement('input');
    const ev = { target: el };
    await View.onSwitchChange(ev);
    expect(management.setEnabled).toBeCalled();
  });

  test('onSwitchChange should toggle grayscale', async () => {
    const extInfo = [...[extensions[2]]];
    jest.spyOn(management, 'setEnabled');
    jest.spyOn(management, 'getAllExt');
    management.setEnabled.mockImplementation(() => Promise.resolve());
    management.getAllExt.mockImplementation(() => Promise.resolve(extensions));
    document.body.innerHTML = popupHtml;
    expect(document.querySelector('.grayscale')).toBeFalsy();
    View.renderList(extInfo);
    const listItem = document.querySelectorAll('.list-item');
    expect(listItem.length).toBe(1);
    expect(document.querySelectorAll('.grayscale').length).toBe(1);
    const el = listItem[0].querySelector(View.switchSelector);
    const ev = { target: el };
    await View.onSwitchChange(ev);
    expect(document.querySelector('.grayscale')).toBeFalsy();
  });

  test('onSwitchChange should not called setEnabled', () => {
    jest.spyOn(management, 'setEnabled');
    View.onSwitchChange({});
    expect(management.setEnabled).not.toBeCalled();
  });

  test('should return 2', () => {
    const count = View.getActiveExtensionCount(extensions);
    expect(count).toBe(2);
  });

  test('renderSearchResult', () => {
    document.body.innerHTML = popupHtml;
    jest.spyOn(View, 'renderInfo');
    jest.spyOn(View, 'renderList');
    View.renderSearchResults([], 10, 'query');
    expect(View.renderInfo).toBeCalledTimes(1);
    expect(View.renderList).toBeCalledTimes(1);
  });
});
