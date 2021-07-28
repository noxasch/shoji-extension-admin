/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line object-curly-newline
const { src, dest, watch, series, parallel } = require('gulp');
// const sourcemaps = require('gulp-sourcemaps');
require('dotenv').config(); // include .env to process.env
const size = require('gulp-size');

const jsTask = require('./bundle.task');
const iconTask = require('./icon.task');
const manifestTask = require('./manifest.task');
const htmlTask = require('./html.task');

const production = process.env.NODE_ENV === 'production';

function assetTask() {
  return src([
    'assets/**/*',
    '!assets/**/*.png',
    '!assets/manifest.json', // manifest is handled by the manifestTask()
    ...(production ? ['!assets/*.pem'] : []), // exclude debug key on production
  ])
    .pipe(size({
      showFiles: true,
    }))
    .pipe(dest('dist/debug'));
}

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
  }
  return cb(); // signal completion
}

// exports.default = series(cleanDistFolder, parallel(),
//   watchTask);

exports.default = series(
  parallel(iconTask, jsTask, htmlTask, manifestTask, assetTask),
  watchTask,
);
