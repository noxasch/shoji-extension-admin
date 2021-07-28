import { JSDOM } from 'jsdom';
// import View from '../src/popup/view';

// const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>');
// console.log(dom.window.document.querySelector('p').textContent); // "Hello world"

const DEFAULT_HTML = '<html><body></body></html>';

function setupTestEnvironment() {
  const dom = new JSDOM(DEFAULT_HTML, {
    features: {
      QuerySelector: true,
    },
  });
  Object.defineProperty(window, 'window', { value: dom.window });
  Object.defineProperty(document, 'document', { value: dom.window.document });
  // console.log(document);
  // dom.window.document.body.innerHTML =`<div id="test" class="test"></div>`;
  // console.log('querySelector', dom.window.document.querySelector('.test'));
  // console.log('querySelectorAll', dom.window.document.querySelectorAll('.test'));
  // console.log('getElementsByClassName', dom.window.document.getElementsByClassName('test'));
  // console.log('id', dom.window.document.querySelector('#test'));
}

setupTestEnvironment();
