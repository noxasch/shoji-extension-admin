const { src, dest, watch, series, parallel } = require('gulp');
// const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const util = require('gulp-util');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

// const fs = require('fs');

const { rollup } = require('rollup');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const production = util.env.env === 'prod';

const rollupPlugins = [
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
  }),
  nodeResolve({
    browser: true, // allow to use
  }),
  production && terser({
    keep_fnames: false,
    mangle: {
      toplevel: true,
    }
  }),
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
 * @param {filePath} path
 */
async function rollupTask(path) {
  const rollupBuild = await rollup({
    input: path.input,
    plugins: rollupPlugins,
  });
  await rollupBuild.write({
    file: path.output,
    format: 'iife',
    sourcemap: true
  });
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
    { input: 'src/popup/index.js', output: 'dist/debug/popup.js'},
  ]);
}

function assetTask() {
  return src('assets/**/*')
    .pipe(dest('dist/debug'));
}

// function cleanDistFolder(cb) {
//   fs.rmdir('dist', { recursive: true }, cb);
// }

function htmlTask() {
  const htmlPath = 'src/**/*.html';
  const distPath = 'dist';
  if (!production) {
    return src([htmlPath, '!lib/**/*.html'],) // ignore not working
      .pipe(replace('assets', '.'))
      .pipe(replace('index.js', function(file) {
        const dirname = this.file.dirname.split('/').pop();
        return `${dirname}.js`;
      }))
      .pipe(rename((file) => {
        file.basename = file.dirname;
        file.dirname = '';
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
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, minifyCSS: true }))
    .pipe(dest('dist/debug'));
}


// function watchTask(cb) {
//   if (!production) {
//     watch([
//       sourceFiles.scssPath,
//       sourceFiles.htmlPath,
//       sourceFiles.jsPath
//     ],
//       series(
//         cleanDistFolder,
//         parallel(licenseTask, mdiTask, fontTask, htmlTask, jsTask),
//       ));
//   }
//   return cb(); // signal completion
// }

// exports.default = series(cleanDistFolder, parallel(),
//   watchTask);

exports.default = series(parallel(jsTask, htmlTask, assetTask));
