module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    node: true,
    jest: true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    'plugin:prettier/recommended',
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['.eslintrc.js'],
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  }
}
