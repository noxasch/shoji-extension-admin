/* eslint-disable global-require */
const { src, dest } = require('gulp');
const zip = require('gulp-zip');

function zipTask() {
  const manifest = require('../assets/manifest.json');
  const packageJson = require('../package.json');
  const name = manifest.short_name ?? manifest.name;
  const { version } = packageJson;
  const outputFile = `${name} ${version}.zip`.replace(/\s/g, '_');
  return src('dist/debug/**/*')
    .pipe(zip(outputFile))
    .pipe(dest('dist/release'));
}

module.exports = zipTask;
