# 閉じるボタンをダイアログの中に見える形で置く

- 強さ: 必須
- 対象: すべてのダイアログ。

ダイアログの中に、閉じる・キャンセルなどのボタンを見える形で置く。Esc と背景のクリックは補助の手段とし、それだけで閉じさせない。背景のクリックで閉じる場合は、ダイアログ要素自体へのクリックを判定して実装する。

理由: Esc を知らない利用者や、キーボードのない端末の利用者もいる。背景のクリックで閉じる `closedby="any"` 属性は、Chrome 134、Firefox 141 以降で使え、Safari はまだ対応していない。

例外・代替: なし。

- 構築: ボタンで閉じるだけなら、`<form method="dialog">` の中にボタンを置くと、スクリプトなしで閉じられ、押したボタンの `value` が `returnValue` に入る。
- レビュー: 閉じるボタンがタッチ端末でも押せる大きさで、名前が付いているかを確かめる。

## サンプル: 削除の確認ダイアログ

```html
<button type="button" id="delete-open">記事を削除</button>

<dialog id="delete-dialog" aria-labelledby="delete-dialog-title">
  <h2 id="delete-dialog-title">この記事を削除しますか</h2>
  <p>削除した記事は元に戻せません。</p>
  <form method="dialog">
    <button type="submit" value="cancel" autofocus>キャンセル</button>
    <button type="submit" value="delete">削除する</button>
  </form>
</dialog>
```

```js
const opener = document.querySelector('#delete-open');
const dialog = document.querySelector('#delete-dialog');

opener.addEventListener('click', () => {
  dialog.returnValue = ''; // Esc で閉じたときは値が設定されないので、開くたびに初期化する
  dialog.showModal();
});

dialog.addEventListener('close', () => {
  opener.focus();
  if (dialog.returnValue === 'delete') {
    deleteArticle(); // 削除の処理（別に定義）
  }
});
```
