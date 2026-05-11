# 開発環境について

Astro v6 + Preactを使用したWebプロジェクトです。

## 技術スタック

- **Astro v6** - 静的サイトジェネレーター
- **Preact** - UIコンポーネント
- **Sass/SCSS** - スタイリング（ITCSS構造）
- **GSAP** - アニメーション
- **TypeScript** - 型安全性
- **astro-compress** - CSS・SVG・画像の圧縮

## プロジェクト構造

```text
/
├── public/                # 静的ファイル
├── scripts/
│   └── cleanup-scripts.js # ビルド後処理スクリプト
├── src/
│   ├── components/       # コンポーネント
│   │   ├── features/    # ドメイン固有コンポーネント
│   │   ├── layout/      # レイアウトコンポーネント
│   │   ├── pages/       # ページ固有コンポーネント
│   │   │   ├── about/
│   │   │   └── top/
│   │   └── ui/          # 再利用可能なUIコンポーネント
│   │       ├── icon/    # SVGアイコン管理
│   │       └── picture/
│   ├── data/            # データファイル
│   ├── layouts/         # レイアウトテンプレート
│   │   ├── Layout.astro # ベースレイアウト
│   │   └── script.astro # JSエントリーポイントコンポーネント
│   ├── pages/           # ページ（ルーティング）
│   ├── scripts/         # クライアントサイドスクリプト
│   │   ├── base/
│   │   ├── components/
│   │   ├── constants/
│   │   └── utils/
│   └── styles/          # スタイル（ITCSS構造）
│       ├── Settings/    # 変数・設定
│       ├── Tools/       # ミックスイン・関数
│       ├── Generic/     # リセット・ノーマライズ
│       ├── Base/        # 要素セレクタ
│       ├── Objects/     # レイアウトパターン
│       ├── Components/  # UIコンポーネント
│       ├── Pages/       # ページ固有のスタイル
│       └── Trumps/      # ユーティリティ・オーバーライド
└── package.json
```

## コマンド

プロジェクトのルートディレクトリで以下のコマンドを実行します：

| コマンド               | 説明                                 |
| :--------------------- | :----------------------------------- |
| `npm install`          | 依存関係のインストール               |
| `npm run dev`          | 開発サーバー起動（`localhost:4321`） |
| `npm run build`        | 本番用ビルド（`./dist/`に出力）      |
| `npm run preview`      | ビルドのプレビュー                   |
| `npm run lint:css`     | CSSのLint                            |
| `npm run lint:css:fix` | CSSのLint（自動修正）                |
| `npm run lint:js`      | JavaScriptのLint                     |
| `npm run lint:js:fix`  | JavaScriptのLint（自動修正）         |

## 開発

### パスエイリアス

`@` を使用してsrcディレクトリを参照できます：

```typescript
import Component from '@/components/ui/Component';
import '@/styles/main.scss';
```

### ビルド設定

- ベースパス: `/htdocs`
- アセット出力先: `dist/assets/`
  - スクリプト: `assets/scripts/`
  - スタイル: `assets/styles/`

#### JSのバンドル・出力について

Astro v6 ではスクリプトが `build.assets` に指定したディレクトリ（`assets/chunk/`）に複数ファイルとして出力される仕様になっています。

v5 までの動作（`assets/scripts/script.js` の1ファイル出力）を維持するため、ビルド後に `scripts/cleanup-scripts.js` で後処理を行っています。

```
astro build
  └─ assets/chunk/ に以下を出力
       ├── script.astro_astro_type_script_*.js  ← メインエントリー
       ├── client.*.js                           ← Preact ランタイム
       └── signals.module.*.js                   ← Preact signals

↓ npm run cleanup（cleanup-scripts.js）

  1. "script.astro_astro_type_script_*" を検出
  2. import している各チャンクをコードとしてインライン展開
  3. assets/scripts/script.js として書き出す
  4. index.html 等のスクリプト参照パスを書き換え
  5. assets/chunk/ を削除
```

#### JS・CSS の minify について

- **JS**: `astro-compress` の設定で圧縮可能
- **CSS**: `astro-compress` の設定で圧縮可能

`astro-compress` は CSS・SVG・画像の圧縮に使用しています。

```js
// astro.config.mjs
compress({ HTML: false, CSS: false, JavaScript: false });
// CSS圧縮は Vite の cssMinify: true で対応
```

### アイコンコンポーネント

#### 使い方

```tsx
import Icon from '@/components/ui/icon';

// 基本的な使い方
<Icon name="arrow" />  // デフォルト: 1em

// サイズ指定（数値）
<Icon name="close" size={32} />  // 2rem (32÷16)

// 幅・高さを個別指定
<Icon name="menu" width={40} height={20} />

// レスポンシブ対応
<Icon name="search" size={48} spSize={32} />  // PC: 3rem, SP: 2rem

// 文字列で単位指定も可能
<Icon name="arrow" size="2em" />  // 親要素のfont-sizeに追従
```

#### アイコンの追加方法

1. SVGファイルを `src/components/ui/icon/svg/` に配置
2. ファイル名がそのままアイコン名になる

```bash
# 例: search.svg を追加
src/components/ui/icon/svg/search.svg
```

3. コンポーネントで使用

```tsx
<Icon name="search" />
```

**注意点:**
- 数値指定の場合、自動的にrem換算される（`24` → `1.5rem`）
- 文字列指定の場合はそのまま適用される（`"2em"` → `2em`）
- デフォルトサイズは `1em`（親要素の `font-size` に追従）

### スタイルガイド

- ITCSS（Inverted Triangle CSS）アーキテクチャを採用
- BEM命名規則を推奨
- コンポーネント固有のスタイルは各コンポーネントディレクトリ内に配置

#### CSS接頭辞ルール

| 分類             | 接頭辞 | 説明                         |
| :--------------- | :----- | :--------------------------- |
| ui (Base/Atomic) | `c-`   | 再利用可能なUIコンポーネント |
| features         | `f-`   | ドメイン固有のコンポーネント |
| pages            | `p-`   | ページ固有のコンポーネント   |
