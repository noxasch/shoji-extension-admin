const extensions = [
  {
    id: '1',
    installType: 'development',
    name: 'extension 0',
    enabled: true,
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
  },
];

module.exports = extensions;
