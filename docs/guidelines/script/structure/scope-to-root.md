# 部品の処理は、部品の要素を起点に要素を取得する

- 強さ: 必須
- 対象: 1ページに複数置かれうる部品のスクリプト。

部品の要素をすべて取得し、1つずつ初期化する。部品の中の要素は、`document` からではなく、部品の要素を起点に取得する。

理由: `document.querySelector` はページで最初に見つかった要素しか返さないため、2つ目以降の部品が動かなかったり、別の部品の要素を操作したりする。

例外・代替: ページに1つしかないことが決まっている部品（サイト全体のヘッダーなど）は、`document` から取得してよい。

- 構築: 初期化の関数は部品の要素を引数で受け取り、その中だけを操作する。
- レビュー: 同じ部品を2つ置いたページで、それぞれが独立して動くかを確かめる。

## サンプル: 複数のアコーディオンを初期化する

前提: 部品の目印を `[data-accordion]` とする（目印の決め方は案件による）。

```js
// 問題例: 最初の部品しか動かない
const button = document.querySelector('[data-accordion] button');

// 改善例
for (const root of document.querySelectorAll('[data-accordion]')) {
  initAccordion(root);
}

function initAccordion(root) {
  const button = root.querySelector('button');
  // root の中だけを操作する
}
```
