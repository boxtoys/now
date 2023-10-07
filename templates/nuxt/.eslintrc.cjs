module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended'],
  rules: {
    'vue/component-tags-order': 'off',
    'prettier/prettier': 'error'
  },
  ignorePatterns: [
    '/*.js',
    '/*.json',
    '**/dist/**',
    'server/tsconfig.json',
    '**/locales/**'
  ]
}
