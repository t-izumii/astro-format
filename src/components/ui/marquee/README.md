# Marquee

内容を横に流し続ける帯です。挙動は `Marquee.client.ts` にあります。

```tsx
import Marquee from "@/components/ui/marquee";

<Marquee speed={60} pauseOnHover>
  <span>お知らせ</span>
</Marquee>;
```

`speed` / `direction` / `pauseOnHover` / `scrollBoost` で挙動を指定します。動いている間は、部品が停止・再開ボタンを表示します。動きの抑制設定が有効なときや JS が動く前は、流さずに横スクロールで表示します。

公開変数はありません。
