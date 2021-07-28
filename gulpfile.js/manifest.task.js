/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
const { src, dest } = require('gulp');
const util = require('gulp-util');
const through2 = require('through2');
const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

const production = util.env.env === 'prod';

function manifestTask() {
  return src(['assets/manifest.json'])
    .pipe(through2.obj(async function (file, _, cb) {
      if (!production) {
        const res = JSON.parse(file.contents.toString());
        // crypto.scrypt
        const debugKey = fs
          .readFileSync(path.join(process.cwd(), 'assets/debug.pem'))
          .toString();
        const encoded = forge.util.encode64(debugKey);
        res.key = encoded;
        file.contents = Buffer.from(JSON.stringify(res, null, '\t'));
      }
      cb(null, file);
    }))
    .pipe(dest('dist/debug'));
}

module.exports = manifestTask;
