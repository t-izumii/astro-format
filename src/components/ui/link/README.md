# Link

遷移用の `a` 要素を描画します。ボタン操作の Button とは別の部品で、`href` は必須です。

```tsx
import ActionLink from "@/components/ui/link";

<ActionLink href="/about/">私たちについて</ActionLink>;
```

Astro テンプレートでは、HTML Lint の解析との衝突を避けるため `ActionLink` という名前で import します。

## 公開変数

`--link-gap`、`--link-padding`、`--link-font-size`、`--link-color`、`--link-background`

部品を包むページ側の要素のクラスで指定し、部品へ継承させます。

```scss
.p-home__more {
  --link-color: #1565c0;
}
```
