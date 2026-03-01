# JavaScriptルール

## コードスタイル

- 🔴 ESLint + Prettier でコード品質を担保
- 🔴 ESLint v9以降: Flat Config（`eslint.config.js`）を使用
- 🔴 `const` 優先、再代入が必要な場合のみ `let`。`var` 禁止
- 🔴 セミコロン: ステートメント末尾に記述
- 🔴 文字列: シングルクォート `'`
- 🔴 インデント: スペース2つ
- 🔴 strict mode を有効にする（モジュールなら自動）
- 🟡 テンプレートリテラルは変数埋め込み時のみ使用
- 🟡 関数宣言（通常の関数）、アロー関数（コールバック）を使い分け
- 🟡 デフォルトパラメータを使用（`||` でのデフォルト値代入は避ける）
- 🟡 プロパティ短縮構文 `{ name, age }`
- 🟡 分割代入 `const { name, age } = user;`
- 🟡 スプレッド構文 `{ ...user, age: 26 }`
- 🟡 三項演算子（シンプルな条件）
- 🟡 Optional Chaining `user?.address?.street`
- 🟡 Nullish Coalescing `data.count ?? 0`（`||` だと0もfalsyで問題）

## 非同期処理

- 🔴 async/await を使用（Promise chain より推奨）
- 🔴 try-catch でエラーを適切にハンドリング

## モジュール

- 🔴 ES Modules（import/export）を使用
- 🟡 単一クラス/関数はデフォルトエクスポート

## DOM操作

- 🔴 JSフッククラス `js-` を使用してDOM取得（スタイル用クラスで取得しない）
- 🔴 `querySelector` / `querySelectorAll` で統一
- 🔴 `addEventListener` を使用（インラインイベントハンドラ禁止）
- 🔴 不要になったイベントリスナーは削除（メモリリーク防止）
- 🔴 スタイル変更はCSSクラスの付け外しで行う（`element.style` 直接操作を避ける）
- 🔴 ユーザー入力を `innerHTML` に渡さない（XSS対策。`textContent` を使用）
- 🟡 イベント委譲を活用（動的要素・多数要素）
- 🟡 DOM操作はまとめて実行（リフロー削減）

## 読み込み方法

- 🔴 外部スクリプトに `defer` 属性を使用
- 🔴 モジュール使用時は `type="module"` を指定
- 🔴 DOM操作は DOMContentLoaded 後に実行（defer使用時は不要）
- 🟡 依存関係のない独立スクリプトに `async`
- 🟡 動的インポート `import()` で必要時にモジュール読み込み
- 🟡 重要なスクリプトを `<link rel="preload">` で事前読み込み

## コメント

- 🟡 複雑な関数にはJSDocスタイルのコメント
- 🟡 「何をしているか」ではなく「なぜそうするのか」を記述
