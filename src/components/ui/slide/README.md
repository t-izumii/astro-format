# Carousel

Splide を使ったカルーセルです。挙動は `Carousel.client.ts` にあります。

```tsx
import Carousel from "@/components/ui/slide";

<Carousel
  aria-label="制作実績"
  options={{ type: "loop", autoWidth: true, gap: "1rem" }}
>
  <img
    src="/assets/images/work-1.jpg"
    alt="制作実績1"
    width={800}
    height={400}
  />
  <img
    src="/assets/images/work-2.jpg"
    alt="制作実績2"
    width={800}
    height={400}
  />
</Carousel>;
```

## options

`options` は Splide の移動距離・複製・ページ数の計算に関わるため、CSS に置き換えず props で渡します。`gap` もライブラリが計算に使います。

- `type`（`slide` / `loop`）は breakpoints では変更できません。マウント時に固定されます。
- `overflowOnly` を付けると、スライドがはみ出す場合だけカルーセルとして動きます。
- `autoplay` を有効にすると、停止・再開ボタンを出力します。`interval` を省略した場合は Splide の既定値（5000ms）になります。

## 子要素の渡し方

Carousel は `toChildArray` で子を 1 枚ずつのスライドに分けます。Astro から Preact へ複数の子を渡すと 1 つの slot としてまとめて渡されるため、Astro から直接使うと分割できません。`.tsx` のラッパーから各子を渡してください。実例は `src/dev/_components/SlideDemo.tsx` です。children をそのまま描画するだけの Button や Modal は、Astro から直接使えます。

## 公開変数

`--carousel-slide-width`、`--carousel-arrow-background`、`--carousel-arrow-hover-background`、`--carousel-arrow-color`、`--carousel-pagination-color`、`--carousel-pagination-active-color`

部品を包むページ側の要素のクラスで指定し、部品へ継承させます。Splide の CSS を上書きする連携部分には必要な詳細度を残しているので、利用側は公開変数だけで調整します。

```scss
.p-home__works {
  --carousel-slide-width: 320px;
  --carousel-pagination-active-color: #c62828;
}
```
