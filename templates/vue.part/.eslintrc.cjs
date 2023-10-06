module.exports = {
  root: true,
  plugins: ['prettier', '@typescript-eslint'],
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended'
  ],
  rules: {
    'no-case-declarations': 'off',
    'prettier/prettier': 'error'
  },
  env: {
    node: true,
    browser: true
  },
  ignorePatterns: [
    '/*.js',
    '/*.json',
    '**/dist/**',
    '**/test/**',
    '**/types/**'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true
    },
    parser: {
      js: 'espree',
      jsx: 'espree',
      ts: require.resolve('@typescript-eslint/parser'),
      tsx: require.resolve('@typescript-eslint/parser')
    }
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn'
      }
    }
  ]
}
