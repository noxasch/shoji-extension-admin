/**
 * @jest-environment jsdom
 */
import { fireEvent } from '@testing-library/dom';
import management from '../../src/lib/management';
// import initSearchEvent, * as search from '../../src/popup/search';
import ViewSearch from '../../src/popup/search';
// import initSearchEvent, { handleSearch, searchQuery, prepareRegex } from '../../src/popup/search';
import View from '../../src/popup/view';
import extensionsInfo from '../fixtures/extensionsList';
import popupHtml from '../fixtures/popup';

describe('Search', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // sequence matter
    jest.useFakeTimers();
    // jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
    // jest.spyOn(console, 'error');
    // console.error.mockImplementation(() => null);
  });

  afterEach(() => {
    // sequence matter
    // window.requestAnimationFrame.mockRestore();
    // console.error.mockRestore();
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('escapeRegExp should escape regex', () => {
    // eslint-disable-next-line no-useless-escape
    const expected = '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\\\]';
    const res = ViewSearch.escapeRegExp('.*+?^${}()|[]\\]');
    // console.warn(res);
    expect(res).toEqual(expected);
  });

  test('prepareRegex should output expected regex', () => {
    // eslint-disable-next-line no-useless-escape
    const expected = /^(?=.*abcssdasd\.\*\+\?\^\$\{\}\(\)\|\[\]\\\]).*$/i;
    const res = ViewSearch.prepareRegex('abcssdasd.*+?^${}()|[]\\]');
    // console.warn(res);
    expect(res).toEqual(expected);
  });

  test('searchQuery', () => {
    jest.spyOn(ViewSearch, 'prepareRegex');
    const res = ViewSearch.searchQuery(extensionsInfo, 'ext');
    expect(res.length).toBe(4);
  });

  test('initSearchEvent should throw error', () => {
    // initSearchEvent();
    expect(() => ViewSearch.init()).toThrow(TypeError('SearchBox is undefined'));
  });

  test('handleSearch with input', async () => {
    jest.spyOn(management, 'getAllExt');
    management.getAllExt.mockImplementation(() => []);
    jest.spyOn(ViewSearch, 'searchQuery');
    ViewSearch.searchQuery.mockImplementation((ext, q) => null);
    jest.spyOn(ViewSearch, 'prepareRegex');
    ViewSearch.prepareRegex.mockImplementation((q) => null);
    jest.spyOn(View, 'renderSearchResults');
    View.renderSearchResults.mockImplementation(() => null);

    await ViewSearch.handleSearch('something');
    expect(management.getAllExt).toBeCalled();
    expect(ViewSearch.searchQuery).toBeCalled();
    expect(View.renderSearchResults).toBeCalled();
  });

  test('handleSearch without input', async () => {
    jest.spyOn(management, 'getAllExt');
    management.getAllExt.mockImplementation(() => []);
    jest.spyOn(management, 'filterDevExtension');
    management.getAllExt.mockImplementation(() => []);
    jest.spyOn(View, 'resetView');
    View.resetView.mockImplementation(() => null);

    await ViewSearch.handleSearch('');
    expect(management.getAllExt).toBeCalled();
    expect(management.filterDevExtension).toBeCalled();
    expect(View.resetView).toBeCalled();
  });

  test('initSearchEvent should call eventHandler', () => {
    document.body.innerHTML = popupHtml;
    // const { SearchEvent: Search } = search;
    const onChange = jest.spyOn(ViewSearch, 'change');
    const onKeydown = jest.spyOn(ViewSearch, 'keydown');
    const onInput = jest.spyOn(ViewSearch, 'input');
    ViewSearch.change.mockImplementation(() => null);
    ViewSearch.keydown.mockImplementation(() => null);
    ViewSearch.input.mockImplementation(() => null);
    ViewSearch.init();

    const searchBox = document.getElementById('search');
    // const changeEvent = new Event('change');
    // searchBox.dispatchEvent(changeEvent);
    // fireEvent.EVENT_NAME is the wrapper to the above
    fireEvent.change(searchBox);
    expect(onChange).toBeCalled();
    fireEvent.keyDown(searchBox);
    expect(onKeydown).toBeCalled();
    fireEvent.input(searchBox);
    expect(onInput).toBeCalled();
  });

  test('onKeydown', () => {
    document.body.innerHTML = popupHtml;
    ViewSearch.typingTimer = setTimeout(() => {}, ViewSearch.typeInterval);
    expect(ViewSearch.typingTimer).toBeTruthy();
    ViewSearch.keydown();
    expect(ViewSearch.typingTimer).toBeFalsy();
  });

  test('onChange', () => {
    jest.spyOn(ViewSearch, 'handleSearch');
    ViewSearch.handleSearch.mockImplementation(() => null);
    document.body.innerHTML = popupHtml;
    const searchBox = document.getElementById('search');
    // searchBox.value = 'something';
    ViewSearch.typingTimer = setTimeout(() => { }, ViewSearch.typeInterval);
    ViewSearch.change({ target: searchBox });
    expect(clearTimeout).toBeCalled();
    expect(ViewSearch.typingTimer).toBeTruthy();
    expect(ViewSearch.handleSearch).not.toBeCalled();
    jest.runAllTimers();
    expect(setTimeout).toBeCalled();
    expect(ViewSearch.handleSearch).toBeCalled();
  });

  test('onInput', () => {
    jest.spyOn(ViewSearch, 'handleSearch');
    ViewSearch.handleSearch.mockImplementation(() => null);
    document.body.innerHTML = popupHtml;
    const searchBox = document.getElementById('search');
    searchBox.value = 'something';
    ViewSearch.typingTimer = setTimeout(() => { }, ViewSearch.typeInterval);
    ViewSearch.input({ target: searchBox });
    expect(clearTimeout).toBeCalled();
    expect(ViewSearch.typingTimer).toBeTruthy();
    expect(ViewSearch.handleSearch).not.toBeCalled();
    jest.runAllTimers();
    expect(setTimeout).toBeCalled();
    expect(ViewSearch.handleSearch).toBeCalled();
  });
});
