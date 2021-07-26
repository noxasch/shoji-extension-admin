module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended', 
    'eslint-config-airbnb-base'
  ],
  'parserOptions': {
    'ecmaVersion': 12
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'no-unused-vars': [
      'error', 
      { 'vars': 'all', 'args': 'none', 'ignoreRestSiblings': false }
    ],
    'no-trailing-spaces': [
      'error', 
      { 'ignoreComments': true },
    ],
    'max-len': [
      'error', 
      { 'ignoreComments': true }
    ],
    'prefer-arrow-callback': false,
  }
};
