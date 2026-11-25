# 開発環境について

Astro v7 + Preact の静的サイト制作環境。SCSS、GSAP、Splide を使用します。
[コンポーネント哲学](https://claude.ai/code/artifact/888399b6-1090-4073-9647-cf8296bb8095)を、この環境の Preact / SCSS / Component 基底クラスに合わせて適用しています。

## セットアップ

Node.js のバージョンは `.node-version` で指定しています。nodenv などのバージョン管理ツールで同じ版に切り替えてから、依存をインストールして開発サーバーを起動します。

```sh
npm install
npm run dev
```

そのほかのコマンドは「[コマンドとビルド](#コマンドとビルド)」を参照してください。

## サイト情報の設定

公開先の URL は `astro.config.mjs` の `site` に書きます。sitemap と、canonical / OGP の絶対 URL はこの値から作られます。サイト名・説明・OGP 画像・favicon は `src/data/meta.ts` の `siteMeta`、ページごとのタイトルと説明は `src/data/pages.ts` で設定します。

## 配置と責任

```text
src/
├── components/
│   ├── ui/
│   │   ├── button/        # index.tsx、index.scss、README.md
│   │   ├── icon/          # SVG は svg/ に追加
│   │   ├── link/          # 遷移用。Button とは別の部品
│   │   ├── marquee/       # 横に流れる帯
│   │   ├── modal/         # index.tsx、index.scss、README.md、Modal.client.ts、ModalOpen.client.ts
│   │   ├── picture/       # PC と SP で画像を切り替え
│   │   └── slide/         # カルーセル（Splide）
│   ├── object/            # container / grid
│   ├── layout/            # 共通ヘッダー・フッター
│   │   ├── header/        # index.tsx、index.scss
│   │   └── footer/        # index.tsx、index.scss
│   └── pages/
│       ├── top/           # トップの page.tsx、page.scss
│       └── about/         # About の page.tsx、page.scss
├── pages/                 # ルーティングのみ
│   ├── index.astro        # /
│   └── about.astro        # /about
├── layouts/              # HTML 文書・メタ情報・JS エントリー
├── scripts/              # 共通の実行基盤と初期化登録
├── styles/               # リセット・共通値・SCSS 集約
├── data/                 # サイト・ページメタ情報
└── dev/                  # 開発専用カタログ・デモ
```

`src/pages/` はルーティング専用です。ルートファイルではレイアウトとページ部品を呼び出し、ページメタ情報を指定します。ページ専用の部品は `src/components/pages/{ページ名}/` に置きます。関連するスタイル・挙動・説明（`README.md`）・テストも部品の隣に置き、必要になったものだけ追加します。実際に複数ページで共有するときに `components/ui/` などの共通の配置先へ移します。ファイル名に所属ページ名を重ねません。

ページの SCSS は部品の隣に置き、`components/pages/_index.scss` → `styles/pages/_index.scss` で集約します。共通部品のスタイルも `components/ui/_index.scss` などで集約します。共通 CSS は `layouts/Layout.astro` が読み込みます。`styles/style.scss` がカスケードレイヤーに振り分け、基礎・共通部品・ページ固有の順に優先させます（「[CSS の設計](#css-の設計)」）。

`src/dev` はビルド対象外です。開発専用カタログ（`/components`）とデモをここに置きます。

## 部品の作り方

各部品の使い方と公開変数は、部品のディレクトリにある `README.md` に書きます（例: `src/components/ui/picture/README.md`）。このルートの README には書きません。

中身は `children`（Astro では slot）、表示調整は CSS の公開変数、データや挙動は必要な props で渡します。`aria-*`、`data-*` などの標準属性は `...rest` で DOM に渡します。内部クラスは部品側で固定します。呼び出し側の文字やアイコンを部品の prop で組み立てません。

DOM を包む部品は、対応する Preact の HTML 属性型を継承します。各部品には children と固有の入力だけを明記し、標準属性を重複して列挙しません。Header・Footer など入力のない部品には props を定義しません。

```tsx
import type { ButtonHTMLAttributes, ComponentChildren } from "preact";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ComponentChildren;
}
```

属性型は `preact` から直接 import します。`JSX.ButtonHTMLAttributes` などの旧参照は非推奨のため使いません。部品固有の必須入力や動作設定は、各部品の `Props` に明記します。継承型は class / className も許容しますが、利用側から追加クラスを渡さず、公開 CSS 変数で調整する運用です。Layout のページメタ情報や開発用デモの固有入力は通常の interface で定義します。

## CSS の設計

SCSS の共通変数・mixin は `styles/settings` / `styles/tools`、部品固有のスタイルは部品の隣に置きます。`@` は `src` の別名です。クラス接頭辞は UI=`c-`、オブジェクト（Container / Grid）=`o-`、レイアウト（Header / Footer）=`l-`、ページ=`p-`、業務部品=`f-`。

### カスケードレイヤー

`styles/style.scss` は、CSS をカスケードレイヤー（`@layer`）に分けて読み込みます。表の下のレイヤーほど優先されます。レイヤーが違えば詳細度に関係なく下のレイヤーが勝つため、リセットや外部ライブラリの強いセレクタに部品が負けません。

| レイヤー     | 読み込むディレクトリ                   | 内容                                   |
| ------------ | -------------------------------------- | -------------------------------------- |
| `generic`    | `styles/generic/`                      | リセット（destyle.css）                |
| `base`       | `styles/base/`                         | 要素の基本スタイル・`:root`・keyframes |
| `vendor`     | `styles/vendor/`                       | 外部ライブラリの CSS（Splide）         |
| `objects`    | `components/object/`                   | Container / Grid                       |
| `components` | `components/ui/`、`components/layout/` | 共通 UI・ヘッダー・フッター            |
| `pages`      | `components/pages/`                    | ページ固有                             |
| `trumps`     | `styles/trumps/`                       | ユーティリティ（`.u-*`）               |

外部ライブラリの CSS は `styles/vendor/` に追加し、部品側で詳細度を上げて対抗しません。同じレイヤーの中は、これまでどおり詳細度と記述順で決まります。

レイヤーに入っていない CSS は、すべてのレイヤーに勝ちます。`.astro` の `<style>`（`is:global` を含む）はレイヤーの外になるため、本番の部品とページでは使わず、スタイルは SCSS に書きます（`src/dev` のデモは例外）。`!important` はレイヤーの優先順位を逆転させるため使いません。

### セレクタと変数

同じレイヤーの中で、追加する内容や状態のセレクタは `:where()` で包み、クラス一つ相当の詳細度を基本にします。例えば `.c-example:where(:has(> img))`。任意の footer の囲み自体を省く場合は、CSS の非表示で代用せず、渡された children / slot から部品内で判断します。Astro では `Astro.slots.has()` が使えます。

公開変数と内部変数を分け、部品ルートで次の形に解決します。公開名は `--{部品名}-{名前}`、内部名は `--_{部品名}-{名前}` とし、グローバルや親から継承される `--gap` などの汎用名との衝突を避けます。実際の CSS 宣言は内部変数を参照します。

```scss
.c-icon {
  --_icon-size: var(--icon-size, 1em);
  --_icon-width: var(--icon-width, var(--_icon-size));

  width: var(--_icon-width);
}
```

利用側は `style` 属性を使わず、部品を包むページ側の要素のクラスに CSS で公開変数を指定し、部品へ継承させます。内部変数は直接上書きしません。

```tsx
<span className="p-home__arrow">
  <Icon name="arrow" />
</span>
```

```scss
.p-home__arrow {
  --icon-size: 2rem;
}
```

指定はその要素の中にある同じ部品すべてに継承されます。部品名が付いているため、別の部品には影響しません。1 つだけ変えるときは、その部品だけを包みます。入れ子になった内側の部品で親の指定を使わない場合は、内側を包む要素で `--icon-size: initial` を指定して既定値に戻します。内部変数は各部品ルートで解決し直します。

寸法には CSS 単位を付け、`class` / `className` による部品への追加クラス指定は行いません。部品を包む要素など、ページ側が所有する通常の HTML 要素にはクラスを使えます。

書体は `styles/base/_root.scss` の `--font-family-base` で決め、`body` から継承させます。部品では `font-family` を指定しません。

## スクリプト基盤

JavaScript の接続先は `data-*` 属性に統一します。名前は kebab-case、目印だけの属性は空文字、対象や設定を表す属性には値を渡します。

| 属性                                | 用途                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| `data-size-observer`                | 要素の寸法を監視し、`--size-observer-width` / `--size-observer-height` へ反映 |
| `data-scroll-to="#target"`          | 指定した要素へスクロール                                                      |
| `data-in-view`                      | 画面内に入った要素へ状態クラスを付与                                          |
| `data-modal-id="sample"`            | モーダルの初期化と識別                                                        |
| `data-modal-target="sample"`        | 対応するモーダルを開く                                                        |
| `data-modal-close`                  | モーダル内の閉じるボタン                                                      |
| `data-carousel`                     | カルーセルを初期化                                                            |
| `data-marquee` / `data-marquee-set` | マーキーの初期化 / 内容のまとまり                                             |

```html
<button type="button" data-modal-target="sample">開く</button>
<a href="#details" data-scroll-to="#details" data-scroll-duration="0.3"
  >詳細へ</a
>
<div data-size-observer data-in-view>内容</div>
```

設定属性が対象の識別も兼ねられる場合、目印を重ねません。未使用だったモーダルのコンテナ用フックは撤去しています。状態を表す `is-*`、装飾用の `c-*`、Splide が必要とする `splide*` クラスは、それぞれの用途で使います。

`src/scripts/index.ts` がセレクタと Component クラスを登録・初期化します。UI 固有のクラスは各 UI ディレクトリにある `.client.ts`、ページ全体のサイズ監視・スクロールなどは `src/scripts/components/` にあります。

基底クラスは `src/scripts/base/Component.ts`。DOM 購読は `_addEL`、rAF は `_addRAF`、イベントバスは `_addEE`、開発 GUI は `_addGUI` を使います。購読は destroy で自動解除され、固有の後始末は `_onDestroy()` に書きます。`destroy()` 自体はオーバーライドしません。

EventEmitter は型付きイベントを microtask で配信します。毎フレームの処理は単一ループの Ticker へ購読し、イベントバスへ流しません。stats.js / lil-gui は開発時のみ有効です。詳細な注意点は [CLAUDE.md](CLAUDE.md) を参照してください。

## コマンドとビルド

| コマンド                                     | 内容                                               |
| -------------------------------------------- | -------------------------------------------------- |
| `npm install`                                | 依存をインストールし、Husky を有効化               |
| `npm run dev`                                | localhost:4321（`/components` に開発専用カタログ） |
| `npm run build`                              | dist を再生成（後処理はインテグレーションが実行）  |
| `npm run preview`                            | 本番出力のプレビュー                               |
| `npm run lint:js` / `lint:css` / `lint:html` | ESLint / Stylelint / markuplint                    |
| `npm run format` / `format:check`            | Prettier 整形 / 確認                               |
| `npm run typecheck`                          | `astro check` で .astro / .ts / .tsx の型を確認    |

Husky + lint-staged がステージ済みの対象を Lint・整形します。Astro 用 Prettier プラグインも設定済みです。

CSS は単一バンドル。JS は `integrations/cleanup-scripts.mjs` がビルド後に `assets/scripts/script.js` へ集約します。画像は `integrations/image-optimize.mjs` が sharp で最適化し、APNG は検出して素通し、アニメ GIF / WebP はフレームを保持します。画像サイズが増える場合は元を維持します。HTML は圧縮せず、`integrations/format-html.mjs` が出力後に Prettier で整形します。

対象ブラウザは Vite の既定値（`baseline-widely-available`）に従います。Vite 8.0.16 では Chrome / Edge 111、Firefox 114、Safari / iOS 16.4 以降です。この範囲は Vite のメジャー更新で上がることがあるため、更新時はリリースノートで確認してください。案件で対象ブラウザの要件がある場合は、`astro.config.mjs` の `vite.build.target` に指定します。

ビルド時に変換されるのは構文だけで、未対応の API は補われません。新しい CSS / JS の機能を使うときは、対象の範囲で動くかを確認してください。

## 以前の API からの移行

この変更では互換用の旧 props を残さず、リポジトリ内の利用箇所も同時に移行しています。別案件にコピーした部品は次の表で移行してください。

| 以前                               | 現在                                                   |
| ---------------------------------- | ------------------------------------------------------ |
| `scripts/components/ui/*.ts`       | 各 UI の `{ComponentName}.client.ts`                   |
| `Button label="保存"`              | `<Button>保存</Button>`                                |
| `Button href="/"`                  | `<Link href="/">トップ</Link>`                         |
| Icon の size / width / SP 用 props | `--icon-size` / `--icon-width` / `-sp` 変数            |
| Picture の img / sp                | `img` / `sp` props                                     |
| Picture の width / widthSp         | `--picture-width` / `--picture-width-sp`               |
| Container の maxWidth / padding    | `--container-max-width` / `--container-padding`        |
| Grid の repeat / gap など          | `--grid-repeat` / `--grid-gap` など（寸法は CSS 単位） |
| Grid / Container の as             | HTML 要素に `o-grid` / `o-container` を直接指定        |
| Modal の dataModalId               | 標準形式の `data-modal-id`                             |
