module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    amd: true,
    node: true
  },
  plugins: [
    "@typescript-eslint",
    "jest",
    "eslint-plugin-eslint-comments",
    "import"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:jest/recommended",
    "prettier/@typescript-eslint",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:eslint-comments/recommended"
  ],
  rules: {
    // Optional.
    "eslint-comments/no-unused-disable": "error"
  }
};
