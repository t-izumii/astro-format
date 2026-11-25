# 外部から来た文字列を、HTML として挿入しない

- 強さ: 必須
- 対象: 利用者の入力、URL のパラメーター、API や CMS から取得した文字列を画面に表示する場合。

外部から来た文字列は、`textContent` で文字として入れるか、要素を作って組み立てる。`innerHTML`、`outerHTML`、`insertAdjacentHTML`、`document.write` に、外部から来た文字列を渡さない。テンプレート文字列に埋め込んでから `innerHTML` に渡すことも同じ扱いにする。

理由: HTML として挿入すると、文字列の中の HTML が解釈される。`innerHTML` は `script` 要素を実行しないが、`<img src="x" onerror="...">` のような形で任意のスクリプトを実行できる。

例外・代替: CMS のリッチテキストなど、HTML のまま表示する必要がある場合は、信頼できるサニタイズの処理を通してから挿入する。

- 構築: 一覧などを組み立てるときは、`template` 要素を複製して `textContent` に値を入れる方法を検討する。
- レビュー: `innerHTML` などを検索し、渡している値に外部から来た文字列が含まれないかを確認する。

## サンプル: 検索語を表示する

```js
const keyword = new URLSearchParams(location.search).get('q') ?? '';

// 問題例: URL に HTML を入れられると、そのまま解釈される
message.innerHTML = `「${keyword}」の検索結果`;

// 改善例
message.textContent = `「${keyword}」の検索結果`;
```
