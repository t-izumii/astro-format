# 動きを抑える設定のときは、動きを伴うアニメーションを止めるか控えめにする

- 強さ: 推奨
- 対象: 要素の移動・拡大縮小・回転、視差効果（パララックス）、スクロールに合わせた演出、なめらかなスクロール。
- WCAG: 2.3.3 AAA（2.1 で追加）

利用者が OS で動きを抑える設定をしている場合（`prefers-reduced-motion: reduce`）は、動きを伴うアニメーションを止めるか、色や透明度の変化に置き換える。スクリプトで動かすアニメーションは、`matchMedia('(prefers-reduced-motion: reduce)')` で設定を確かめてから開始する。

理由: 画面上の大きな動きは、前庭障害のある利用者にめまいや吐き気を起こすことがある。

例外・代替: 色や透明度だけの変化は、動きのアニメーションに当たらないので残してよい。動き自体が情報を伝えるために欠かせない場合は残してよい。

- 構築: なめらかなスクロール（`scroll-behavior: smooth`）も、設定に合わせて止める。
- レビュー: OS かブラウザの開発者ツールで動きを抑える設定にし、移動や拡大の演出が止まるかを確かめる。

## サンプル: 設定に合わせて動きを止める

```css
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

ページ全体の動きを一括で止める方法の例。色の変化など残してよい演出まで止まるので、個別に指定する方法と使い分ける。
