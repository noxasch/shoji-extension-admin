module.exports = (api) => {
  const isTest = api.env('test');
  if (isTest) {
    return {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
      ],
    };
  }

  return {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-syntax-class-properties',
    ],
  };
};
