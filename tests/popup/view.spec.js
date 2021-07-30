/**
 * @jest-environment jsdom
 */
import View from '../../src/popup/view';

afterEach(() => {
  jest.useRealTimers();
});

describe('Basic UI Test', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should throw error if instantiate', () => {
    expect(() => new View()).toThrow(TypeError);
  });

  test('Should output input params on info bar', () => {
    const params = {
      extensionCount: 10,
      activeCount: 5,
      devCount: 1,
    };
    const expectedOutput = `You have a total of ${params.extensionCount}\
 extensions. ${params.activeCount} enabled\
 extension. ${params.devCount} dev extension.`;

    const className = View.infoBarSelector.replace('.', '');

    document.body.innerHTML = `<div class="${className}"></div>`;
    View.renderInfo(10, 5, 1);
    const res = document.querySelector(`${View.infoBarSelector}`).textContent;
    expect(res).toBe(expectedOutput);
  });

  test('should be a valid base64 png', () => {
    // eslint-disable-next-line max-len
    const validBase64 = '^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$';
    const output = View._generateBase64Img('String');
    const base64String = output.split(',')[1];
    const format = output.split(';')[0].split(':')[1];
    expect(base64String).toMatch(new RegExp(validBase64));
    expect(format).toBe('image/png');
    // console.log(output);
  });
});
