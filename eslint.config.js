import eslintPluginAstro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  // 除外するファイル・ディレクトリ
  {
    ignores: [
      "node_modules/",
      "dist/",
      ".astro/",
      "*.min.js",
      "scripts/cleanup-scripts.js",
    ],
  },
  // Astro推奨設定
  ...eslintPluginAstro.configs.recommended,
  // TS / TSX は対象を明示しないと「no matching configuration」で検査されない
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { "@typescript-eslint": tsPlugin },
  },
  {
    rules: {
      "no-unused-vars": "error",
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  // 共通ルールより後に置き、TS ファイルの no-unused-vars を上書きする
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // コア版は型シグネチャの引数名を未使用と誤検知するため TS 版に置き換える
      "no-unused-vars": "off",
      // ...rest と並べた分割代入は「DOM に渡さない props を取り除く」用途のため未使用扱いにしない
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true },
      ],
    },
  },
  // Prettierとの競合回避（最後に配置）
  eslintConfigPrettier,
];
