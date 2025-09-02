module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  plugins: ["smells", "filenames", "import", "eslint-plugin-prettier"],
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
    PRODUCTION_BUILD: "readonly",
    DEV_TOOLS: "readonly",
    OPEN_DEV_TOOLS: "readonly",
    VUE_APP_VERSION: "readonly",
    NodeJS: true,
    STAGE_MODE: "readonly",
    JitsiMeetExternalAPI: "readonly",
    environmentPreset: "readonly"
  },
  extends: [
    "plugin:vue/base",
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    "plugin:vue/recommended",

    "prettier/prettier",
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
    semi: ["warn", "always"],
    yoda: ["warn", "never"],
    "eol-last": ["warn", "always"],
    "arrow-parens": ["warn", "as-needed"],
    "no-empty": "off",
    "no-async-promise-executor": "off",
    "import/no-duplicates": "error",
    "comma-dangle": ["warn", "never"],
    "vue/no-v-html": "off",
    "vue/no-v-model-argument": "off",
    "vue/require-prop-types": "off",
    "vue/require-default-prop": "off",
    "vue/this-in-template": "error",
    "vue/no-restricted-syntax": "error",
    "vue/v-on-function-call": "error",
    "vue/multi-word-component-names": "off",
    "vue/no-v-for-template-key": "off",
    "vue/html-self-closing": "off",
    "vue/object-curly-spacing": ["warn", "always"],
    "vue/max-attributes-per-line": ["warn", {
      "singleline": 3,
      "multiline": 1
    }],
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
    "no-unused-vars": process.env.NODE_ENV === "dev" ? "warn" : "error",
    "no-alert": "error",
    "no-var": "error",
    "object-literal-sort-keys": 0,
    "smells/no-switch": "error",
    "smells/no-complex-switch-case": "error",
    "smells/no-this-assign": "off",
    "no-unexpected-multiline": "error",
    "no-return-assign": ["error", "always"],
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/prefer-optional-chain": "warn",
    "object-curly-spacing": ["warn", "always"],
    "array-bracket-spacing": ["warn", "never"],
    "computed-property-spacing": ["warn", "never"],
    "keyword-spacing": ["warn", {
      "before": true,
      "after": true,
    }],
    "no-multi-spaces": "warn",
    "quotes": ["warn", "double", { "avoidEscape": true }],
    "no-multiple-empty-lines": ["warn", {max: 1}],
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
    ],
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto"
      }
    ],
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json"
  }
};

