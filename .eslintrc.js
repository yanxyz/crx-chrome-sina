// https://eslint.org/docs/user-guide/configuring

module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es6": true,
  },
  "parserOptions": {
    "ecmaVersion": 2017,
  },
  "globals": {
    "chrome": false
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
    "semi": ["error", "never"],
    "no-unused-vars": ["error", { "vars": "all", "args": "none" }],
    "no-console": 0
  }
}
