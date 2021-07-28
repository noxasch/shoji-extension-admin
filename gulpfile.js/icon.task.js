/* eslint-disable func-names */
const { src, dest } = require('gulp');
const through2 = require('through2');
const resizeImg = require('resize-img');
const path = require('path');
const size = require('gulp-size');
const File = require('vinyl');

async function iconTask() {
  return src('assets/**/*.png')
    .pipe(through2.obj(async function (file, _, cb) {
      if (file.isBuffer()) {
        try {
          const img16 = await resizeImg(file.contents, {
            width: 16,
            height: 16,
          });
          const img48 = await resizeImg(file.contents, {
            width: 48,
            height: 48,
          });
          const img128 = await resizeImg(file.contents, {
            width: 128,
            height: 128,
          });
          [
            { iconBuff: img16, name: 'icon16.png' },
            { iconBuff: img48, name: 'icon48.png' },
            { iconBuff: img128, name: 'icon128.png' },
          ].forEach((pair) => {
            this.push(new File({
              base: file.base,
              path: path.join(file.base, pair.name),
              // eslint-disable-next-line new-cap
              contents: new Buffer.from(pair.iconBuff),
            }));
          });
        } catch (error) {
          cb(error);
        }
        cb();
      }
    }))
    .pipe(size({
      showFiles: true,
    }))
    .pipe(dest('dist/debug'));
}

module.exports = iconTask;
