module.exports = (api) => {
  const isTest = api.env('test');
  if (isTest) {
    // used by jest
    return {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
      ],
      sourceMaps: true,
    };
  }

  return {
    // used by eslint
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-syntax-class-properties',
    ],
    sourceMaps: true,
  };
};
