module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
    es2022: true
  },
  plugins: ["@typescript-eslint", "smells", "filenames", "import"],
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".ts", ".js", ".jsx", ".json"]
      }
    },
    "import/extensions": [".js", ".jsx", ".mjs", ".ts", ".tsx"]
  },
  globals: {
    NodeJS: true
  },
  extends: [
    "plugin:vue/base",
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    "plugin:vue/recommended",

    "@vue/prettier",
    "@vue/typescript",

    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript"
  ],
  rules: {
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        mjs: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ],
    "no-empty": ["error", { allowEmptyCatch: true }],
    "import/no-duplicates": "error",
    "comma-dangle": ["warn", "never"],
    "vue/no-v-html": "off",
    "vue/require-prop-types": "off",
    "vue/require-default-prop": "off",
    "vue/this-in-template": "error",
    "vue/no-restricted-syntax": "error",
    "vue/v-on-function-call": "error",
    "vue/multi-word-component-names": "off",
    "vue/no-v-for-template-key": "off",
    "padding-line-between-statements": [
      "warn",
      { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
      {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"]
      },
      { blankLine: "always", prev: "*", next: "return" }
    ],
    "filenames/match-regex": ["error", "^[a-z0-9_.-]+$", false],
    "no-console": process.env.NODE_ENV === "dev" ? "warn" : "error",
    "no-debugger": process.env.NODE_ENV === "dev" ? "warn" : "error",
    "no-alert": "error",
    "no-var": "error",
    "vue/no-reserved-component-names": "off",
    "object-literal-sort-keys": 0,
    "smells/no-switch": "error",
    "smells/no-complex-switch-case": "error",
    "smells/no-this-assign": "off",
    "no-unexpected-multiline": "error",
    "no-return-assign": ["error", "always"],
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/prefer-optional-chain": "warn",
    "import/order": [
      "warn",
      {
        alphabetize: {
          order: "asc"
        },
        groups: [
          ["builtin", "external"],
          ["parent", "internal"],
          ["sibling", "index"],
          ["type", "object"]
        ],
        "newlines-between": "always"
      }
    ]
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json"
  }
};
