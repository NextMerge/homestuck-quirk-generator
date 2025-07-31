// @ts-check

import globals from "globals";

import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  reactPlugin.configs.flat["recommended"],
  reactPlugin.configs.flat["jsx-runtime"],
  reactCompiler.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: { reactPlugin, "react-hooks": reactHooks },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      ...reactPlugin.configs.flat["recommended"]?.languageOptions,
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.config.js"],
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-console": "error",

      // types are better than interfaces as they get stripped out on transpile
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],

      // Either broken or misunderstood
      "react/prop-types": "off",

      // We don't need to display the name of the component
      "react/display-name": "off",

      // Makes @tanstack/react-form slightly more annoying to use
      "react/no-children-prop": "off",

      // Make all jsx attribute syntax consistent
      "react/jsx-curly-brace-presence": "error",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    ignores: [
      "node_modules/**",
      "public/**",
      "dist/**",
      ".gitignore",
      "prettier.config.js",
      "**/*.d.ts",
    ],
  },
);
