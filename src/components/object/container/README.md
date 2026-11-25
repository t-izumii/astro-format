# Container

最大幅と左右の余白を持つ `div` を描画します。`section` などほかの要素が必要なときは、その要素に `o-container` クラスを直接付けます。

```tsx
import Container from "@/components/object/container";

<Container>
  <p>内容</p>
</Container>;
```

## 公開変数

| 変数                    | 内容     | 既定値                   |
| ----------------------- | -------- | ------------------------ |
| `--container-max-width` | 最大幅   | デザイン幅（PC / SP 別） |
| `--container-padding`   | 左右余白 | 20px 相当の rem          |

部品を包むページ側の要素のクラスで指定し、部品へ継承させます。`o-container` を直接付けた要素なら、その要素のクラスで指定できます。

```tsx
<section className="o-container p-home__intro">…</section>
```

```scss
.p-home__intro {
  --container-max-width: 960px;
  --container-padding: 16px;
}
```
