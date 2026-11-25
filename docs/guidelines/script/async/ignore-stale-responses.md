# 古い応答や不要になった応答を表示に反映しない

- 強さ: 必須
- 対象: 入力に合わせて検索するなど、前の処理が終わる前に次の処理が始まりうる場合。部品を閉じたり画面を離れたりしたあとに応答が届きうる場合。

新しい処理を始めるときは、前の処理を `AbortController` で中断する。部品を閉じるときや画面を離れるときも、実行中の処理を中断する。中断による失敗（`AbortError`）は、エラーの表示に使わない。

理由: 応答は送った順に返ってくるとは限らない。前の検索の応答が後から届くと、最新の入力と違う結果が表示される。閉じた部品へ応答を反映しようとすると、存在しない要素を操作して別のエラーになる。

例外・代替: 中断できない処理は、送るたびに番号を振り、最新の番号の応答だけを反映する。

- 構築: 中断された処理では、処理中の表示も更新しない（次の処理が処理中の表示を引き継ぐ）。
- レビュー: 通信を遅くした状態で入力を素早く変え、最後の入力に対応する結果だけが表示されるかを確かめる。

## サンプル: 入力に合わせた検索

前提: `showLoading`・`showResults`・`showEmpty`・`showError` は表示を切り替える関数として別に定義する。

```js
let controller;

async function search(keyword) {
  controller?.abort();
  controller = new AbortController();
  showLoading();

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const items = await response.json();
    items.length > 0 ? showResults(items) : showEmpty();
  } catch (error) {
    if (error.name === 'AbortError') return; // 新しい検索に置き換わった
    showError();
  }
}
```
