# 開閉のきっかけは button 要素にし、aria-expanded で状態を伝える

- 強さ: 必須
- 対象: 内容を開閉するすべての部品。
- WCAG: 4.1.2 A

開閉のきっかけには `button` 要素を使い、`aria-expanded` で開いているかどうかを伝える。`aria-expanded` はボタンに付け、開閉する内容の側には付けない。`aria-controls` は付けてもよいが、必須ではない。

理由: `button` なら Enter と Space での開閉と、Tab での到達が最初からそろう。`a href="#"` や見出しにクリック処理を付けると、キー操作が足りないうえ、リンクや見出しとして誤って伝わる。

例外・代替: `details` と `summary` で作る場合は、ブラウザが状態を伝えるので、`button` と `aria-expanded` は不要。

- 構築: 初期状態の `aria-expanded` を HTML に書き、閉じている内容には `hidden` を付けておく。
- レビュー: ボタンの `aria-expanded` が開閉に合わせて切り替わるか、内容の側に付いていないかを確かめる。

## サンプル: よくある質問の開閉

```html
<button type="button" aria-expanded="false" aria-controls="faq-shipping">
  送料はいくらですか
</button>
<div id="faq-shipping" hidden>
  <p>全国一律 500 円です。</p>
</div>
```
