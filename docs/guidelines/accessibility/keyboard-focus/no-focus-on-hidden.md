# 見えていない要素にフォーカスを入れない

- 強さ: 必須
- 対象: 閉じたメニュー、画面外に移動したパネル、非表示のタブパネルなど、見えない状態の内容。
- WCAG: 2.4.3 A、2.4.7 AA

閉じている内容は、`hidden` 属性、`display: none`、`visibility: hidden`、`inert` 属性のどれかで、フォーカスの対象から外す。`transform` で画面外に出す、`opacity: 0` にする、`height: 0` にする、だけで隠さない。

理由: 見た目だけ隠した内容の中のリンクやボタンには Tab で到達できてしまい、フォーカスが見えない場所へ移って利用者が位置を見失う。

例外・代替: 開閉のアニメーションのために見た目だけで隠す時間がある場合は、閉じ終えた時点で上のどれかに切り替える。

- 構築: 閉じた状態のスタイルに `visibility: hidden` を含め、閉じるアニメーションの間だけ切り替えを遅らせる。
- レビュー: メニューやパネルを閉じた状態で Tab を押し、フォーカスが見えない場所に入らないかを確かめる。

## サンプル: スライドで閉じるメニュー

```css
/* 問題例: 画面外に出しただけで、中のリンクに Tab で到達できる */
.menu {
  transform: translateX(100%);
}

/* 改善例: 閉じ終えてから visibility を切り替える */
.menu {
  visibility: hidden;
  transform: translateX(100%);
  transition: transform 0.3s, visibility 0s 0.3s;
}
.menu.open {
  visibility: visible;
  transform: none;
  transition: transform 0.3s;
}
```
