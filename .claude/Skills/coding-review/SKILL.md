以下のガイドラインに基づいてコードをレビューしてください。

## レビュー手順

1. 対象のコード・ファイルを確認する
2. 該当するルールファイルを参照する
3. 違反箇所を列挙し、修正案を提示する

## ルールファイル

レビュー対象に応じて以下を参照:

- 全般・共通: @.claude/skills/coding-review/references/rules-general.md
- HTML: @.claude/skills/coding-review/references/rules-html.md
- CSS: @.claude/skills/coding-review/references/rules-css.md
- CSS命名: @.claude/skills/coding-review/references/rules-naming-css.md
- JavaScript: @.claude/skills/coding-review/references/rules-javascript.md
- JavaScript命名: @.claude/skills/coding-review/references/rules-naming-js.md
- メディア・SVG: @.claude/skills/coding-review/references/rules-media.md
- アクセシビリティ: @.claude/skills/coding-review/references/rules-accessibility.md
- 環境・品質管理: @.claude/skills/coding-review/references/rules-environment.md

## 出力フォーマット

```
## レビュー結果

### 🔴 必須（要修正）
- [ファイル名:行番号] 問題の説明
  → 修正案

### 🟡 推奨（改善提案）
- [ファイル名:行番号] 問題の説明
  → 修正案

### ✅ 問題なし
該当なし or 良い点のコメント
```

## 注意事項

- 🔴（必須）の違反は必ず指摘する
- 🟡（推奨）は状況に応じて判断する
- 既存コードとの一貫性を優先する（rules-general.md 参照）
- 指摘は具体的な修正案とセットで伝える
