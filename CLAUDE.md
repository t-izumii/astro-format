# CLAUDE.md

このリポジトリで作業するときの指針。背景と詳細はルートの `README.md`、部品の使い方は各部品の `README.md` を参照。

## 概要

- Astro v7 + **Preact**（React ではない）の静的サイト。CSS は単一バンドル（`cssCodeSplit: false`）。
- 型は `npm run typecheck` で確認する（`astro build` は型を検査しない）。IDE 診断に出る `.astro` 同士の import エラーは、再インデックスで消える一時表示のことが多い。
- コミット時は lint-staged が ESLint / Stylelint / Prettier を自動で実行する。
- LLM / AI 関連の実装方針を変える場合や、外部送信を伴う操作は事前に確認する。

## 配置

- `src/pages/` はルーティングだけ。レイアウトとページ部品を呼び出し、ページメタ情報を指定する。
- 共通 UI は `src/components/ui/`、ページ固有は `src/components/pages/{ページ名}/`。迷ったら使うページの下に置き、実際に別ページでも必要になってから共通へ移す。ファイル名にページ名を重ねない。
- 部品の関連ファイル（`index.tsx`、スタイル、`{Name}.client.ts`、`README.md`、テスト）は同じディレクトリに置く。部品の使い方と公開変数は部品の `README.md` に書き、ルートの README には書かない。
- dev 専用のページは `src/dev/` に置く（`src/pages` に置くと本番の CSS バンドルに混ざる）。`/components` は `devComponentsPreview` が dev 時だけ追加する。

## 部品の作り方

- 内容は `children`（Astro では slot）で渡す。ラベル・アイコン・footer の有無を見た目用の props にしない。任意の枠は children / slot の有無で出し分ける。
- props は標準属性・children・CSS で表せないデータや振る舞いに使う。Button と Link のように役割が違うものを prop で切り替えない。Grid / Container は div の薄い拡張で、別の要素には `o-grid` / `o-container` クラスを直接付ける。
- `interface Props` は対応する Preact の HTML 属性型（`import type { ButtonHTMLAttributes } from "preact"`）を継承し、children と固有の入力だけを書く。標準属性は `...rest` で DOM に渡す。`JSX.*Attributes`、`Omit`、独自の共通 props 型は使わない。props が不要な部品に空の定義を作らない。
- `...rest` を受ける部品は **`class: _class, className: _className` を分割代入して捨て**、内部クラスは `className=` で書く（preact-render-to-string は `class` があると `className` を捨てる。ルートの `class=` は markuplint に弾かれる）。固有の制御 props も分割代入し、DOM に流さない。
- JSX を書くファイルは `.tsx`。子の型は `ComponentChildren`（`React.ReactNode` は使わない）、子を分けるときは `toChildArray`。
- Astro テンプレートから Preact 部品へ渡した children は 1 つの子になる。要素ごとに分けたいときは `.tsx` 側から渡す（例: カタログは `.tsx` のデモを経由する）。

## スタイル

- 部品の表示調整は公開変数 `--{部品名}-{名前}` だけで行う。部品ルートで `--_{部品名}-{名前}: var(--{部品名}-{名前}, 既定値)` に解決し、宣言は内部変数を参照する。`--gap` のような汎用名は使わない。
- 値は `style` 属性で渡さず、部品を包むページ側の要素のクラスに CSS で指定して継承させる（中の同じ部品すべてに効く）。部品に追加クラスは渡さない。
- 内容や状態に応じたセレクタは `:where()` で包み、クラス 1 つ分の詳細度に保つ（例: `.c-x:where(:has(> img))`）。
- `styles/style.scss` が `@layer generic, base, vendor, objects, components, pages, trumps;` の各レイヤーへ `meta.load-css()` で読み込む。外部ライブラリの CSS は `vendor` に置き、詳細度を上げて対抗しない。`.astro` の `<style>` はレイヤーの外になり全レイヤーに勝つため、本番では使わない（`src/dev` は例外）。`!important` は使わない。
- `additionalData` の abstracts はエントリーにしか注入されない。変数や mixin を使う部品・base の scss は、先頭に `@use "@/styles/abstracts" as *;` を書く。
- 部品の scss は `components/ui/_index.scss` などで `@forward "./xxx/";` して集約する。接頭辞は ui=`c-`、object=`o-`、layout=`l-`、業務部品=`f-`、pages=`p-`（BEM）。`@` は `src` の別名。
- 書体は `base/_root.scss` の `--font-family-base` を `body` から継承する。部品で `font-family` を指定しない。この変数のフォント名は引用符で囲む（stylelint が小文字に直すと、Chrome が `BlinkMacSystemFont` を認識しない）。

