/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
const { src, dest, lastRun } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const size = require('gulp-size');

const production = process.env.NODE_ENV === 'production';

function htmlTask() {
  const htmlPath = 'src/**/*.html';
  if (!production) {
    return src([htmlPath, '!src/lib/**/*.html'], { since: lastRun(htmlTask) })
      .pipe(replace('assets', '.'))
      .pipe(replace('index.js', function (file) {
        const dirname = this.file.dirname.split('/').pop();
        return `${dirname}.js`;
      }))
      .pipe(rename((file) => {
        file.basename = file.dirname;
        file.dirname = '';
      }))
      .pipe(size({
        showFiles: true,
      }))
      .pipe(dest('dist/debug'));
  }
  return src([htmlPath, '!src/lib/**/*.html'])
    // .pipe(replace('style.css', buildName.css))
    .pipe(replace('assets/', ''))
    .pipe(replace('index.js', function (file) {
      const dirname = this.file.dirname.split('/').pop();
      return `${dirname}.js`;
    }))
    .pipe(rename((file) => {
      file.basename = file.dirname;
      file.dirname = '';
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
    }))
    .pipe(size({
      showFiles: true,
    }))
    .pipe(dest('dist/debug'));
}

module.exports = htmlTask;
