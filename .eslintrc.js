module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['react'],
  globals: {
    graphql: false,
    __PATH_PREFIX__: false,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },
  rules: {
    'react/prefer-stateless-function': 'off',
    'react/jsx-filename-extension': 'off',
    // react/jsx-one-expression-per-line, disabled until inline elements can be allowed on the same line
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': ['error', { ignore: ['data', 'pageContext', 'location'] }],
  },
};
