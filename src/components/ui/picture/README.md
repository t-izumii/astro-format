# Picture

`picture` 要素を描画し、SP 用の画像を切り替えられます。

```tsx
import Picture from "@/components/ui/picture";

<Picture
  sp={{
    srcSet: "/assets/images/hero-sp.jpg",
    width: 300,
    height: 400,
  }}
  img={{
    src: "/assets/images/hero.jpg",
    alt: "メインビジュアルの説明",
    width: 600,
    height: 400,
    loading: "lazy",
  }}
/>;
```

画像の URL・代替文・寸法・読み込み優先度は `img`（img の属性）と `sp`（SP 用 source の属性、省略可）に渡し、children は受け取りません。`sp` の `media` は `MIN_PC_WIDTH`（既定 768px）未満で固定です。BASE_URL が `/` 以外なら、利用側で `import.meta.env.BASE_URL` を URL に反映します。Picture は URL を書き換えません。

縦横比は `img` / `sp` の `width` / `height` 属性から自動で決まるため、CSS では管理しません。`width` / `height` は表示用の prop に置き換えず、`img` / `sp` に残します。

## 公開変数

| 変数                 | 内容                | 既定値    |
| -------------------- | ------------------- | --------- |
| `--picture-width`    | 表示幅              | `100%`    |
| `--picture-width-sp` | SP 用の表示幅       | PC と同じ |
| `--picture-fit`      | 画像の `object-fit` | `cover`   |

部品を包むページ側の要素のクラスで指定し、部品へ継承させます。

```tsx
<div className="p-home__visual">
  <Picture img={{ ... }} />
</div>
```

```scss
.p-home__visual {
  --picture-width: 400px;
  --picture-width-sp: 100%;
}
```
