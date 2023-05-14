module.exports = {
  extends: [
    'eslint-config-airbnb-base',
  ],

  env: {
    browser: true,
  },

  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true },
    ],
  },
};
