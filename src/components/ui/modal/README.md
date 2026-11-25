# Modal

ネイティブの `dialog` 要素で作るモーダルです。閉じるボタン・背景クリック・Escape で閉じます。

```tsx
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

<Button data-modal-target="sample">開く</Button>
<Modal data-modal-id="sample" aria-labelledby="sample-title">
  <h2 id="sample-title">確認</h2>
  <p>内容をここに書きます。</p>
</Modal>
```

`data-modal-id` は必須で、配置ごとに一意にします。同じ値を `data-modal-target` に持つ要素を押すと開きます。プログラムからは `EventEmitter.emit(Events.OPEN_MODAL, { id: "sample" })` で開けます。見出しや説明は `aria-labelledby` / `aria-describedby` で結び付けます。

挙動は `Modal.client.ts`（開閉）と `ModalOpen.client.ts`（開くボタン）にあります。

## 公開変数

| 変数             | 内容 | 既定値                |
| ---------------- | ---- | --------------------- |
| `--modal-width`  | 幅   | `calc(100vw - 4rem)`  |
| `--modal-height` | 高さ | `calc(100svh - 4rem)` |

部品を包むページ側の要素のクラスで指定し、部品へ継承させます。

```scss
.p-home__dialog {
  --modal-width: 640px;
  --modal-height: auto;
}
```
