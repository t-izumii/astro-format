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

## アーキテクチャ：見た目と挙動の分離

1 コンポーネント = **見た目** + **挙動** の 2 点セット。

- **見た目**: `src/components/`（Preact `.tsx` / Astro）。`js-` クラスと `data-*` 属性を出力する。
- **挙動**: `src/scripts/components/`。`src/scripts/base/Component.ts` を継承し、`src/scripts/index.ts` の `PAGE_COMPONENTS` に `{ selector: ".js-xxx", component: Xxx }` で登録する。
- 挙動クラスは `constructor(elTarget, options)` / `_setEventListeners()` / `protected override _onDestroy()` の形に揃える。購読は必ず基底経由にする（いずれも `destroy` で自動解除される）: DOM リスナーは `_addEL`、毎フレーム処理は `_addRAF`（`Ticker`）、イベントバスは **`_addEE`**（`EventEmitter.on` を直接呼ばない）。
- **`destroy()` はオーバーライドしない。固有の後始末は `_onDestroy()` に書く**（テンプレートメソッド）。二重呼び出しのガードと呼び出し順は基底が持つので、サブクラス側にガードも `super` 呼び出しも要らない。SPA 遷移では同一インスタンスに destroy が重ねて走り得るため、ガードをサブクラスに書かせる形にしない。
- コンポーネント間通知は `src/scripts/utils/EventEmitter.ts`。イベント名と payload 型は `src/scripts/constants/events.ts` の `Events` / `TEventPayloads` に追加する。
- **毎フレームのイベントをバスに流さない**（`Ticker` が rAF を単独で持つ）。`EventEmitter.ts` に残る `TICK` への言及は前案件の名残で、このリポジトリには存在しない。
- `emit` は `queueMicrotask` 越しに配信する。**emit した直後に同じ同期ブロックで `on` した購読者にも届く**（`AssetProgress.init()` が計測対象 0 件のときコンストラクタ内から同期 emit し、その 2 行下で `on` しているのが実例）。同期配信に変えるとここが黙って落ちる。

## 必ず守るルール（過去にハマった点）

### Preact / TSX

- **JSX を書くファイルは必ず `.tsx`**（`.ts` だと JSX をパースできずエラー）。
- 子要素の型は **`ComponentChildren`（`preact`）**。`React.ReactNode` は使わない。複数子を扱うときは `toChildArray`。
- **Astro テンプレートから Preact コンポーネントへ children を渡すと 1 スロット扱いになる**。`toChildArray` で要素ごとに分割したい場合は、Preact（`.tsx`）側から discrete な子として渡すこと（例: プレビューは `.tsx` デモを経由）。

### スタイル（SCSS / ITCSS）

- `@/styles/_abstracts` は `astro.config.mjs` の `additionalData` で**全 scss に自動 injection 済み**。各ファイルで `@use "@/styles/abstracts"` を重複させない。
- コンポーネント scss は各ディレクトリに置き、`src/components/ui/_index.scss` 等で `@forward "./xxx/";` 集約する。
- クラス接頭辞: ui=`c-` / features=`f-` / pages=`p-`。BEM 命名。
- パスエイリアス `@` → `src`。

### ビルドパイプライン（インテグレーション）

- 後処理は **`integrations/` の Astro インテグレーション**（`astro:build:done`）で行う。**npm の build スクリプトに後処理を足さない**（二重処理になる）。
  - `cleanup-scripts.mjs` … チャンクを単一 `assets/scripts/script.js` に集約。`compress` の JS minify より後ろに置く。
  - `image-optimize.mjs` … sharp で画像最適化。**APNG は `acTL` 検出で素通し**（sharp が APNG を潰すため再エンコードしない）。
- `astro-compress` の **`Image` は必ず `false`**（APNG 破壊回避）。画像最適化は imageOptimize が担当。
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
