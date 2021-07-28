import View from '../../src/popup/view';

describe('Basic UI Test', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
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
});
