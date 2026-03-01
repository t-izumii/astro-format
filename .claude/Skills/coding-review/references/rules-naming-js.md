---
created: 2026-03-01T15:36
updated: 2026-03-01T15:40
---
# JavaScript命名規則

## 基本

- 🔴 変数名・関数名: キャメルケース `userName`, `getUserData()`
- 🔴 クラス: パスカルケース `UserProfile`, `DataValidator`
- 🔴 定数: UPPER_SNAKE_CASE `MAX_COUNT`, `API_ENDPOINT`

## 変数

- 🔴 一般変数: 名詞または名詞句 `userName`, `itemCount`
- 🔴 Boolean: `is`, `has`, `can`, `should` プレフィックス `isVisible`, `hasData`
- 🟡 配列: 複数形 `users`, `items`
- 🟡 オブジェクト: 単数形 `user`, `config`

## 関数

- 🔴 動詞または動詞句で開始: `getUser()`, `validateEmail()`
- 🔴 Booleanを返す関数: `is/has/can/should` で開始 `isValid()`, `hasPermission()`
- 🟡 イベントハンドラ: `handle` または `on` で開始 `handleClick()`, `onLoad()`

### よく使う動詞

get / set / fetch / create / update / delete / find / validate / calculate / render / handle

## DOM要素

- 🟡 `$` プレフィックスまたは `Element` サフィックス
  - `$header`, `$navItems`
  - `headerElement`, `navItemElements`

## モジュール・ファイル名

- 🔴 キャメルケースまたはケバブケース: `userService.js` or `user-service.js`
- ❌ パスカルケース `UserService.js` / スネークケース `user_service.js`

## クラス（TypeScript）

- 🔴 プライベートフィールド・メソッドには `private` キーワードを使用する
- 🔴 `_` プレフィックスを付けない（`private` で非公開は表現済みのため冗長）
- 例外: getter/setter のバッキングフィールドで同名を避ける必要がある場合は `_` を許可

```typescript
// ❌ private _name = 'Alice';
// ✅ private name = 'Alice';

// ✅ バッキングフィールドの例外
private _name: string;
get name() { return this._name; }
set name(v: string) { this._name = v; }
```

## 禁止事項

- 🔴 ローマ字表記
- 🔴 数字のみの命名
- 🔴 意味のない省略
- 🔴 予約語との重複
- 🔴 独自の略語（チーム外に通じないもの）
