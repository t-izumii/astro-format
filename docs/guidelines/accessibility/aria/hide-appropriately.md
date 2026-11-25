# 隠す方法を、誰から隠すかで使い分ける

- 強さ: 必須
- 対象: 内容を非表示にする場合。
- WCAG: 4.1.2 A

| 隠したい相手 | 方法 | 使う場面 |
|---|---|---|
| すべての利用者 | `hidden` 属性、`display: none` | 閉じた内容、使わない状態の内容 |
| 画面からだけ | 画面に表示しない CSS（下のサンプル） | アイコンだけのボタンの名前、補足の文字 |
| 支援技術からだけ | `aria-hidden="true"` | 文字と並んだ装飾のアイコン、同じ内容が別にある重複 |

`aria-hidden="true"` は、フォーカスを受け取る要素にも、その祖先にも付けない。`body` にも付けない。

理由: `aria-hidden="true"` の中にある操作要素は、Tab で到達できるのに何も読み上げられない。読ませたい文字を `display: none` で隠すと、支援技術からも消える。

例外・代替: なし。

- 構築: 画面に表示しない CSS は共通の指定として1か所に置き、使い回す。
- レビュー: `aria-hidden` を検索し、中に操作要素がないかを確認する。

## サンプル: 画面に表示しない CSS

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```
