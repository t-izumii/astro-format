# iframe には、中身を表す title を付ける

- 強さ: 必須
- 対象: 地図、動画、フォーム、SNS の埋め込みなど、`iframe` で読み込む内容。
- WCAG: 4.1.2 A

`iframe` に `title` 属性を付け、「会社所在地の地図」「サービス紹介の動画」のように、中身が何かを書く。同じページに複数の `iframe` がある場合は、区別できる文字にする。

理由: スクリーンリーダーは `iframe` に着くと `title` を読み上げる。`title` がないと、「フレーム」とだけ読まれるか、読み込んだファイルの URL が読まれ、中に入るかどうかを利用者が判断できない。

例外・代替: 計測や広告のタグのように、利用者に見せる内容がない `iframe` は、`title` を付けずに `hidden` 属性か `display: none` で隠す。

- 構築: 外部サービスが発行した埋め込みコードは、`title` がないか、英語の既定値のままのことが多い。貼り付けたあとに書き直す。
- レビュー: `iframe` を検索し、`title` があるか、中身を表しているかを確認する。

## サンプル

```html
<!-- 問題例: 中身が分からない -->
<iframe src="https://www.google.com/maps/embed?…"></iframe>

<!-- 改善例 -->
<iframe src="https://www.google.com/maps/embed?…" title="本社所在地の地図"></iframe>
```
