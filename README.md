# 開発環境について

Astro v7 + Preact の静的サイト制作環境。SCSS、GSAP、Splide を使用します。
[コンポーネント哲学](https://claude.ai/code/artifact/888399b6-1090-4073-9647-cf8296bb8095)を、この環境の Preact / SCSS / Component 基底クラスに合わせて適用しています。

## 配置と責任

```text
src/
├── components/
│   ├── ui/
│   │   ├── button/        # index.tsx、index.scss
│   │   ├── link/          # 遷移用。Button とは別の部品
│   │   └── modal/         # index.tsx、index.scss、Modal.client.ts、ModalOpen.client.ts
│   ├── object/            # container / grid
│   ├── layout/            # 共通ヘッダー・フッター
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
└── dev/                  # 開発専用カタログ・業務部品の見本
```

`src/pages/` はルーティング専用です。ルートファイルではレイアウトとページ部品を呼び出し、ページメタ情報を指定します。ページ専用の部品は `src/components/pages/{ページ名}/` に置きます。関連するスタイル・挙動・仕様・テストも部品の隣に置き、必要になったものだけ追加します。実際に複数ページで共有するときに `components/ui/` などの共通の配置先へ移します。ファイル名に所属ページ名を重ねません。

ページの SCSS は部品の隣に置き、`components/pages/_index.scss` → `styles/pages/_index.scss` で集約します。共通部品のスタイルも `components/ui/_index.scss` などで集約します。共通 CSS は `layouts/Layout.astro` が読み込みます。基礎・共通部品・ページ固有の順に適用します。

`src/dev` はビルド対象外です。商品カードは未使用の業務部品の見本としてここに置き、実ページへ採用する際に利用先へ移します。

## 部品の使い方

中身は `children`（Astro では slot）、表示調整は CSS、データや挙動は必要な props で渡します。標準の `class` / `className`、`style`、`aria-*`、`data-*` を利用できます。呼び出し側の文字やアイコンを部品の prop で組み立てません。

### ボタンとリンク

```tsx
import Button from "@/components/ui/button";
import ActionLink from "@/components/ui/link";
import Icon from "@/components/ui/icon";

<Button type="submit" disabled={isSubmitting}>送信</Button>
<Button><Icon name="arrow" />次へ</Button>
<ActionLink href="/about/">私たちについて</ActionLink>
<Button style={{ "--button-padding": "0.75rem 2rem" }}>保存</Button>
```

Button は `button`（既定の type は `button`）、Link は `a` を描画します。Astro テンプレートでは HTML Lint の解析との衝突を避けるため、リンク部品を `ActionLink` として import します。イベントハンドラーを使う Preact 部品は Astro 側で適切な `client:*` 指定が必要です。既存の `.js-modalOpen` などは共通スクリプトが初期化するため hydration は不要です。

表示用変数は `--button-gap`、`--button-padding`、`--button-font-size`、`--button-color`、`--button-background`。Link には同じ用途の `--link-*` があります。

### アイコン

```tsx
<Icon name="arrow" />
<Icon name="arrow" style={{ "--icon-size": "2.5rem", "--icon-size-sp": "1.5rem" }} />
```

SVG は `components/ui/icon/svg/` へ追加します。既定サイズは親の文字サイズに従う `1em`。幅と高さを別々に指定する場合は `--icon-width` / `--icon-height`、SP 用はそれぞれ `-sp` を使います。装飾として既定で `aria-hidden="true"` を付けます。アイコンだけのボタンには Button 側の `aria-label` などで操作名を付けてください。

### 画像

```tsx
import Picture from "@/components/ui/picture";

<Picture style={{ "--picture-width": "400px" }}>
  <source
    srcSet="/assets/images/hero-sp.jpg"
    media="(width < 768px)"
    width={300}
    height={400}
  />
  <img
    src="/assets/images/hero.jpg"
    alt="メインビジュアルの説明"
    width={600}
    height={400}
    loading="lazy"
  />
</Picture>;
```

画像の URL・代替文・寸法・読み込み優先度はネイティブの source / img に指定します。Astro テンプレートでは `srcset` 表記を使います。BASE_URL が `/` 以外なら、利用側で `import.meta.env.BASE_URL` を URL に反映します。Picture は URL を書き換えません。

表示幅は `--picture-width` / `--picture-width-sp`、トリミングは `--picture-aspect-ratio` / `--picture-aspect-ratio-sp` と `--picture-fit` で指定します。未指定なら画像本来の縦横比を使います。`width` / `height` 属性は表示用 prop に置き換えず img / source に残します。

### レイアウト

```tsx
import Container from "@/components/object/container";
import Grid from "@/components/object/grid";

<Container
  style={{ "--container-max-width": "960px", "--container-padding": "16px" }}
>
  <Grid
    style={{
      "--grid-repeat": 3,
      "--grid-gap": "1.25rem",
      "--grid-repeat-sp": 1,
    }}
  >
    <p>一つ目</p>
    <p>二つ目</p>
    <p>三つ目</p>
  </Grid>
</Container>;
```

Container / Grid は div を描画します。section や ul が必要なら、その要素へ直接 `o-container` / `o-grid` を付けます。
Grid の変数は `--grid-layout`（列定義を直接指定）、`--grid-repeat`、`--grid-min-size`、`--grid-gap`、`--grid-column-gap`、`--grid-row-gap`。各値に SP 用の `-sp` があります。寸法は CSS 単位付きで指定します。

### モーダル

```tsx
<Button class="js-modalOpen" data-modal-target="sample">開く</Button>
<Modal data-modal-id="sample" aria-labelledby="sample-title">
  <h2 id="sample-title">確認</h2>
  <p>内容をここに書きます。</p>
</Modal>
```

ネイティブ dialog。閉じるボタン・背景クリック・Escape で閉じます。サイズは `--modal-width` / `--modal-height` で調整できます。ID は配置ごとに一意にします。プログラムからは `EventEmitter.emit(Events.OPEN_MODAL, { id: "sample" })` で開けます。操作名や説明は `aria-labelledby` / `aria-describedby` で渡せます。

### カルーセルとマーキー

```tsx
import Carousel from "@/components/ui/slide";
import Marquee from "@/components/ui/marquee";

<Carousel aria-label="制作実績" options={{ type: "loop", autoWidth: true, gap: "1rem" }}>
  <img src="/assets/images/work-1.jpg" alt="制作実績1" width={800} height={400} />
  <img src="/assets/images/work-2.jpg" alt="制作実績2" width={800} height={400} />
</Carousel>
<Marquee speed={60} pauseOnHover><span>お知らせ</span></Marquee>
```

Carousel の `options` は Splide の移動距離・複製・ページ数の計算に関わるため維持します。`gap` もライブラリが計算に使います。`overflowOnly` ははみ出す場合だけ有効化する挙動です。`type` は breakpoints で変更できません。
Carousel の装飾は `--carousel-slide-width`、`--carousel-arrow-background`、`--carousel-arrow-hover-background`、`--carousel-arrow-color`、`--carousel-pagination-color`、`--carousel-pagination-active-color` で調整できます。Splide の CSS を上書きする連携部分には必要な詳細度を残し、利用側は公開変数で調整します。

Marquee の `speed` / `direction` / `pauseOnHover` / `scrollBoost` は挙動を指定します。

**Astro から Preact へ複数の子を渡すと、一つの slot として渡されます。** Carousel のように `toChildArray` で子を分割する部品は、`.tsx` のラッパーから各子を渡します。実例は `src/dev/_components/SlideDemo.tsx`。単純に children を描画する Button / Picture / Modal は Astro から直接利用できます。

## CSS の設計

SCSS の共通変数・mixin は `styles/settings` / `styles/tools`、部品固有のスタイルは部品の隣に置きます。`@` は `src` の別名です。クラス接頭辞は UI=`c-`、レイアウト=`o-`、ページ=`p-`、業務部品=`f-`。

追加する内容や状態のセレクタは `:where()` で包み、クラス一つ相当の詳細度を基本にします。例えば `.c-example:where(:has(> img))`。任意の footer の囲み自体を省く場合は、CSS の非表示で代用せず、渡された children / slot から部品内で判断します。Astro では `Astro.slots.has()` が使えます。

公開変数は `var(--部品名-用途, 既定値)` で読みます。変数をルートに固定値として再定義すると親からの継承を遮るため、既定値は var のフォールバックに置きます。変数へ渡す値も利用側が知る契約なので、不要に増やしません。

## スクリプト基盤

`src/scripts/index.ts` がセレクタと Component クラスを登録・初期化します。UI 固有のクラスは各 UI ディレクトリにある `.client.ts`、ページ全体のサイズ監視・スクロールなどは `src/scripts/components/` にあります。

基底クラスは `src/scripts/base/Component.ts`。DOM 購読は `_addEL`、rAF は `_addRAF`、イベントバスは `_addEE`、開発 GUI は `_addGUI` を使います。購読は destroy で自動解除され、固有の後始末は `_onDestroy()` に書きます。`destroy()` 自体はオーバーライドしません。

EventEmitter は型付きイベントを microtask で配信します。毎フレームの処理は単一ループの Ticker へ購読し、イベントバスへ流しません。stats.js / lil-gui は開発時のみ有効です。詳細な注意点は [CLAUDE.md](CLAUDE.md) を参照してください。

## コマンドとビルド

| コマンド                                     | 内容                                                        |
| -------------------------------------------- | ----------------------------------------------------------- |
| `npm install`                                | 依存をインストールし、Husky を有効化                        |
| `npm run dev`                                | localhost:4321（`/components` に開発専用カタログ）          |
| `npm run build`                              | dist を再生成し、出力 HTML を Prettier で整形               |
| `npm run preview`                            | 本番出力のプレビュー                                        |
| `npm run lint:js` / `lint:css` / `lint:html` | ESLint / Stylelint / markuplint                             |
| `npm run format` / `format:check`            | Prettier 整形 / 確認                                        |
| `npx tsc --noEmit`                           | TypeScript のチェック（Astro テンプレートはビルドでも確認） |

Husky + lint-staged がステージ済みの対象を Lint・整形します。Astro 用 Prettier プラグインも設定済みです。

CSS は単一バンドル。JS は `integrations/cleanup-scripts.mjs` がビルド後に `assets/scripts/script.js` へ集約します。画像は `integrations/image-optimize.mjs` が sharp で最適化し、APNG は検出して素通し、アニメ GIF / WebP はフレームを保持します。画像サイズが増える場合は元を維持します。HTML は圧縮せず、出力後に整形します。

## 以前の API からの移行

この変更では互換用の旧 props を残さず、リポジトリ内の利用箇所も同時に移行しています。別案件にコピーした部品は次の表で移行してください。

| 以前                               | 現在                                                   |
| ---------------------------------- | ------------------------------------------------------ |
| `scripts/components/ui/*.ts`       | 各 UI の `{ComponentName}.client.ts`                   |
| `Button label="保存"`              | `<Button>保存</Button>`                                |
| `Button href="/"`                  | `<Link href="/">トップ</Link>`                         |
| Icon の size / width / SP 用 props | `--icon-size` / `--icon-width` / `-sp` 変数            |
| Picture の img / sp                | 子の img / source                                      |
| Picture の width / widthSp         | `--picture-width` / `--picture-width-sp`               |
| Container の maxWidth / padding    | `--container-max-width` / `--container-padding`        |
| Grid の repeat / gap など          | `--grid-repeat` / `--grid-gap` など（寸法は CSS 単位） |
| Grid / Container の as             | HTML 要素に `o-grid` / `o-container` を直接指定        |
| Modal の dataModalId               | 標準形式の `data-modal-id`                             |
