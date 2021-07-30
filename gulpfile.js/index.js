/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line object-curly-newline
const { watch, series, parallel } = require('gulp');
// const sourcemaps = require('gulp-sourcemaps'); // gulp has built in sourcemaps
require('dotenv').config(); // include .env to process.env before load any task

const jsTask = require('./bundle.task');
const iconTask = require('./icon.task');
const manifestTask = require('./manifest.task');
const htmlTask = require('./html.task');
const assetTask = require('./assets.task');

const production = process.env.NODE_ENV === 'production';

function watchTask(cb) {
  if (!production) {
    // watch(['src/**/*.js'],
    //   series(
    //     // cleanDistFolder,
    //     parallel(jsTask, htmlTask, assetTask),
    //   ));
    watch(['src/**/*.js'], series(jsTask));
    watch(['src/**/*.html'], series(htmlTask));
    watch(['assets/**/*'], series(assetTask));
    watch(['assets/manifest.json'], series(manifestTask));
  }
  return cb(null); // signal completion
}

// exports.default = series(cleanDistFolder, parallel(),
//   watchTask);

exports.default = series(
  parallel(iconTask, htmlTask, manifestTask, assetTask, jsTask),
  watchTask,
);
