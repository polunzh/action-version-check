module.exports = {
  parser: 'babel-eslint',
  plugins: ['import'],
  extends: '@arcblock/eslint-config-base',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
    mocha: true,
  },
  rules: {
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
        },
        ignore: ['setupProxy.js', 'App.js'],
      },
    ],
    'no-await-in-loop': 'off',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
};
