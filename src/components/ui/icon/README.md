# Icon

`svg/` にある SVG を、ファイル名（拡張子なし）を `name` に指定して表示します。装飾として既定で `aria-hidden="true"` を付けます。アイコンだけのボタンには、Button 側の `aria-label` などで操作名を付けてください。

```tsx
import Icon from "@/components/ui/icon";

<Icon name="arrow" />;
```

## SVG の追加

SVG は `svg/` に追加します。単色の SVG は、塗りを `fill="currentColor"`、線を `stroke="currentColor"` にし、描画しない部分の `none` は残します。固定色の SVG はその色を保つため、`--icon-color` では変わりません。

## 公開変数

| 変数              | 内容                                          | 既定値                  |
| ----------------- | --------------------------------------------- | ----------------------- |
| `--icon-size`     | 大きさ                                        | `1em`（親の文字サイズ） |
| `--icon-width`    | 幅だけを指定する。高さは SVG の縦横比で決まる | `--icon-size` と同じ    |
| `--icon-size-sp`  | SP 用の大きさ                                 | PC と同じ               |
| `--icon-width-sp` | SP 用の幅                                     | PC と同じ               |
| `--icon-color`    | 色                                            | 親の文字色              |

部品を包むページ側の要素のクラスで指定し、部品へ継承させます。指定はその要素の中にあるすべての Icon に効きます。Button の中の Icon も対象になるので、1 つだけ変えるときはその Icon だけを包みます。

```tsx
<span className="p-home__arrow">
  <Icon name="arrow" />
</span>
```

```scss
.p-home__arrow {
  --icon-size: 2.5rem;
  --icon-size-sp: 1.5rem;
  --icon-color: #c62828;
}
```
