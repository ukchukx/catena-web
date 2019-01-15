// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/recommended', 'airbnb-base'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['warn', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'object-shorthand': 'off',
    'object-curly-newline': 'off',
    'camelcase': 'off',
    'yoda': 'off',
    'comma-dangle': ['error', 'never'],
    'max-len': ['error', 120, 2, { ignoreComments: true }],
    'no-unused-vars': ['warn', { 'vars': 'local', 'args': 'none' }],
    'no-cond-assign': ['error', 'except-parens'],
    'no-param-reassign': 'off',
    'no-nested-ternary': 'off',
    'no-trailing-spaces': 'off',
    'import/prefer-default-export': 'off',
    'linebreak-style': 'off',
    'no-continue': 'off'
  }
}
