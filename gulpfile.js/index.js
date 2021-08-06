/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line object-curly-newline
const fs = require('fs');
const { watch, series, parallel } = require('gulp');
// const sourcemaps = require('gulp-sourcemaps'); // gulp has built in sourcemaps
require('dotenv').config(); // load .env to process.env before load any task

const jsTask = require('./bundle.task');
const iconTask = require('./icon.task');
const manifestTask = require('./manifest.task');
const htmlTask = require('./html.task');
const assetTask = require('./assets.task');
const zipTask = require('./zip.task');

const production = process.env.NODE_ENV === 'production';
const test = process.env.NODE_ENV === 'test';

function cleanDebugFolder(cb) {
  fs.rmdir('dist/debug', { recursive: true }, cb);
}

function watchTask(cb) {
  watch(['src/**/*.js'], series(jsTask));
  watch(['src/**/*.html'], series(htmlTask));
  watch(['assets/**/*'], series(assetTask));
  watch(['assets/manifest.json'], series(manifestTask));
  // if (!production && !test) {
  //   // watch(['src/**/*.js'],
  //   //   series(
  //   //     // cleanDistFolder,
  //   //     parallel(jsTask, htmlTask, assetTask),
  //   //   ));
  //   watch(['src/**/*.js'], series(jsTask));
  //   watch(['src/**/*.html'], series(htmlTask));
  //   watch(['assets/**/*'], series(assetTask));
  //   watch(['assets/manifest.json'], series(manifestTask));
  // }
  // return cb(null); // signal completion
}

const seriesTasks = [
  ...(production ? [cleanDebugFolder] : []),
  ...(test ? [cleanDebugFolder] : []),
  parallel(iconTask, htmlTask, manifestTask, assetTask, jsTask),
  ...(production ? [zipTask] : []),
  ...(!production && !test ? [watchTask] : []),
];

// exports.default = series(cleanDistFolder, parallel(),
//   watchTask);
// series and parallel accept either each task as params or list
// but not mixed
exports.default = series(seriesTasks);
