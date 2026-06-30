# 開発環境について

Astro v7 + Preact を使用した Web プロジェクトです。

## 技術スタック

- **Astro v7** - 静的サイトジェネレーター
- **Preact** - UI コンポーネント
- **Sass/SCSS** - スタイリング（ITCSS 構造）
- **GSAP** - アニメーション
- **Splide** - カルーセル / スライダー
- **TypeScript** - 型安全性
- **sharp** - ビルド後の画像最適化（自作インテグレーション）
- **astro-compress** - HTML / CSS / JS / SVG の圧縮
- **Husky + lint-staged** - コミット時の自動 Lint / フォーマット

## プロジェクト構造

```text
/
├── public/                    # 静的ファイル（画像など）
├── integrations/              # 自作 Astro インテグレーション
│   ├── cleanup-scripts.mjs    # スクリプトを単一 script.js にまとめる後処理
│   └── image-optimize.mjs     # dist 画像を sharp で最適化（APNG は素通し）
├── .husky/                    # Git フック（pre-commit で lint-staged 実行）
├── src/
│   ├── components/            # Preact / Astro コンポーネント（見た目）
│   │   ├── features/          # ドメイン固有コンポーネント
│   │   ├── layout/            # レイアウトコンポーネント
│   │   ├── object/            # レイアウトオブジェクト（container / grid）
│   │   ├── pages/             # ページ固有コンポーネント（top / about）
│   │   └── ui/                # 再利用可能な UI（button / icon / picture / modal / slide）
│   ├── data/                  # データファイル
│   ├── dev/                   # 開発専用（ビルド対象外）
│   │   ├── components.astro    # コンポーネントプレビュー（dev限定 /components）
│   │   └── _components/        # プレビューの各セクション
│   ├── layouts/               # レイアウトテンプレート
│   │   ├── Layout.astro       # ベースレイアウト
│   │   └── script.astro       # JS エントリーポイントコンポーネント
│   ├── pages/                 # ページ（ルーティング）
│   ├── scripts/               # クライアントサイドスクリプト（挙動）
│   │   ├── base/              # Component 基底クラス
│   │   ├── components/        # 挙動コンポーネント（common / layout / ui）
│   │   ├── constants/         # 定数（events / window-size）
│   │   ├── utils/             # EventEmitter など
│   │   └── index.ts           # コンポーネント登録・初期化のエントリ
│   └── styles/                # スタイル（ITCSS 構造）
│       ├── settings/          # 変数・設定
│       ├── tools/             # ミックスイン・関数
│       ├── generic/           # リセット・ノーマライズ
│       ├── base/              # 要素セレクタ
│       ├── objects/           # レイアウトパターン
│       ├── components/        # UI コンポーネント
│       ├── pages/             # ページ固有のスタイル
│       └── trumps/            # ユーティリティ・オーバーライド
└── package.json
```

## コマンド

プロジェクトのルートディレクトリで以下のコマンドを実行します：

| コマンド               | 説明                                           |
| :--------------------- | :--------------------------------------------- |
| `npm install`          | 依存関係のインストール（Husky フックも有効化） |
| `npm run dev`          | 開発サーバー起動（`localhost:4321/`）          |
| `npm run build`        | 本番用ビルド（`./dist/` に出力）               |
| `npm run preview`      | ビルドのプレビュー                             |
| `npm run lint:css`     | CSS の Lint（`:fix` で自動修正）               |
| `npm run lint:js`      | JS の Lint（`:fix` で自動修正）                |
| `npm run lint:html`    | HTML / Astro / TSX の Lint（markuplint）       |
| `npm run format`       | Prettier で全体整形                            |
| `npm run format:check` | Prettier の整形チェック                        |

> コミット時には Husky + lint-staged により、ステージしたファイルへ自動で `eslint --fix` / `stylelint --fix` / `prettier --write` が走ります（後述）。

## 開発

### パスエイリアス

`@` を使用して src ディレクトリを参照できます：

```typescript
import Component from "@/components/ui/button";
import "@/styles/style.scss";
```

### コンポーネント設計（見た目と挙動の分離）

- **見た目**: `src/components/`（Preact / Astro）。`data-*` 属性や `js-` クラスを出力する。
- **挙動**: `src/scripts/components/`。`Component` 基底クラスを継承し、`src/scripts/index.ts` で `js-` クラスのセレクタに紐付けて初期化する。
- コンポーネント間の通知は `src/scripts/utils/EventEmitter.ts`（`Events` 定数ベースの型付き pub/sub）で行う。

例: モーダルは `components/ui/modal`（見た目）＋ `scripts/components/ui/modal.ts`（開閉挙動）の2点セット。

### コンポーネントプレビュー

`src/dev/components.astro` に各 UI コンポーネントを並べたカタログがあります。

- **dev 限定**: `astro.config.mjs` の `devComponentsPreview` インテグレーションが、`command === "dev"` のときだけ `/components` ルートを注入します。
- `src/dev/` は `src/pages` の外にあるため **`astro build` の対象にならず、本番バンドル（特に単一化された CSS）を汚染しません**。
- アクセス: `npm run dev` → `http://localhost:4321/components`

### ビルド設定

- ベースパス: `/`
- アセット出力先: `dist/assets/`
  - スクリプト: `assets/scripts/`
  - スタイル: `assets/styles/`

#### JS のバンドル・出力について

