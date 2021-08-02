const extensions = [
  {
    id: 'abcdefghijkl',
    installType: 'development',
    name: 'extension 0',
    enabled: true,
    type: 'extension',
  },
  {
    id: '1234',
    name: 'extension 1',
    enabled: true,
    icons: [
      { url: 'chrome://extension-icon/1/16/0' },
      { url: 'chrome://extension-icon/2/48/0' },
      { url: 'chrome://extension-icon/3/128/0' },
    ],
    type: 'extension',
  },
  {
    id: '2',
    name: 'extension 2',
    enabled: false,
    icons: [
      { url: 'chrome://extension-icon/1/16/0' },
      { url: 'chrome://extension-icon/2/48/0' },
      { url: 'chrome://extension-icon/3/128/0' },
    ],
    type: 'extension',
  },
  {
    id: '3',
    name: 'extension 3',
    icons: [
      { url: 'chrome://extension-icon/1/16/0' },
      { url: 'chrome://extension-icon/2/48/0' },
      { url: 'chrome://extension-icon/3/128/0' },
      { url: 'chrome://extension-icon/5/128/0' },
      { url: 'chrome://extension-icon/6/128/0' },
    ],
    type: 'extension',
  },
  {
    id: '4',
    name: 'App 4',
    icons: [
      { url: 'chrome://extension-icon/1/16/0' },
      { url: 'chrome://extension-icon/2/48/0' },
      { url: 'chrome://extension-icon/3/128/0' },
      { url: 'chrome://extension-icon/5/128/0' },
      { url: 'chrome://extension-icon/6/128/0' },
    ],
    type: 'app',
  },
  {
    id: '5',
    name: 'Theme 5',
    icons: [
      { url: 'chrome://extension-icon/1/16/0' },
      { url: 'chrome://extension-icon/2/48/0' },
      { url: 'chrome://extension-icon/3/128/0' },
      { url: 'chrome://extension-icon/5/128/0' },
      { url: 'chrome://extension-icon/6/128/0' },
    ],
    type: 'theme',
  },
];

module.exports = extensions;
