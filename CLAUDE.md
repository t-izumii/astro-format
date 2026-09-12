# CLAUDE.md

このリポジトリで作業する際の指針。詳細な背景は `README.md` を参照。

## 概要

Astro v7 + **Preact**（React ではない）の静的サイト。`base: "/"`、CSS は単一バンドル（`cssCodeSplit: false`）。

## コマンド

- `npm run dev` … 開発サーバー（`http://localhost:4321/`）
- `npm run build` … `clean && astro build && format:dist`
- `npm run lint:js` / `lint:css` / `lint:html` … （`:fix` で自動修正）
- `npm run format` / `format:check` … Prettier

コミット時は Husky + lint-staged が `eslint --fix` / `stylelint --fix` / `prettier --write` を自動実行する。

## コンポーネント設計と配置

- `src/pages/` の責務はルーティングだけとし、部品・スタイル・挙動は置かない。ルートファイルはレイアウト・ページ部品を呼び出し、ページメタ情報を指定する。
- 共通 UI は `src/components/ui/`、ページ固有は `src/components/pages/{ページ名}/` に置く。所属はディレクトリで表し、ファイル名にページ名を重ねない。
- 関連ファイルがある部品はディレクトリにまとめる。構造の `index.tsx`、スタイル、`{ComponentName}.client.ts`、固有の `spec.md`・テストを隣接させる。1 ファイルで完結するものは単独でよい。
- 迷ったら利用するページの部品ディレクトリ内に隣接させる。実際に別ページでも同じ責務で必要になってから共通へ移す。実ページ未使用の商品カード例は `src/dev/_components/productCard/` に置く。
- 内容は Preact の `children`、Astro の slot で渡す。ラベル・アイコンの有無・footer の有無を見た目制御の props にしない。
- 色・寸法・間隔は `class` / `style` と公開 CSS カスタムプロパティで調整する。公開変数には `--icon-size` のように部品名を付け、CSS の `var()` に既定値を持たせる。
- 内容に応じたスタイルは `:where(:has(...))` 等で部品側が判断する。利用側のクラス一つで上書きできる詳細度に保つ。任意の枠の生成は children / slot の有無で判定する。
- props は標準属性・データ・振る舞い・children で表せない構造に使う。Button と Link のように役割が異なるものを prop で切り替えない。Grid / Container は div の薄い拡張とし、別の要素には `o-grid` / `o-container` クラスを直接使う。
- ネイティブ属性の型を継承し、`class` / `className`、`style`、`aria-*`、`data-*` を DOM に渡す。部品固有の制御 props は DOM に流さない。
- JavaScript の接続には kebab-case の `data-*` 属性を使う。初期化登録・DOM 検索・出力側を同時に更新する。`data-modal-target` / `data-scroll-to` のような設定属性が目印を兼ねる場合は重複したフックを追加しない。状態クラスや外部ライブラリの必須クラスとは区別する。
- **構造と挙動の責任は分け、配置は隣接させる**。UI の挙動は各部品の `.client.ts`、ページを横断する実行基盤は `src/scripts/`。挙動は `Component` を継承し、`src/scripts/index.ts` の `PAGE_COMPONENTS` に登録する。`.client.ts` という名前だけでは実行されない。
- 挙動クラスは `constructor(elTarget, options)` / `_setEventListeners()` / `protected override _onDestroy()` の形に揃える。購読は必ず基底経由にする（いずれも `destroy` で自動解除される）: DOM リスナーは `_addEL`、毎フレーム処理は `_addRAF`（`Ticker`）、イベントバスは **`_addEE`**（`EventEmitter.on` を直接呼ばない）。
- **`destroy()` はオーバーライドしない。固有の後始末は `_onDestroy()` に書く**（テンプレートメソッド）。二重呼び出しのガードと呼び出し順は基底が持つので、サブクラス側にガードも `super` 呼び出しも要らない。SPA 遷移では同一インスタンスに destroy が重ねて走り得るため、ガードをサブクラスに書かせる形にしない。
- コンポーネント間通知は `src/scripts/utils/EventEmitter.ts`。イベント名と payload 型は `src/scripts/constants/events.ts` の `Events` / `TEventPayloads` に追加する。
- **毎フレームのイベントをバスに流さない**。rAF は `src/scripts/utils/Ticker.ts` が単独で持ち、コンポーネントからは `_addRAF` で購読する。
- `emit` は `queueMicrotask` 越しに配信する。**emit した直後に同じ同期ブロックで `on` した購読者にも届く**（`AssetProgress.init()` が計測対象 0 件のときコンストラクタ内から同期 emit し、その 2 行下で `on` しているのが実例）。同期配信に変えるとここが黙って落ちる。

## 必ず守るルール（過去にハマった点）

### Preact / TSX

- **JSX を書くファイルは必ず `.tsx`**（`.ts` だと JSX をパースできずエラー）。
- 子要素の型は **`ComponentChildren`（`preact`）**。`React.ReactNode` は使わない。複数子を扱うときは `toChildArray`。
- **Astro テンプレートから Preact コンポーネントへ children を渡すと 1 スロット扱いになる**。`toChildArray` で要素ごとに分割したい場合は、Preact（`.tsx`）側から discrete な子として渡すこと（例: プレビューは `.tsx` デモを経由）。

### スタイル（SCSS / ITCSS）

- `@/styles/_abstracts` は `astro.config.mjs` の `additionalData` で**全 scss に自動 injection 済み**。各ファイルで `@use "@/styles/abstracts"` を重複させない。
- コンポーネント scss は各ディレクトリに置き、`src/components/ui/_index.scss` 等で `@forward "./xxx/";` 集約する。
- クラス接頭辞: ui=`c-` / 業務部品=`f-` / pages=`p-`。BEM 命名。
- パスエイリアス `@` → `src`。

### ビルドパイプライン（インテグレーション）

- 後処理は **`integrations/` の Astro インテグレーション**（`astro:build:done`）で行う。**npm の build スクリプトに後処理を足さない**（二重処理になる）。
  - `cleanup-scripts.mjs` … チャンクを単一 `assets/scripts/script.js` に集約。
  - `image-optimize.mjs` … sharp で画像最適化。**APNG は `acTL` 検出で素通し**（sharp が APNG を潰すため再エンコードしない）。
- 画像最適化は imageOptimize が担当。別の画像圧縮処理を併用して APNG を静止画化しない。
- **dev 専用ページ・プレビューは `src/pages` の外（`src/dev/`）に置く**。`cssCodeSplit: false` のため、`src/pages` に置くと本番 CSS バンドルを汚染する。`/components` は `astro.config.mjs` の `devComponentsPreview` が dev 時のみ inject する。

### Lint

- `.astro` の Prettier 整形には `prettier-plugin-astro` が必要（`.prettierrc` 設定済み）。
- markuplint は `<img>` に `width` / `height` を必須にする。
- Prettier はダブルクォート（`singleQuote: false`）。

### Splide（スライド）

- `type`（slide/loop）は **breakpoints で変更不可**（mount 時固定）。`BreakpointOptions` 型にも入れない。SP だけ loop にしたい等はベース `type` を切り替える。
- 「はみ出した時だけカルーセル」は `overflowOnly`（`overflow` イベントで `arrows`/`pagination`/`drag`/`clones` をトグル）。

## 作業の進め方

- 変更後は IDE 診断で型エラーを確認する（`.astro` 同士の import エラーは再インデックスで消える一時表示のことが多い）。
- LLM/AI 関連の実装方針を変える場合や外部送信を伴う操作は、事前に確認する。
