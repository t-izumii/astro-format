# ナビゲーションのドロップダウンに role="menu" を使わない

- 強さ: 必須
- 対象: グローバルナビゲーションなど、リンクの一覧を開閉するメニュー。
- WCAG: 4.1.2 A

サイトのナビゲーションは、開閉のボタンとリンクのリストで作り、`menu`・`menubar`・`menuitem` の役割を付けない。現在のページのリンクには `aria-current="page"` を付ける。親の項目自体にもリンク先がある場合は、リンクと開閉のボタンを分けて並べる。

理由: `menu` の役割は、アプリケーションのメニューのように矢印キーで移動する操作を前提にしている。一般的なサイトのナビゲーションにはその操作は不要で、役割だけを付けると、スクリーンリーダーが案内する操作と実際の動作が食い違う。

例外・代替: なし。

- 構築: 親の項目をリンクにしたまま、ホバーやタップで子の一覧を開く作りにしない。タップした瞬間にページが移動し、子の一覧を開けなくなる。
- レビュー: `role="menu"` と `role="menuitem"` を検索し、ナビゲーションに使われていないかを確認する。

## サンプル: 子の一覧を持つナビゲーション

```html
<nav aria-label="メイン">
  <ul>
    <li>
      <a href="/service/">サービス</a>
      <button type="button" aria-expanded="false" aria-controls="nav-service">
        <svg aria-hidden="true">…</svg>
        <span class="visually-hidden">サービスの一覧</span>
      </button>
      <ul id="nav-service" hidden>
        <li><a href="/service/web/">Web 制作</a></li>
        <li><a href="/service/app/" aria-current="page">アプリ開発</a></li>
      </ul>
    </li>
  </ul>
</nav>
```
