# カルーセル全体に名前を付け、何枚目のスライドかを伝える

- 強さ: 推奨
- 対象: すべてのカルーセル。

カルーセルの外側の要素を `section` にするか `role="group"` を付け、`aria-label` か `aria-labelledby` で「お知らせ」「導入事例」のように名前を付ける。`aria-roledescription="カルーセル"` を足すと、種類も伝わる。それぞれのスライドには `role="group"` と `aria-label="3枚中1枚目"` を付ける。

理由: スクリーンリーダーの利用者には、スライドが横に並んでいることも、全部で何枚あるかも見えない。名前と枚数がないと、前後のボタンが何を切り替えるのか、どこまで進んだのかが分からない。

例外・代替: スライドをリストで組んでいて、`ul` と `li` の役割が残っている場合は、リストの件数と位置が読み上げられるので、スライドごとの `aria-label` は省いてよい。

- 構築: 自動で切り替わる間は、切り替えを読み上げさせない。スライドの入れ物に `aria-live` を付けるなら、自動で切り替わる間は `off` にし、止まっている間だけ `polite` にする。
- レビュー: スクリーンリーダーでカルーセルに入り、名前と、何枚中の何枚目かが読まれるかを確かめる。

## サンプル

```html
<section aria-roledescription="カルーセル" aria-label="お知らせ">
  <div class="carousel-slides">
    <div role="group" aria-roledescription="スライド" aria-label="3枚中1枚目">…</div>
    <div role="group" aria-roledescription="スライド" aria-label="3枚中2枚目" inert>…</div>
    <div role="group" aria-roledescription="スライド" aria-label="3枚中3枚目" inert>…</div>
  </div>
</section>
```
