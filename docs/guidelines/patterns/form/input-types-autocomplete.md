# 入力の種類と autocomplete を内容に合わせる

- 強さ: 必須
- 対象: 利用者自身の情報（氏名、メールアドレス、住所、電話番号など）を入力する欄。
- WCAG: 1.3.5 AA（2.1 で追加）

`type` と `autocomplete` を内容に合わせて付ける。郵便番号やカード番号のように数字だけでできていても数量ではない値には、`type="number"` を使わず、`inputmode="numeric"` を使う。

| 内容 | 指定の例 |
|---|---|
| 氏名 | `autocomplete="name"`、姓と名を分けるなら `family-name`・`given-name` |
| メールアドレス | `type="email" autocomplete="email"` |
| 電話番号 | `type="tel" autocomplete="tel"` |
| 郵便番号 | `type="text" inputmode="numeric" autocomplete="postal-code"` |
| 都道府県 | `autocomplete="address-level1"` |
| 市区町村 | `autocomplete="address-level2"` |
| ログインのパスワード | `type="password" autocomplete="current-password"` |
| 新しいパスワード | `type="password" autocomplete="new-password"` |

ふりがなに対応する `autocomplete` の値はないので、ふりがなの欄には付けない。

理由: 適切な `autocomplete` があれば、ブラウザの自動入力が使え、入力の手間と誤りが減る。`type="number"` は増減のための入力欄で、操作のはずみで値が意図せず増減することがあり、数字以外を入れたときに何が誤りかも示されない。

例外・代替: 利用者自身の情報ではない欄（他人の宛先、金額など）は、`autocomplete` を付けなくてよい。

- 構築: 入力欄を作るときに、上の表の値を確認する。
- レビュー: 利用者の情報を入れる欄に `autocomplete` があるか、数量でない値に `type="number"` を使っていないかを確認する。
