# Grid

CSS Grid の `div` を描画します。`ul` などほかの要素が必要なときは、その要素に `o-grid` クラスを直接付けます。

```tsx
import Grid from "@/components/object/grid";

<Grid>
  <p>一つ目</p>
  <p>二つ目</p>
  <p>三つ目</p>
</Grid>;
```

## 公開変数

| 変数                | 内容                                            | 既定値                     |
| ------------------- | ----------------------------------------------- | -------------------------- |
| `--grid-layout`     | 列定義を直接指定する（`grid-template-columns`） | repeat / min-size から生成 |
| `--grid-repeat`     | 列数                                            | `auto-fit`                 |
| `--grid-min-size`   | 列の最小幅                                      | `0px`                      |
| `--grid-gap`        | 行・列の間隔                                    | `0px`                      |
| `--grid-column-gap` | 列の間隔                                        | `--grid-gap` と同じ        |
| `--grid-row-gap`    | 行の間隔                                        | `--grid-gap` と同じ        |

どの変数にも SP 用の `-sp`（`--grid-repeat-sp` など）があり、未指定なら PC の値を使います。寸法は CSS の単位付きで指定します。

部品を包むページ側の要素のクラスで指定し、部品へ継承させます。`o-grid` を直接付けた要素なら、その要素のクラスで指定できます。指定は中に入れ子にした Grid にも効きます。

```tsx
<ul className="o-grid p-home__list">…</ul>
```

```scss
.p-home__list {
  --grid-repeat: 3;
  --grid-gap: 1.25rem;
  --grid-repeat-sp: 1;
}
```
