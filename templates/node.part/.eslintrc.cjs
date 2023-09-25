module.exports = {
  "root": true,
  "plugins": [
    "prettier",
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "no-case-declarations": "off",
    "prettier/prettier": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-floating-promises": [
      "error",
      {
        "ignoreIIFE": true
      }
    ]
  },
  "env": {
    "node": true
  },
  "ignorePatterns": [
    "/*.js",
    "/*.json",
    "**/dist/**",
    "**/test/**",
    "**/types/**"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
