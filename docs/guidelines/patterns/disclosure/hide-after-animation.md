# 開閉のアニメーションは、閉じ終えたら内容を隠す

- 強さ: 必須
- 対象: 高さや位置を動かして開閉する部品。
- WCAG: 2.4.3 A

閉じた内容の扱いは、[キーボードとフォーカス](../../accessibility/keyboard-focus/)の「[見えていない要素にフォーカスを入れない](../../accessibility/keyboard-focus/no-focus-on-hidden.md)」に従う。開閉する部品で高さを動かす場合は、`grid-template-rows` を `0fr` と `1fr` の間で切り替え、`visibility` の切り替えをアニメーションの終わりまで遅らせる。

理由: 高さの値をアニメーションさせる方法はいくつかあるが、この組み合わせなら内容の高さを事前に知らなくても動かせ、閉じ終えた時点で内容がフォーカスの対象から外れる。

例外・代替: アニメーションがない開閉は、`hidden` 属性の切り替えだけでよい。

- 構築: 開閉の状態はスクリプトで1か所から切り替え、`aria-expanded` と見た目の状態が食い違わないようにする。
- レビュー: 閉じた状態で Tab を押し、閉じた内容の中に入らないかを確かめる。

## サンプル: 高さを動かして開閉する

前提: 開閉の処理で、ボタンの `aria-expanded` とパネルの `open` クラスを同時に切り替える。パネルの直下に内容を包む要素が1つある。

```css
.panel {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition: grid-template-rows 0.3s, visibility 0s 0.3s;
}
.panel > * {
  overflow: hidden;
}
.panel.open {
  grid-template-rows: 1fr;
  visibility: visible;
  transition: grid-template-rows 0.3s;
}
```
