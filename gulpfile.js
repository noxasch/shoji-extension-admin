/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line object-curly-newline
const { src, dest, watch, series, parallel } = require('gulp');
// const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const util = require('gulp-util');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const size = require('gulp-size');
const through2 = require('through2');
const path = require('path');
const File = require('vinyl');
const resizeImg = require('resize-img');

const { rollup } = require('rollup');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const sizes = require('rollup-plugin-size');

const production = util.env.env === 'prod';

const rollupPlugins = [
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    configFile: false,
  }),
  // getBabelInputPlugin({ configFile: false }),
  nodeResolve({
    browser: true, // allow to use
  }),
  production && terser({
    format: {
      comments: false,
    },
    keep_fnames: false,
    mangle: {
      // properties: true,
      toplevel: true,
    },

  }),
  sizes(),
];

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

/**
 * @typedef {Object} filePath
 * @property {string} input how the person is called
 * @property {string} output how many years the person lived
 */

/**
 * @param {filePath} fp
 */
async function rollupTask(fp) {
  const rollupBuild = await rollup({
    input: fp.input,
    plugins: rollupPlugins,
  });
  await rollupBuild.write({
    file: fp.output,
    format: 'es',
    sourcemap: true,
  });
  await rollupBuild.close();
}

/**
 * @param {Array<filePath>} paths
 */
async function bundleTask(paths) {
  paths.forEach(async (p) => {
    await rollupTask(p);
  });
}

async function jsTask() {
  await bundleTask([
    // see build.config.js
    { input: 'src/popup/index.js', output: 'dist/debug/popup.js' },
    { input: 'src/background/index.js', output: 'dist/debug/background.js' },
  ]);
}

function assetTask() {
  return src(['assets/**/*', '!assets/**/*.png'])
    .pipe(size({
      showFiles: true,
    }))
    .pipe(dest('dist/debug'));
}

// function cleanDistFolder(cb) {
//   fs.rmdir('dist', { recursive: true }, cb);
// }

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

function htmlTask() {
  const htmlPath = 'src/**/*.html';
  // const distPath = 'dist';
  if (!production) {
    return src([htmlPath, '!src/lib/**/*.html']) // ignore not working
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
  return src(htmlPath)
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
  parallel(iconTask, jsTask, htmlTask, assetTask), watchTask,
);
