/* eslint-disable no-param-reassign */
// const { src, dest } = require('gulp');
// const rename = require('gulp-rename');
// const rollup = require('gulp-best-rollup');
// const size = require('gulp-size');

const { rollup } = require('rollup');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const sizes = require('rollup-plugin-size');

const production = process.env.NODE_ENV === 'production';

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

// uses gulp-best-rollup
// function expTask() {
//   return src(['src/**/index.js'])
//     .pipe(rollup({
//       // There is no `input` option as rollup integrates into the gulp pipeline
//       plugins: rollupPlugins,
//     }, {
//       // Rollups `sourcemap` option is unsupported. Use `gulp-sourcemaps` plugin instead
//       format: 'es',
//     }))
//     .pipe(rename((file) => {
//       console.log(file);
//       file.basename = file.dirname;
//       file.dirname = '';
//     }))
//     .pipe(size({
//       showFiles: true,
//     }))
//     .pipe(dest('dist/debug'));
// }

async function jsTask() {
  await bundleTask([
    // see build.config.js
    { input: 'src/popup/index.js', output: 'dist/debug/popup.js' },
    { input: 'src/background/index.js', output: 'dist/debug/background.js' },
  ]);
}

module.exports = jsTask;