## スクリプト

- JavaScript の接続には kebab-case の `data-*` 属性を使い、初期化登録・DOM 検索・出力側を同時に直す。`data-modal-target` のように設定属性が目印を兼ねるときは、フックを重ねない。
- 挙動は `Component` を継承して部品の `.client.ts` に書き、`src/scripts/index.ts` の `PAGE_COMPONENTS` に登録する（ファイル名だけでは実行されない）。ページ横断の基盤は `src/scripts/` に置く。
- 形は `constructor(elTarget, options)` / `_setEventListeners()` / `protected override _onDestroy()` にそろえる。購読は基底経由で行い（DOM は `_addEL`、毎フレームは `_addRAF`、イベントバスは `_addEE`。`EventEmitter.on` を直接呼ばない）、destroy 時に自動で解除させる。
- **`destroy()` はオーバーライドしない**。後始末は `_onDestroy()` に書く。二重呼び出しのガードは基底が持つ（SPA 遷移で destroy が重なり得る）。
- イベント名と payload 型は `src/scripts/constants/events.ts` の `Events` / `TEventPayloads` に足す。毎フレームの処理はバスに流さず、`Ticker` を `_addRAF` で購読する。
- `emit` は `queueMicrotask` で配信するため、emit 直後に同じ同期ブロックで `on` した購読者にも届く（`AssetProgress.init()` がこれに依存）。同期配信に変えない。
- Splide の `type`（slide / loop）は breakpoints で変えられない（mount 時に固定。`BreakpointOptions` にも入れない）。SP だけ loop にするときはベースの `type` を切り替える。はみ出したときだけカルーセルにするには `overflowOnly` を使う。

## ビルド

- 出力はファイル納品にも使うため、JS は `assets/scripts/script.js`、CSS は `assets/styles/style.css` の 1 ファイルずつにまとめ、HTML は整形して出す。
- 後処理は `integrations/` の Astro インテグレーション（`astro:build:done`）で行い、npm の build スクリプトに足さない（二重処理になる）。
  - `cleanup-scripts.mjs` … チャンクを `assets/scripts/script.js` に束ね直し、`assets/chunk/` を消す。エントリーは `src/layouts/script.astro` の `<script>` から作られるチャンク名で探すため、スクリプトの読み込みは `script.astro` 経由のままにする。
  - `image-optimize.mjs` … sharp で画像を最適化する。APNG は `acTL` を検出して再エンコードしない。ほかの画像圧縮を併用しない。
  - `format-html.mjs` … 出力 HTML を Prettier で整形する（`compressHTML: false`）。HTML を書き換えるインテグレーションより後に登録する。
- JS / CSS の minify は `vite.build.minify: "oxc"` / `cssMinify: "lightningcss"`。本番の CSS では先頭のレイヤー順の宣言が省かれるが、レイヤーのブロックが宣言と同じ順で並ぶため優先順位は変わらない。
- 対象ブラウザは Vite の既定（`baseline-widely-available`）。`vite.build.target` は案件で要件があるときだけ書く。ポリフィルは入らない。
