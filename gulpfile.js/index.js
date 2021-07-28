/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line object-curly-newline
const { src, dest, watch, series, parallel } = require('gulp');
// const sourcemaps = require('gulp-sourcemaps');
const util = require('gulp-util');
const size = require('gulp-size');

const jsTask = require('./bundle.task');
const iconTask = require('./icon.task');
const manifestTask = require('./manifest.task');
const htmlTask = require('./html.task');

const production = util.env.env === 'prod';

// TODO: validate manifest file a valid json
// TODO: validate permission in manifest file

// need a task for each files
// async function rollupTask() {
//   const rollupBuild = await rollup({
//     input: 'src/popup/index.js',
//     plugins: rollupPlugins,
//   });
//   await rollupBuild.write({
//     file: 'dist/debug/popup.js',
//     format: 'iife',
//     sourcemap: true
//   });
// }

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
  parallel(iconTask, jsTask, htmlTask, manifestTask, assetTask), watchTask,
);
