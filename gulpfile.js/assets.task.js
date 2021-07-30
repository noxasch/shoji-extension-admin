const { src, dest, lastRun } = require('gulp');
const size = require('gulp-size');

const production = process.env.NODE_ENV === 'production';

function assetTask() {
  return src([
    'assets/**/*',
    '!assets/**/*.png',
    '!assets/manifest.json', // manifest is handled by the manifestTask()
    ...(production ? ['!assets/*.pem'] : []), // exclude debug key on production
  ],
  { since: lastRun(assetTask) })
    .pipe(size({
      showFiles: true,
    }))
    .pipe(dest('dist/debug'));
}

module.exports = assetTask;
