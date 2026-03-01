# HTMLルール

## 基本

- 🔴 HTML5 DOCTYPE: `<!DOCTYPE html>`
- 🔴 `<html lang="ja">`
- 🔴 `<meta charset="UTF-8">`
- 🔴 セマンティックなHTML要素を正しく使用する

## コードスタイル

- 🔴 インデント: スペース2つ
- 🔴 属性値: ダブルクォート `"` で囲む
- 🔴 Boolean属性: 値を省略 `checked` ✅ / `checked="checked"` ❌
- 🔴 閉じタグ: 省略しない
- 🔴 特殊文字: HTMLエンティティを使用 `&copy;`, `&lt;`, `&gt;`, `&amp;`
- 🟡 自己閉じタグのスラッシュ: どちらでも可
- 🟡 属性の記述順: class → id → data-* → その他 → aria-*, role
- 🟡 `type="text/javascript"` / `type="text/css"`: 省略してよい

## セマンティクス

- 🔴 `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` を適切に使用
- 🔴 `<main>` は1ページに1つ
- 🔴 `<h1>` は1ページに1つ
- 🔴 見出しレベル（h1-h6）を飛ばさない
- 🔴 装飾目的で要素を選ばない（`<b>` → `<strong>`, `<i>` → `<em>`）
- 🔴 アクションには `<button>`, 遷移には `<a>` を使用
- 🔴 `<a>` の `href` を省略しない
- 🔴 適切なセマンティック要素がない場合のみ `<div>` / `<span>` を使用
- 🔴 `target="_blank"` には `rel="noopener noreferrer"` を付与

## フォーム

- 🔴 `<form>` で囲む
- 🔴 すべての入力要素に `<label>` を関連付ける
- 🔴 適切な `type` 属性（email, tel, url 等）
- 🔴 `name` 属性を設定
- 🔴 必須項目に `required` 属性
- 🔴 `<button>` に `type` を明示（submit / button / reset）
- 🔴 関連する入力を `<fieldset>` + `<legend>` でグループ化
- 🔴 `<select>` にデフォルト選択肢 `<option value="">選択してください</option>`
- 🟡 `placeholder` は補足説明として使用（labelの代わりにしない）
- 🟡 適切な `autocomplete` 属性
- 🟡 `aria-describedby` でエラーメッセージを関連付け

## メタ情報・SEO

- 🔴 各ページに固有の `<title>`
- 🔴 各ページに `<meta name="description">`
- 🔴 `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- 🔴 ソーシャルシェア対象ページにOGP設定
- 🔴 重複コンテンツに `<link rel="canonical">`
- 🔴 ファビコン設定
- 🟡 構造化データ: JSON-LD形式
- 🟡 `<title>` 30文字前後, `<description>` 120文字前後
