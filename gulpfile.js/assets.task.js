const { src, dest, lastRun } = require('gulp');
const size = require('gulp-size');

const production = process.env.NODE_ENV === 'production';

function assetTask() {
  const srcOpts = production && { since: lastRun(assetTask) };
  return src([
    'assets/**/*',
    '!assets/**/*.png',
    '!assets/manifest.json', // manifest is handled by the manifestTask()
    '!assets/*.pem', // exclude debug key from dist
  ], srcOpts)
    .pipe(size({
      showFiles: true,
    }))
    .pipe(dest('dist/debug'));
}

module.exports = assetTask;
