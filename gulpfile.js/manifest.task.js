/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
const { src, dest } = require('gulp');
const through2 = require('through2');
const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

const production = process.env.NODE_ENV === 'production';

/**
 * 
 * @param {String} fileString
 * @param {String} keyString 
 * @returns {Buffer}
 */
function encodeManifestKey64(fileString, debugKeySting) {
  const res = JSON.parse(fileString);
  const encoded = forge.util.encode64(debugKeySting);
  res.key = encoded;
  return Buffer.from(JSON.stringify(res, null, '\t'));
}

function includeDebugKey(contentsBuffer) {
  let processBuffer = Buffer.from(contentsBuffer);
  if (!production) {
    const debugKey = fs
      .readFileSync(path.join(process.cwd(), 'assets/debug.pem'))
      .toString();
    processBuffer = encodeManifestKey64(processBuffer.toString(), debugKey);
  } else if (process.env.CI) {
    processBuffer = encodeManifestKey64(
      processBuffer.toString(),
      process.env.PEM_KEY,
    );
  }
  return processBuffer;
}

function manifestTask() {
  return src(['assets/manifest.json'])
    .pipe(through2.obj(async function (file, _, cb) {
      // if (!production) {
      //   const debugKey = fs
      //     .readFileSync(path.join(process.cwd(), 'assets/debug.pem'))
      //     .toString();
      //   file.contents = encodeManifestKey64(file.contents.toString(), debugKey);
      // } else if (process.env.CI) {
      //   file.contents = encodeManifestKey64(
      //     file.contents.toString(),
      //     process.env.PEM_KEY,
      //   );
      // }
      file.contents = includeDebugKey(file.contents);
      cb(null, file);
    }))
    .pipe(dest('dist/debug'));
}

module.exports = manifestTask;
