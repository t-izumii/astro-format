import js from "@eslint/js";
import globals from "globals";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

// docs/guidelines のうち、構文で検出できるものを no-restricted-syntax で禁止する。
// 例外は eslint-disable-next-line に「-- 理由」を付けて残す
const guidelineSyntax = [
  {
    selector:
      "AssignmentExpression[left.property.name=/^(innerHTML|outerHTML)$/]",
    message:
      "外部の文字列を HTML として挿入しない（no-unsafe-html）。textContent か要素の組み立てを使う",
  },
  {
    selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
    message: "外部の文字列を HTML として挿入しない（no-unsafe-html）",
  },
  {
    selector:
      "CallExpression[callee.object.name='document'][callee.property.name=/^write(ln)?$/]",
    message: "document.write を使わない（no-unsafe-html）",
  },
  {
    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
    message: "外部の文字列を HTML として挿入しない（no-unsafe-html）",
  },
  {
    selector:
      "CallExpression[callee.property.name=/^(querySelector|querySelectorAll|closest|matches)$/] > Literal[value=/\\.[clopfu]-[a-z]/]",
    message:
      "見た目用のクラスで要素を取得しない（dedicated-dom-hooks）。data-* 属性を使う",
  },
  {
    selector:
      "CallExpression[callee.property.name=/^(querySelector|querySelectorAll|closest|matches)$/] > TemplateLiteral > TemplateElement[value.raw=/\\.[clopfu]-[a-z]/]",
    message:
      "見た目用のクラスで要素を取得しない（dedicated-dom-hooks）。data-* 属性を使う",
  },
  {
    selector: "CallExpression[callee.property.name='getElementsByClassName']",
    message:
      "見た目用のクラスで要素を取得しない（dedicated-dom-hooks）。data-* 属性を使う",
  },
  {
    selector: "AssignmentExpression[left.object.property.name='style']",
    message:
      "スクリプトで個々のスタイルを書き換えない（no-inline-style-from-js）。属性・クラスかカスタムプロパティを使う",
  },
  {
    selector:
      "CallExpression[callee.property.name='postMessage'][arguments.1.value='*']",
    message: "postMessage の送り先を * にしない（check-postmessage-origin）",
  },
];

// 部品の挙動では、購読を基底クラス経由にして destroy で解除させる（cleanup-on-remove）
const componentSyntax = [
  {
    selector: "CallExpression[callee.property.name='addEventListener']",
    message:
      "addEventListener を直接呼ばない。destroy で解除されるよう基底の _addEL を使う（cleanup-on-remove）",
  },
  {
    selector: "CallExpression[callee.name='setInterval']",
    message:
      "setInterval を直接使わない。毎フレームの処理は _addRAF、それ以外は _onDestroy で必ず解除する（cleanup-on-remove）",
  },
];

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
  // ESLint の推奨ルール。ブラウザと Node.js のグローバル変数を定義しないと
  // no-undef の誤検知や no-implied-eval の見逃しが起きる
  js.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  // Astro推奨設定
  ...eslintPluginAstro.configs.recommended,
  // .astro のフロントマターは TypeScript。ImageMetadata などの型を未定義と誤検知するため、
  // TS と同じく未定義の検出は astro check（型チェック）に任せる
  {
    files: ["**/*.astro"],
    rules: { "no-undef": "off" },
  },
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
  // TS では no-undef などを型チェックに任せる（typescript-eslint の推奨どおり）
  tsPlugin.configs["flat/eslint-recommended"],
  {
    rules: {
      "no-unused-vars": "error",
      // デバッグ用の出力を残さない。失敗の記録（warn / error）は残してよい（remove-dead-code）
      "no-console": ["error", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      // 文字列をコードとして実行しない（no-eval）
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      // javascript: の URL を書かない（validate-url-scheme の一部）
      "no-script-url": "error",
      "no-restricted-syntax": ["error", ...guidelineSyntax],
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
      // ! で null の可能性を消さず、存在を確かめてから使う（missing-element-safe）
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  // 部品の挙動。no-restricted-syntax は後の設定で置き換わるため、共通の禁止も並べ直す
  {
    files: ["src/components/**/*.client.ts", "src/scripts/components/**/*.ts"],
    rules: {
      "no-restricted-syntax": ["error", ...guidelineSyntax, ...componentSyntax],
    },
  },
  // Prettierとの競合回避（最後に配置）
  eslintConfigPrettier,
];
