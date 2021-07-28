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
}

setupTestEnvironment();
