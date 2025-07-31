/** @type {import('prettier').Config} */
const config = {
  endOfLine: "lf",
  embeddedLanguageFormatting: "auto",
  overrides: [
    {
      files: "*.{md,yml}",
      options: {
        tabWidth: 2,
      },
    },
    {
      files: ".env*",
      options: {
        parser: "sh",
      },
    },
  ],
  jsonRecursiveSort: true,
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-pkg",
    "prettier-plugin-sh",
    "prettier-plugin-sort-json",
    "prettier-plugin-tailwindcss", // Tailwind must go last: https://github.com/tailwindlabs/prettier-plugin-tailwindcss#compatibility-with-other-prettier-plugins
  ],
};

export default config;
