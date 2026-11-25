# 拡大を禁止する viewport の指定を書かない

- 強さ: 必須
- 対象: `<meta name=\"viewport\">` を書く場合。
- WCAG: 1.4.4 AA

`user-scalable=no` を書かない。`maximum-scale` で拡大の上限を下げない。

理由: 拡大を禁止すると、ロービジョンの利用者がピンチ操作で文字を大きくして読めなくなる。

例外・代替: なし。`width=device-width, initial-scale=1` だけで足りる。

- 構築: 入力欄にフォーカスしたときの自動拡大を防ぐ目的で拡大を禁止しない。入力欄の文字サイズを大きくして対処する。
- レビュー: `viewport` の `content` に `user-scalable` や `maximum-scale` がないかを確認する。
