# Button

`button` 要素を描画します。`type` の既定値は `button` です。ページ遷移には Button ではなく Link を使います。

```tsx
import Button from "@/components/ui/button";
import Icon from "@/components/ui/icon";

<Button type="submit" disabled={isSubmitting}>送信</Button>
<Button><Icon name="arrow" />次へ</Button>
```

`disabled`・`type`・`onClick`・ARIA 属性は標準属性型から継承します。モーダルを開く `data-modal-target` などの data 属性も利用側から渡せます。

イベントハンドラーを使う場合は、Astro 側で適切な `client:*` 指定が必要です。`data-modal-target` などは共通スクリプトが初期化するため、hydration は要りません。

## 公開変数

| 変数                  | 既定値  |
| --------------------- | ------- |
| `--button-gap`        | `0.5em` |
| `--button-padding`    | `1rem`  |
| `--button-font-size`  | `1rem`  |
| `--button-color`      | `#000`  |
| `--button-background` | `#fff`  |

部品を包むページ側の要素のクラスで指定し、部品へ継承させます。

```tsx
<div className="p-home__save">
  <Button>保存</Button>
</div>
```

```scss
.p-home__save {
  --button-padding: 0.75rem 2rem;
}
```
