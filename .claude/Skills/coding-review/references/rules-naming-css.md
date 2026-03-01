---
created: 2026-03-01T15:06
updated: 2026-03-01T15:06
---
# CSS命名規則

## クラス名

- 🔴 接頭辞のみハイフン接続、それ以降はキャメルケース: `.c-headerNavigation`
- ❌ ケバブケース `.c-header-navigation` / アンダースコア `.c-card_title` / パスカルケース `.c-Button-Primary`

## プレフィックス体系

| プレフィックス | 役割 | 例 |
|---|---|---|
| `o-` | 🔴 レイアウト・構造パターン | `.o-container`, `.o-grid` |
| `c-` | 🔴 UIコンポーネント | `.c-button`, `.c-card` |
| `p-` | 🔴 ページ固有スタイル | `.p-top`, `.p-about` |
| `u-` | 🔴 ユーティリティ | `.u-hidden`, `.u-textCenter` |
| `is-` / `has-` | 🔴 状態クラス（JS動的付与） | `.is-active`, `.has-error` |
| `js-` | 🔴 JSフック（CSSスタイル禁止） | `.js-submitButton` |

## エレメント記法: `._`

- 🟡 コンポーネント内の要素は `._` で表現
- 🔴 必ず親セレクタとセットで使用。単体での `._title { }` は禁止
- 🔴 SCSSで `&__` によるエレメント名の合成を禁止（クラス名が分割され検索が困難になるため）

```css
/* ✅ */ .c-card ._title { }
/* ❌ */ ._title { color: red; }
```

```scss
/* ❌ */ .c-card { &__title { } }  /* "c-card__title" で検索不可 */
/* ✅ */ .c-card__title { }
```

## モディファイア記法: `.-`

- 🟡 バリエーションは `.-` で表現
- 🔴 必ずブロッククラスと併用

```html
<!-- ✅ --> <button class="c-button -primary">
<!-- ❌ --> <button class="-primary">
```

## SCSS変数・Mixin・関数

- 🟡 キャメルケース: `$colorPrimary`, `@mixin flexCenter`, `@function convertRemTo()`
- 🟡 グローバル変数にはカテゴリプレフィックス: `$colorPrimary`, `$spacingMedium`

## カスタムプロパティ

- 🔴 グローバル: `--` + ケバブケース（`:root`定義）: `--color-primary`
- 🔴 ローカル: `--_` + ケバブケース（コンポーネント内定義）: `--_bg-color`
- 🟡 カテゴリ分類: `--color-*`, `--font-*`, `--spacing-*`, `--z-index-*`, `--transition-*`

## IDセレクタ

- 🔴 スタイリング目的でIDセレクタは使用しない（JSフック・アンカー用途のみ）

## 命名の禁止事項

- 🔴 ローマ字表記（`oshirase`, `gaiyou`）
- 🔴 数字のみの命名（`data1`, `item2`）
- 🔴 意味のない省略（`tmp`, `val`, `flg`）
- 🔴 予約語との重複

## ファイル命名

- 🔴 小文字の英数字とハイフンのみ: `header-navigation.css`
- 🔴 禁止: 日本語、大文字、アンダースコア、スペース
- 🔴 連番は2桁ゼロパディング: `gallery-01.jpg`
