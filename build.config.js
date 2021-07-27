/*
Compare manifest with this and folder structure
main - open in tab style which is not explicitly declare in manifest
*/
export default {
  script: {
    popup: {
      input: 'src/popup/index.js',
      output: 'dist/debug/popup.js',
    },
    background: {
      input: 'src/background/index.js',
      output: 'dist/debug/background.js',
    },
    main: {
      input: 'src/main/index.js',
      output: 'dist/debug/main.js',
    },
    content: {
      input: 'src/content/index.js',
      output: 'dist/debug/content.js',
    },
  },
  view: {
    popup: {
      input: 'src/popup/index.html',
      output: 'dist/debug/popup.html',
    },
    background: {
      input: 'src/background/index.html',
      output: 'dist/debug/background.html',
    },
    main: {
      input: 'src/main/index.html',
      output: 'dist/debug/main.html',
    },
    content: {
      input: 'src/content/index.html',
      output: 'dist/debug/content.html',
    },
  },
};
