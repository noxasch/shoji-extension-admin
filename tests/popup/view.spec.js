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
    jest.clearAllMocks();
  });

  test('should throw error if instantiate', () => {
    expect(() => new View()).toThrow(TypeError);
  });

  test('renderInfo should throw error', () => {
    expect(() => View.renderInfo(10, 5, 1))
      .toThrow(TypeError(`${View.infoBarSelector} is undefined`));
  });

  test('should output input params on info bar', () => {
    const params = {
      extensionCount: 10,
      activeCount: 5,
      devCount: 1,
    };
    const expectedOutput = `You have a total of ${params.extensionCount}\
 extensions. ${params.activeCount} enabled\
 extension. ${params.devCount} dev extension.`;

    document.body.innerHTML = popupHtml;
    View.renderInfo(10, 5, 1);
    const res = document.querySelector(`${View.infoBarSelector}`).textContent;
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

  test('init should call three function', () => {
    jest.spyOn(View, 'renderInfo');
    jest.spyOn(View, 'renderList');
    jest.spyOn(View, 'registerSwitchEvent');
    document.body.innerHTML = popupHtml;
    View.init(extensions, extensions);
    expect(View.renderInfo).toBeCalled();
    expect(View.renderList).toBeCalled();
    expect(View.registerSwitchEvent).toBeCalled();
  });

  test('Should execute onSwitchChange', () => {
    jest.spyOn(View, 'onSwitchChange');
    // View.onSwitchChange.mockImplementation(() => null);
    document.body.innerHTML = '<div><input type="checkbox"/><div>';
    View.registerSwitchEvent();
    userEvent.click(document.querySelector(View.switchSelector));
    expect(View.onSwitchChange).toBeCalled();
  });

  test('onSwitchChange shoud called setEnabled', () => {
    jest.spyOn(management, 'setEnabled');
    const el = document.createElement('input');
    const ev = { target: el };
    View.onSwitchChange(ev);
    expect(management.setEnabled).toBeCalled();
  });

  test('onSwitchChange shoud not called setEnabled', () => {
    jest.spyOn(management, 'setEnabled');
    View.onSwitchChange({});
    expect(management.setEnabled).not.toBeCalled();
  });

  test('should return 2', () => {
    const count = View.getActiveExtensionCount(extensions);
    expect(count).toBe(2);
  });
});
