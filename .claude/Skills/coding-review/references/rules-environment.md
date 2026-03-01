# 制作環境・品質管理ルール

## エディタ・Linter設定

- 🔴 VS Code 標準
- 🔴 `.editorconfig` をプロジェクトルートに配置
- 🔴 ESLint（v9+ Flat Config）, Stylelint, Prettier, markuplint を導入
- 🔴 `eslint-config-prettier` で ESLint と Prettier の競合回避
- 🔴 Lint実行: 保存時 + コミット前（husky + lint-staged）+ CI

## Prettier設定

```json
{ "semi": true, "singleQuote": true, "trailingComma": "es5", "tabWidth": 2, "printWidth": 80 }
```

## npm scripts（必須）

- 🔴 `lint:js`, `lint:js:fix`, `lint:css`, `lint:css:fix`, `lint:html`, `format`, `format:check` を定義

## Node.js

- 🔴 `.node-version` または `.nvmrc` でバージョン統一
- 🔴 LTS バージョンを使用

## パフォーマンス（Core Web Vitals）

- 🔴 LCP: 2.5秒以内
- 🔴 INP: 200ms以内
- 🔴 CLS: 0.1以内

### LCP最適化
- 🔴 重要リソースを `<link rel="preload">` で事前読み込み
- 🔴 適切な画像フォーマット・サイズ
- 🟡 Critical CSSのインライン化

### INP最適化
- 🔴 50ms以上のタスクは分割
- 🟡 デバウンス・スロットルで頻繁なイベントを制御

### CLS最適化
- 🔴 画像に width/height または aspect-ratio を指定
- 🔴 `font-display: swap`
- 🔴 動的コンテンツ用のスペースを事前確保

## バリデーション

- 🔴 公開前にHTMLバリデーション実施
- 🔴 ESLint エラーなし
- 🔴 Stylelint エラーなし
- 🟡 アクセシビリティチェック（axe DevTools / Lighthouse）
- 🟡 Lighthouse スコア 90以上

## ブラウザテスト

- 🔴 Chrome, Firefox, Safari, Edge（最新版）
- 🔴 iOS Safari, Android Chrome（最新版）

## セキュリティ

- 🔴 ユーザー入力を `innerHTML` に渡さない（XSS対策）
- 🔴 HTTPS使用
- 🟡 CSRFトークンでフォーム保護