Astro v7 ではスクリプトが `build.assets`（`assets/chunk/`）に複数ファイルとして出力されます。
v5 までの「`assets/scripts/script.js` 1ファイル出力」を維持するため、`integrations/cleanup-scripts.mjs`（`astro:build:done` フック）で後処理しています。

```
astro build
  └─ assets/chunk/ に出力
       ├── script.astro_astro_type_script_*.js  ← メインエントリー
       ├── client.*.js                           ← Preact ランタイム
       └── signals.module.*.js                   ← Preact signals

↓ cleanupScripts インテグレーション（astro:build:done）

  1. "script.astro_astro_type_script_*" を検出
  2. import している各チャンクをインライン展開
  3. assets/scripts/script.js として書き出す
  4. HTML のスクリプト参照パスを書き換え
  5. assets/chunk/ を削除
```

#### 圧縮（compress）について

`astro.config.mjs` の `astro-compress` で HTML / CSS / JS / SVG を制御します。

```js
// astro.config.mjs（例）
compress({ HTML: false, CSS: true, JavaScript: true, Image: false });
```

| 種類 | 既定 | 備考                                                              |
| :--- | :--- | :---------------------------------------------------------------- |
| HTML | OFF  | ビルド後に Prettier（`format:dist`）で整形するため OFF 推奨       |
| CSS  | 任意 | 必要に応じて `true`                                               |
| JS   | 任意 | 必要に応じて `true`                                               |
| SVG  | ON   | `astro-compress`                                                  |
| 画像 | OFF  | sharp が APNG を壊すため無効化。画像最適化は imageOptimize に分離 |

> **HTML を圧縮したい場合**: `build` スクリプトから `format:dist` を外してから `compress({ HTML: true })` を有効にしてください（Prettier に再整形されてしまうため）。

#### 画像最適化（imageOptimize）

`integrations/image-optimize.mjs`（`astro:build:done`）が dist 配下の画像を sharp で最適化します。

- 対象: `.png` / `.jpg` / `.jpeg` / `.webp` / `.gif`
- アニメ GIF / WebP はフレームを保持して再エンコード
- **APNG は `acTL` チャンクで検出して素通し**（sharp が APNG を静止画に潰すため）
- 圧縮後が元より大きい場合は元画像を維持

### Lint / フォーマット

#### コミット時の自動化（Husky + lint-staged）

`npm install` で `prepare` スクリプトが走り、`.husky/pre-commit`（`npx lint-staged`）が有効になります。コミット時、ステージしたファイルだけに以下が自動適用されます。

```jsonc
// package.json
"lint-staged": {
  "*.{js,mjs,ts,tsx,astro}": ["eslint --fix", "prettier --write"],
  "*.{css,scss}": ["stylelint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

エディタの format-on-save 設定に依存せず、全員のコミットで整形・Lint が保証されます。

> `.astro` の整形には **`prettier-plugin-astro`** が必要です（`.prettierrc` の `plugins` / `overrides` で設定済み）。

### アイコンコンポーネント

#### 使い方

```tsx
import Icon from "@/components/ui/icon";

// 基本（デフォルト 1em）
<Icon name="arrow" />

// サイズ指定（数値は rem 換算: 32 → 2rem）
<Icon name="close" size={32} />

// 幅・高さを個別指定
<Icon name="menu" width={40} height={20} />

// レスポンシブ（PC: 3rem, SP: 2rem）
<Icon name="search" size={48} spSize={32} />

// 文字列で単位指定（親の font-size に追従）
<Icon name="arrow" size="2em" />
```

#### アイコンの追加方法

1. SVG を `src/components/ui/icon/svg/` に配置（ファイル名がアイコン名）
2. `<Icon name="search" />` で使用

**注意点:** 数値指定は rem 換算（`24` → `1.5rem`）、文字列指定はそのまま。デフォルトは `1em`。

### モーダルコンポーネント

ネイティブ `<dialog>` ベース。開閉は `OPEN_MODAL` イベント + `data-modal-id` で制御し、`@fluejs/noscroll` でページスクロールをロックします。

```tsx
import Modal from "@/components/ui/modal";

<Modal dataModalId="sample">
  <p>任意のコンテンツ</p>
</Modal>;
```

```ts
// 開く（どこからでも）
EventEmitter.emit(Events.OPEN_MODAL, { id: "sample" });
```

閉じるのは ×ボタン / 背景クリック / ESC。

### スライド（カルーセル）コンポーネント

Splide ベース。`children` の各直下要素が 1 スライドになります。

```tsx
import Carousel from "@/components/ui/slide";

<Carousel options={{ type: "loop", autoWidth: true, gap: "1rem" }}>
  <img src="..." alt="" width={800} height={400} />
  <img src="..." alt="" width={800} height={400} />
</Carousel>;
```

- `overflowOnly`: はみ出す時だけカルーセル化（収まる時はただの横並び）
- `options.breakpoints`: `perPage` / `gap` 等をレスポンシブに変更（`type` は変更不可）

### スタイルガイド

- ITCSS（Inverted Triangle CSS）アーキテクチャを採用
- BEM 命名規則を推奨
- コンポーネント固有のスタイルは各コンポーネントディレクトリ内に配置し、`src/components/ui/_index.scss` 等で `@forward` 集約

#### CSS 接頭辞ルール

| 分類             | 接頭辞 | 説明                           |
| :--------------- | :----- | :----------------------------- |
| ui (Base/Atomic) | `c-`   | 再利用可能な UI コンポーネント |
| features         | `f-`   | ドメイン固有のコンポーネント   |
| pages            | `p-`   | ページ固有のコンポーネント     |
