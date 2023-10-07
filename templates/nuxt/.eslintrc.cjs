module.exports = {
  root: true,
  extends: ['@nuxtjs/eslint-config-typescript'],
  rules: {
    'vue/component-tags-order': 'off'
  },
  ignorePatterns: [
    '/*.js',
    '/*.json',
    '**/dist/**',
    'server/tsconfig.json',
    '**/locales/**'
  ]
}
