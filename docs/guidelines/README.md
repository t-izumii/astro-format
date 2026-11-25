# ルールの一覧と根拠

`docs/guidelines/` にあるルールの索引。話題ごとに、ルールのファイル、強さ（必須・推奨）、根拠にした WCAG の達成基準を表にまとめた。あわせて、それぞれの話題で何を決めているか、ほかの話題とどう分担しているか、何を根拠にしたかを書いている。ルールを探すとき、見直すとき、出典を確かめるときに読む。

ルールそのものは各フォルダの中にあり、1つのファイルに1つのルールを書いている。各ファイルの冒頭には、強さ、当てはめる対象、根拠にした WCAG の達成基準を書いている。このファイルは人が読むためのもので、AI への指示（`.claude/rules/coding-rules.md`）には含めていない。

## 表の見方

- ルール: ルールの題名。リンク先がルールのファイル。
- 強さ: 必須は必ず守る。推奨は、合わない事情がなければ守る。表では必須を先に並べている。
- WCAG: 根拠にした達成基準の番号と適合レベル（A・AA・AAA）。「—」は、WCAG を根拠にしていないルール。

ルールは全部で 122 件あり、必須が 95 件、推奨が 27 件。WCAG の達成基準を根拠にしたルールは 56 件ある。

## ルールの一覧

話題の名前から、下の「話題ごとの概要と根拠」にある説明と参考資料へ移動できる。

### 全体（general）

| 話題 | ルール | 強さ | WCAG |
|---|---|---|---|
| [名前とコメント](#名前とコメント)（必須 4・推奨 2） | [回避策と意図的な値には、理由と外す条件をコメントに残す](general/code-style/document-workarounds.md) | 必須 | — |
| | [既存のコードの書き方と名前の付け方に合わせる](general/code-style/follow-existing-style.md) | 必須 | — |
| | [使っていないコード、コメントアウトしたコード、デバッグ用の出力を残さない](general/code-style/remove-dead-code.md) | 必須 | — |
| | [コードを変えたら、近くのコメントも直す](general/code-style/update-comments.md) | 必須 | — |
| | [コメントには、コードから読み取れない理由を書く](general/code-style/comment-the-why.md) | 推奨 | — |
| | [名前は役割で付け、見た目や位置で付けない](general/code-style/name-by-role.md) | 推奨 | — |
| [部品の設計](#部品の設計)（必須 5・推奨 1） | [同じ部品を複数置いても、状態を共有させない](general/components/isolate-instance-state.md) | 必須 | — |
| | [置かれた場所のセレクタで、部品の中身を上書きしない](general/components/no-context-overrides.md) | 必須 | — |
| | [部品に外側の余白と配置を持たせない](general/components/no-outer-margin.md) | 必須 | — |
| | [新しい部品を作る前に、既存の部品を探して使う](general/components/reuse-existing-components.md) | 必須 | — |
| | [部品の使い方を変えたら、すべての利用箇所を直す](general/components/update-all-usages.md) | 必須 | — |
| | [同じ事実を複数の入力で指定させない](general/components/single-source-props.md) | 推奨 | — |

### マークアップ（markup）

| 話題 | ルール | 強さ | WCAG |
|---|---|---|---|
| [画像と動画](#画像と動画)（必須 5・推奨 2） | [代替テキストは、画像の役割に合わせて書き分ける](markup/media/alt-text-by-role.md) | 必須 | 1.1.1 A |
| | [画像には width と height を書く](markup/media/image-dimensions.md) | 必須 | — |
| | [srcset で幅の違う画像を渡すときは、sizes を書く](markup/media/srcset-sizes.md) | 必須 | — |
| | [意味を持つ SVG には名前を付け、装飾の SVG は支援技術から隠す](markup/media/svg-name-or-hide.md) | 必須 | 1.1.1 A |
| | [音声を含む動画には字幕を用意する](markup/media/video-captions.md) | 必須 | 1.2.2 A |
| | [最初の画面に表示される画像は、遅延読み込みにしない](markup/media/no-lazy-above-fold.md) | 推奨 | — |
| | [picture は、形式の出し分けか、画面によって画像を差し替える場合に使う](markup/media/picture-usage.md) | 推奨 | — |
| [HTML の構造と要素の選び方](#html-の構造と要素の選び方)（必須 10・推奨 2） | [拡大を禁止する viewport の指定を書かない](markup/semantics/allow-zoom.md) | 必須 | 1.4.4 AA |
| | [データの表は table で作り、見出しのセルを th にする](markup/semantics/data-tables.md) | 必須 | 1.3.1 A |
| | [リンクの文字だけで、行き先が分かるようにする](markup/semantics/descriptive-link-text.md) | 必須 | 2.4.4 A |
| | [見出しのレベルは、見た目の大きさではなく内容の階層で選ぶ](markup/semantics/heading-levels.md) | 必須 | 1.3.1 A |
| | [html 要素に lang 属性を書く](markup/semantics/html-lang.md) | 必須 | 3.1.1 A |
| | [iframe には、中身を表す title を付ける](markup/semantics/iframe-title.md) | 必須 | 4.1.2 A |
| | [ランドマークを使い、同じ種類が複数あるときは名前で区別する](markup/semantics/landmarks.md) | 必須 | 1.3.1 A |
| | [ページの移動はリンク、その場の操作はボタンにする](markup/semantics/link-vs-button.md) | 必須 | 4.1.2 A |
| | [繰り返し使う部品の中で id を固定しない](markup/semantics/no-hardcoded-ids.md) | 必須 | — |
| | [ページごとに、内容を表す title を付ける](markup/semantics/unique-page-title.md) | 必須 | 2.4.2 A |
| | [新しいタブで開くリンクは、そのことを伝える](markup/semantics/announce-new-tab.md) | 推奨 | — |
| | [共有と検索のための情報を、ページごとに書く](markup/semantics/share-and-seo-meta.md) | 推奨 | — |

### スタイル（style）

| 話題 | ルール | 強さ | WCAG |
|---|---|---|---|
| [レイアウト](#レイアウト)（必須 5・推奨 3） | [伸縮する並びの子要素は、内容の幅で縮まなくならないようにする](style/layout/flex-min-width.md) | 必須 | — |
| | [固定の高さで文字や内容を収めない](style/layout/no-fixed-height-text.md) | 必須 | — |
| | [幅 320px 相当まで縮めても、横スクロールなしで読めるようにする](style/layout/reflow-320.md) | 必須 | 1.4.10 AA（2.1 で追加） |
| | [文字サイズは、利用者の文字サイズの設定が効く単位で書く](style/layout/relative-font-size.md) | 必須 | 1.4.4 AA |
| | [内容の量が変わっても崩れないようにする](style/layout/resilient-to-content.md) | 必須 | — |
| | [配置先の幅で形を変える部品は、コンテナクエリで切り替える](style/layout/container-queries.md) | 推奨 | — |
| | [画面の高さに合わせる指定に 100vh を使わない](style/layout/no-100vh.md) | 推奨 | — |
| | [並んだ要素の間隔は gap で付ける](style/layout/use-gap.md) | 推奨 | — |
| [CSS の構成と適用範囲](#css-の構成と適用範囲)（必須 4・推奨 3） | [共通の指定を変えるときは、使われている箇所をすべて確かめる](style/structure/check-shared-style-usages.md) | 必須 | — |
| | [部品のスタイルを、要素セレクタや広い範囲の指定で書かない](style/structure/no-broad-selectors.md) | 必須 | — |
| | [!important を使わない](style/structure/no-important.md) | 必須 | — |
| | [既存の指定に勝つために詳細度を上げない](style/structure/no-specificity-wars.md) | 必須 | — |
| | [ホバーの見た目は、ホバーできる端末に限って付ける](style/structure/hover-capable-only.md) | 推奨 | — |
| | [スクリプトから見た目を変えるときは、style を直接書き換えない](style/structure/no-inline-style-from-js.md) | 推奨 | — |
| | [状態の見た目は、状態を表す属性に連動させる](style/structure/state-from-attributes.md) | 推奨 | — |
| [デザイントークン](#デザイントークン)（必須 2・推奨 2） | [部品からは、用途を表すトークンを参照する](style/tokens/semantic-tokens.md) | 必須 | — |
| | [色・余白・文字サイズは、定義済みのトークンを使う](style/tokens/use-tokens.md) | 必須 | — |
| | [新しいトークンは、同じ意味で使う値だけをまとめて作る](style/tokens/add-tokens-by-meaning.md) | 推奨 | — |
| | [テーマの切り替えは、用途のトークンの値を差し替えて行う](style/tokens/theme-via-semantic-tokens.md) | 推奨 | — |

### スクリプト（script）

| 話題 | ルール | 強さ | WCAG |
|---|---|---|---|
| [通信と非同期処理](#通信と非同期処理)（必須 6・推奨 1） | [fetch の結果は response.ok を確かめてから使う](script/async/check-response-ok.md) | 必須 | — |
| | [失敗したら、起きたことと次にできることを示す](script/async/explain-failures.md) | 必須 | — |
| | [非同期処理には、処理中・成功・空・失敗の表示をすべて用意する](script/async/four-ui-states.md) | 必須 | — |
| | [古い応答や不要になった応答を表示に反映しない](script/async/ignore-stale-responses.md) | 必須 | — |
| | [処理中は同じ操作を受け付けない](script/async/prevent-double-submit.md) | 必須 | — |
| | [先に表示を変える場合は、失敗したときに元に戻す](script/async/rollback-optimistic-ui.md) | 必須 | — |
| | [待ち時間の上限を決める](script/async/set-timeouts.md) | 推奨 | — |
| [セキュリティ](#セキュリティ)（必須 6・推奨 1） | [postMessage は、送り先と送り元のオリジンを確かめる](script/security/check-postmessage-origin.md) | 必須 | — |
| | [認証の情報を localStorage に保存しない](script/security/no-auth-in-localstorage.md) | 必須 | — |
| | [文字列をコードとして実行しない](script/security/no-eval.md) | 必須 | — |
| | [秘密情報をフロントエンドのコードに置かない](script/security/no-secrets-in-client.md) | 必須 | — |
| | [外部から来た文字列を、HTML として挿入しない](script/security/no-unsafe-html.md) | 必須 | — |
| | [外部から来た URL は、スキームを確かめてから属性に入れる](script/security/validate-url-scheme.md) | 必須 | — |
| | [外部のスクリプトは、必要なものだけを、改ざんを検知できる形で読み込む](script/security/third-party-scripts.md) | 推奨 | — |
| [スクリプトの構成](#スクリプトの構成)（必須 4・推奨 3） | [部品を取り除くときは、登録したイベントとタイマーを解除する](script/structure/cleanup-on-remove.md) | 必須 | — |
| | [DOM を取得する目印に、見た目用のクラスを使わない](script/structure/dedicated-dom-hooks.md) | 必須 | — |
| | [対象の要素がないページでも、エラーにならないようにする](script/structure/missing-element-safe.md) | 必須 | — |
| | [部品の処理は、部品の要素を起点に要素を取得する](script/structure/scope-to-root.md) | 必須 | — |
| | [スクリプトは defer か type="module" で読み込む](script/structure/defer-scripts.md) | 推奨 | — |
| | [同じ要素を二度初期化しない](script/structure/init-once.md) | 推奨 | — |
| | [スクロールや大きさの変化は、監視の仕組みで受け取る](script/structure/use-observers.md) | 推奨 | — |

### アクセシビリティ（accessibility）

| 話題 | ルール | 強さ | WCAG |
|---|---|---|---|
| [ARIA と支援技術への伝え方](#aria-と支援技術への伝え方)（必須 7・推奨 0） | [隠す方法を、誰から隠すかで使い分ける](accessibility/aria/hide-appropriately.md) | 必須 | 4.1.2 A |
| | [フォーカスを移さずに変化を伝えるときは、ライブリージョンを先に置いておく](accessibility/aria/live-regions.md) | 必須 | 4.1.3 AA（2.1 で追加） |
| | [div や span に aria-label を付けない](accessibility/aria/no-aria-label-on-generic.md) | 必須 | 4.1.2 A |
| | [ネイティブ要素で表せるものに ARIA の役割を付けない](accessibility/aria/prefer-native-elements.md) | 必須 | 4.1.2 A |
| | [役割を付けたら、その役割に必要なキー操作と状態をすべて実装する](accessibility/aria/roles-need-full-behavior.md) | 必須 | 2.1.1 A、4.1.2 A |
| | [状態の属性を実際の状態と同期させる](accessibility/aria/sync-state-attributes.md) | 必須 | 4.1.2 A |
| | [操作要素には、見えている文字を含む名前を付ける](accessibility/aria/visible-label-in-name.md) | 必須 | 4.1.2 A、2.5.3 A（2.1 で追加） |
| [キーボードとフォーカス](#キーボードとフォーカス)（必須 9・推奨 0） | [固定表示の要素でフォーカスを隠さない](accessibility/keyboard-focus/focus-not-obscured.md) | 必須 | 2.4.11 AA（2.2 で追加） |
| | [見た目の順番とフォーカスの順番をそろえる](accessibility/keyboard-focus/focus-order-matches-visual.md) | 必須 | 2.4.3 A |
| | [ホバーで現れる内容はフォーカスでも表示し、Esc で閉じられるようにする](accessibility/keyboard-focus/hover-content.md) | 必須 | 1.4.13 AA（2.1 で追加） |
| | [フォーカスの表示を消さない](accessibility/keyboard-focus/keep-focus-visible.md) | 必須 | 2.4.7 AA |
| | [クリックできるものはキーボードでも操作できるようにする](accessibility/keyboard-focus/keyboard-operable.md) | 必須 | 2.1.1 A |
| | [開閉や削除のあとにフォーカスの行き先を決める](accessibility/keyboard-focus/manage-focus-after-change.md) | 必須 | 2.4.3 A |
| | [見えていない要素にフォーカスを入れない](accessibility/keyboard-focus/no-focus-on-hidden.md) | 必須 | 2.4.3 A、2.4.7 AA |
| | [本文へ移動するスキップリンクを、ページの先頭に置く](accessibility/keyboard-focus/skip-link.md) | 必須 | 2.4.1 A |
| | [tabindex は 0 と -1 だけを使い分ける](accessibility/keyboard-focus/tabindex-zero-or-minus-one.md) | 必須 | 2.4.3 A |
| [見え方と動き](#見え方と動き)（必須 6・推奨 1） | [1秒間に3回を超えて点滅させない](accessibility/perception/no-flashing.md) | 必須 | 2.3.1 A |
| | [操作部品の境界と状態は、隣の色と 3:1 以上の差を付ける](accessibility/perception/non-text-contrast.md) | 必須 | 1.4.11 AA（2.1 で追加） |
| | [色だけで情報を伝えない](accessibility/perception/not-color-alone.md) | 必須 | 1.4.1 A |
| | [自動で動く内容には、止める手段を付ける](accessibility/perception/pause-auto-motion.md) | 必須 | 2.2.2 A |
| | [操作対象は 24px 四方以上にするか、十分に離す](accessibility/perception/target-size.md) | 必須 | 2.5.8 AA（2.2 で追加） |
| | [文字と背景のコントラスト比を確保する](accessibility/perception/text-contrast.md) | 必須 | 1.4.3 AA |
| | [動きを抑える設定のときは、動きを伴うアニメーションを止めるか控えめにする](accessibility/perception/reduce-motion.md) | 推奨 | 2.3.3 AAA（2.1 で追加） |

### UI パターン（patterns）

UI パターンのルールは、その部品に固有の判断だけを書いている。フォーカスや ARIA などの一般的なことは、上のアクセシビリティの話題に従う。

| 話題 | ルール | 強さ | WCAG |
|---|---|---|---|
| [カルーセル](#カルーセル)（必須 3・推奨 1） | [カルーセルの前後のボタンと、スライドを選ぶボタンに名前を付ける](patterns/carousel/name-controls.md) | 必須 | 4.1.2 A |
| | [見えていないスライドの中に、フォーカスを入れない](patterns/carousel/no-focus-on-hidden-slides.md) | 必須 | 2.4.3 A |
| | [自動で切り替わるカルーセルには、止めるボタンを付ける](patterns/carousel/pause-button.md) | 必須 | 2.2.2 A |
| | [カルーセル全体に名前を付け、何枚目のスライドかを伝える](patterns/carousel/name-and-position.md) | 推奨 | — |
| [ダイアログ](#ダイアログ)（必須 5・推奨 2） | [開いたときの最初のフォーカス先を決める](patterns/dialog/initial-focus.md) | 必須 | 2.4.3 A |
| | [閉じたら、開いたボタンへフォーカスを戻す](patterns/dialog/return-focus.md) | 必須 | 2.4.3 A |
| | [モーダルは dialog 要素と showModal() で開く](patterns/dialog/use-show-modal.md) | 必須 | 2.4.3 A |
| | [閉じるボタンをダイアログの中に見える形で置く](patterns/dialog/visible-close-button.md) | 必須 | — |
| | [ダイアログには見える題名を置き、それで名前を付ける](patterns/dialog/visible-title-as-name.md) | 必須 | 4.1.2 A |
| | [利用者の応答が必要ないものをモーダルにしない](patterns/dialog/avoid-unneeded-modals.md) | 推奨 | — |
| | [開いている間は、背景のページをスクロールさせない](patterns/dialog/lock-background-scroll.md) | 推奨 | — |
| [開閉する部品](#開閉する部品)（必須 6・推奨 2） | [アコーディオンの見出しは、見出し要素の中にボタンを置く](patterns/disclosure/accordion-heading-button.md) | 必須 | 1.3.1 A |
| | [開閉のきっかけは button 要素にし、aria-expanded で状態を伝える](patterns/disclosure/button-with-aria-expanded.md) | 必須 | 4.1.2 A |
| | [画面全体を覆うメニューでは、背景にフォーカスが移らないようにする](patterns/disclosure/fullscreen-menu-inert.md) | 必須 | 2.4.3 A |
| | [開閉のアニメーションは、閉じ終えたら内容を隠す](patterns/disclosure/hide-after-animation.md) | 必須 | 2.4.3 A |
| | [ホバーで開く場合も、クリックとキーボードで開閉できるようにする](patterns/disclosure/hover-also-click-keyboard.md) | 必須 | 2.1.1 A |
| | [ナビゲーションのドロップダウンに role="menu" を使わない](patterns/disclosure/no-menu-role-for-nav.md) | 必須 | 4.1.2 A |
| | [単純な開閉は details と summary で足りるかを先に検討する](patterns/disclosure/consider-details.md) | 推奨 | — |
| | [重なって表示する開閉部品は、Esc で閉じてボタンへフォーカスを戻す](patterns/disclosure/escape-closes-overlay.md) | 推奨 | — |
| [フォーム](#フォーム)（必須 8・推奨 1） | [形式の説明は aria-describedby で入力欄に結び付ける](patterns/form/describe-formats.md) | 必須 | 1.3.1 A |
| | [フォームの中のボタンには type を書く](patterns/form/explicit-button-type.md) | 必須 | — |
| | [関連する入力欄のまとまりは fieldset と legend で囲む](patterns/form/group-with-fieldset.md) | 必須 | 1.3.1 A、3.3.2 A |
| | [エラーは入力欄のそばに文字で示し、入力欄と結び付ける](patterns/form/inline-errors.md) | 必須 | 3.3.1 A、3.3.3 AA |
| | [入力の種類と autocomplete を内容に合わせる](patterns/form/input-types-autocomplete.md) | 必須 | 1.3.5 AA（2.1 で追加） |
| | [送信に失敗しても入力内容を消さない](patterns/form/keep-input-on-failure.md) | 必須 | — |
| | [必須の項目は文字で示し、required 属性を付ける](patterns/form/mark-required.md) | 必須 | 3.3.2 A |
| | [入力欄には見えるラベルを付け、placeholder をラベルの代わりにしない](patterns/form/visible-labels.md) | 必須 | 3.3.2 A |
| | [入力の途中でエラーを出さない](patterns/form/validate-after-input.md) | 推奨 | — |

## 話題ごとの概要と根拠

話題ごとに、何を決めているか、ほかの話題とどう分担しているかを書いている。「参考にした資料」には、資料へのリンクと、ルールの根拠にした箇所の要約を書いている。

### 名前とコメント

フォルダ: [`general/code-style/`](general/code-style/)

変数・関数・クラスなどの名前の付け方と、コメントに書く内容のルール。後から読む人が、コードの役割や、そう書いた理由を取り違えないようにする。

扱わないもの: 大文字・小文字の使い分けや単語のつなぎ方などの表記と、コードの整形は、案件の規約と整形ツールに従う。

参考にした資料: なし。チームの方針として決めた。

### 部品の設計

フォルダ: [`general/components/`](general/components/)

ボタン、カード、モーダルなど、繰り返し使う UI 部品のルール。部品を新しく作るか既存のものを使うか、部品と置く側で責任をどう分けるか、使い方を変えるときに何をするかを決めている。

扱わないもの: 部品の中の要素の取得は [スクリプトの構成](#スクリプトの構成)、`id` の付け方は [HTML の構造と要素の選び方](#html-の構造と要素の選び方)、スタイルの書き方は [CSS の構成と適用範囲](#css-の構成と適用範囲) にある。

参考にした資料: なし。チームの方針として決めた。

### 画像と動画

フォルダ: [`markup/media/`](markup/media/)

画像、SVG のアイコン、動画を置くときのルール。代替テキスト、読み込み方、表示サイズに合った画像の出し分け、字幕を決めている。

扱わないもの: 動画の自動再生を止める手段と、画像の上に重ねた文字のコントラストは [見え方と動き](#見え方と動き) にある。

参考にした資料:

- [W3C WAI: An alt Decision Tree](https://www.w3.org/WAI/tutorials/images/decision-tree/) — 画像の種類（文字の画像、リンクやボタンの中の画像、意味を伝える画像、装飾の画像、複雑な画像）ごとの、代替テキストの決め方。
- [MDN: img](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img) — `alt` を省くと、ファイル名が読み上げられることがある。`width`・`height` を書くと、読み込む前に表示の場所が確保される。`loading`・`fetchpriority` の使い方。`sizes` の既定値は `100vw`。
- [web.dev: Browser-level image lazy loading](https://web.dev/articles/browser-level-image-lazy-loading) — 最初の画面に入る画像、特にいちばん大きく表示される画像は、遅延読み込みにしない。
- [Understanding SC 1.2.2 Captions (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html) — 録画済みで音声を含む動画には字幕を付ける（レベル A）。文章の代わりと明示した動画は例外。

### HTML の構造と要素の選び方

フォルダ: [`markup/semantics/`](markup/semantics/)

`title`・`lang`・viewport などの文書の情報、見出しとランドマークによるページの構造、リンクとボタンのような要素の選び方のルール。支援技術や検索エンジン、ブラウザの機能が、ページの構造と各要素の役割を正しく読み取れるようにする。

扱わないもの: 画像と動画は [画像と動画](#画像と動画)、ARIA の属性の使い方は [ARIA と支援技術への伝え方](#aria-と支援技術への伝え方) にある。

参考にした資料:

- [Understanding SC 2.4.2 Page Titled](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html) — ページの内容を表す `title` を付ける（レベル A）。表示を切り替える作りでは `title` も更新する。
- [MDN: viewport の meta](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport) — `user-scalable=no` は拡大を妨げる。
- [Understanding SC 2.4.4 Link Purpose (In Context)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html) — リンクの文字と前後の文脈から、行き先が分かるようにする（レベル A）。
- [WCAG Techniques H64: Using the title attribute of the iframe element](https://www.w3.org/WAI/WCAG22/Techniques/html/H64) — `iframe` の中身を `title` 属性で説明する。
- [MDN: nav](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/nav) — 複数の `nav` は `aria-labelledby` で区別する。すべてのリンクを `nav` に入れる必要はない。
- [MDN: a](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a) — `href="#"` や `javascript:` のリンクを、ボタンの代わりにしない。`href` がない `a` は役割を持たない。`target="_blank"` は `rel="noopener"` と同じ動作になる。新しいタブで開くことは利用者に伝える。

### レイアウト

フォルダ: [`style/layout/`](style/layout/)

内容の量、画面の幅、文字の大きさや間隔が変わっても、内容が欠けたり重なったりしないレイアウトにするためのルール。

扱わないもの: ブレークポイントの具体的な値は、案件ごとに決める。日本語の改行の扱いは、まだルールにしていない。

参考にした資料:

- [Understanding SC 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) — 文字を 200% まで拡大できる（レベル AA）。失敗例として、`vw` の誤用（F94）と、内容の切り取り（F69）。
- [Understanding SC 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) — 行間・段落の間隔・文字の間隔・単語の間隔を広げても、内容が失われない（レベル AA）。省略記号で切り詰める場合の扱い。
- [Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — 幅 320 CSS ピクセルで、横スクロールが要らない（レベル AA）。2次元の配置が必要な内容は例外。
- [MDN: min-width](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width) — Flexbox と Grid の子要素が持つ、既定の最小の幅。スクロールする領域では 0 になる。
- [MDN: container-type](https://developer.mozilla.org/en-US/docs/Web/CSS/container-type) — `inline-size` を指定すると、幅が中身から計算されなくなる。2023年2月から主要なブラウザで使える。
- [MDN: length](https://developer.mozilla.org/en-US/docs/Web/CSS/length) — `vh` は、ツールバーが隠れたときの大きい画面を基準にする。`svh`・`dvh` との違い。
- [MDN browser-compat-data: length](https://github.com/mdn/browser-compat-data/blob/main/css/types/length.json) — `svh`・`dvh` に対応する版（Chrome 108、Firefox 101、Safari 15.4）。

### CSS の構成と適用範囲

フォルダ: [`style/structure/`](style/structure/)

スタイルが狙った対象にだけ効き、あとから足したり変えたりしても上書きの競い合いにならないようにするためのルール。適用範囲、詳細度、`!important`、状態の見た目、共通の指定を変えるときの確認を決めている。

扱わないもの: クラスの命名規則は、案件の方式の規約（BEM など）で決める。フォーカスの見た目は [キーボードとフォーカス](#キーボードとフォーカス) にある。

参考にした資料:

- [MDN: :where()](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) — `:where()` の詳細度は常に 0。
- [MDN: @layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) — レイヤーの順番は、詳細度より優先される。レイヤーに入れていない指定は、レイヤーの中の指定より優先される。`!important` を付けると、優先の順番が逆になる。
- [MDN: hover](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) — ホバーできる端末かどうかを判定するメディア特性。

### デザイントークン

フォルダ: [`style/tokens/`](style/tokens/)

色、余白、文字サイズ、角の丸みなど、デザインで繰り返し使う値のルール。値をカスタムプロパティなどのトークンとして定義し、部品からはトークンを参照する。

扱わないもの: トークンの命名規則と具体的な値は、案件ごとに決める。

参考にした資料:

- [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) — 値を1か所で定義して参照する。意味の分かる名前を付けると読みやすくなる。

### 通信と非同期処理

フォルダ: [`script/async/`](script/async/)

データの取得や送信など、結果を待つ処理のルール。待っている間・成功・空・失敗のそれぞれの表示、連打と二重送信、古い応答の扱い、処理の中断を決めている。

扱わないもの: 結果を支援技術に知らせる方法は [ARIA と支援技術への伝え方](#aria-と支援技術への伝え方)、フォーカスの移動先は [キーボードとフォーカス](#キーボードとフォーカス) にある。

参考にした資料:

- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) — 404 などの応答でも、`fetch()` は失敗にならない。`response.ok` の確かめ方。`AbortController` による中断と `AbortError`。
- [MDN: AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) — 時間切れは `TimeoutError` になる。Baseline 2024。

### セキュリティ

フォルダ: [`script/security/`](script/security/)

ブラウザで動くコードで起きやすい、安全上の問題を防ぐためのルール。外部から来たデータの HTML への挿入、URL の扱い、秘密情報、ほかのウィンドウとのやり取り、外部のスクリプトを決めている。

扱わないもの: サーバー側の対策は対象外。外部リンクの `target`・`rel` は [HTML の構造と要素の選び方](#html-の構造と要素の選び方) にある。

参考にした資料:

- [MDN: innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) — `innerHTML` は XSS の経路になる。`img` の `onerror` で実行される例。文字だけを入れるなら `textContent` を使う。
- [MDN: javascript: URL](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript) — `javascript:` の URL は、任意のコードの実行につながる。
- [MDN: eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) — 外部の影響を受ける文字列を `eval()` で実行する危険。`Function()` も同じく任意のコードを評価し、厳しい CSP では禁止される。
- [OWASP: HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html) — セッションの識別子を `localStorage` に保存しない。`postMessage` のオリジンは完全一致で確かめる。
- [MDN: postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) — 送り先のオリジンを `*` にしない。受け取ったメッセージは、送り元とデータの形を確かめる。
- [MDN: script](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script) — `integrity` 属性で改ざんを検知する。

### スクリプトの構成

フォルダ: [`script/structure/`](script/structure/)

スクリプトの読み込み方、要素の取得、初期化と後片付けの単位のルール。ページや部品が増えても、互いの処理を壊さず、不要な処理が残らないようにする。

扱わないもの: 通信など結果を待つ処理は [通信と非同期処理](#通信と非同期処理)、外部のデータの安全な扱いは [セキュリティ](#セキュリティ) にある。

参考にした資料:

- [MDN: addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) — `signal` でイベントを解除できる。`passive` でスクロールの性能が上がる。
- [MDN: script](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script) — `defer` と `async` の実行の順番。`type="module"` は、何も付けなくても遅れて実行される。

### ARIA と支援技術への伝え方

フォルダ: [`accessibility/aria/`](accessibility/aria/)

スクリーンリーダーや音声入力などの支援技術に、操作要素の役割・名前・状態と、画面上の変化を正しく伝えるためのルール。ARIA は書き方を誤ると、何も書かない場合より悪い結果になるので、使う場面を絞っている。

扱わないもの: 画像の代替テキストは [画像と動画](#画像と動画)、キーボード操作とフォーカスは [キーボードとフォーカス](#キーボードとフォーカス) にある。

参考にした資料:

- [ARIA in HTML](https://www.w3.org/TR/html-aria/) — 要素が元から持つ役割を、重ねて付けない。記号を消したリストに `role="list"` を付けるのは例外。`div`・`span` に名前を付けない。`body` に `aria-hidden="true"` を付けない。
- [Understanding SC 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) — 操作要素の名前・役割・状態と、変化の通知（レベル A）。
- [Understanding SC 2.5.3 Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html) — 見えている文字を名前に含める（レベル A）。名前の先頭に置くことも勧めている。
- [WAI-ARIA Authoring Practices: Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) — `aria-expanded` は開閉のボタンに付ける。
- [WAI-ARIA Authoring Practices: Disclosure Navigation Menu](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) — サイトのナビゲーションに `menu` の役割を使わない理由。`aria-current="page"` の使い方。
- [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) — ライブリージョンは先に置いておく。`aria-live="assertive"` は控える。
- [MDN: aria-hidden](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden) — フォーカスを受け取る要素にも、その祖先にも、`aria-hidden="true"` を付けない。

### キーボードとフォーカス

フォルダ: [`accessibility/keyboard-focus/`](accessibility/keyboard-focus/)

マウスやタッチを使わない利用者が、すべての操作にたどり着け、今どこを操作しているかを見失わないようにするためのルール。フォーカスの見た目、移動の順番、開閉や削除のあとのフォーカスの行き先を決めている。

扱わないもの: 役割・名前・状態の伝え方は [ARIA と支援技術への伝え方](#aria-と支援技術への伝え方)、画像の代替テキストは [画像と動画](#画像と動画) にある。

参考にした資料:

- [Understanding SC 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) — キーボードで操作できる（レベル A）。軌跡に依存する操作は例外。
- [Understanding SC 2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html) — 繰り返し現れる内容を飛ばす手段を用意する（レベル A）。ページの先頭に本文へのリンクを置く手法 G1。
- [Understanding SC 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) — フォーカスの順番（レベル A）。DOM の順番を見た目の順番に合わせる手法 C27。`tabindex` による失敗例 F44。
- [Understanding SC 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) — フォーカスを表示する（レベル AA）。表示を消すスタイルの失敗例 F78。
- [Understanding SC 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) — 固定表示の要素でフォーカスを隠さない（レベル AA、WCAG 2.2 で追加）。`scroll-padding` を使う手法 C43。失敗例 F110。
- [Understanding SC 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) — ホバーやフォーカスで現れる内容が満たす3つの条件（レベル AA）。ブラウザが表示する `title` 属性のツールチップは対象外。
- [MDN: forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) — 強制カラーモードでは、`box-shadow` が `none` になり、`outline-color` はシステムの色に置き換わる。
- [MDN: inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert) — `inert` を付けた要素は、フォーカス・クリック・支援技術の対象から外れる。

### 見え方と動き

フォルダ: [`accessibility/perception/`](accessibility/perception/)

色やコントラスト、操作対象の大きさ、動きの扱いのルール。見え方が人によって違う利用者や、画面の動きで体調を崩す利用者にも、情報と操作が届くようにする。

扱わないもの: フォーカスの見た目は [キーボードとフォーカス](#キーボードとフォーカス)、文字を拡大したり行間を広げたりしたときのレイアウトは [レイアウト](#レイアウト) にある。

参考にした資料:

- [Understanding SC 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) — 文字のコントラスト比は 4.5:1、大きな文字は 3:1（レベル AA）。大きな文字の目安は、太字で約 18.5px、または 24px。ロゴや無効の部品は例外。背景画像の上の文字の失敗例 F83。
- [Understanding SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) — 操作部品の境界と状態、図は 3:1（レベル AA）。無効の部品と、ブラウザ既定の見た目は例外。
- [Understanding SC 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) — 色だけで情報を伝えない（レベル A）。本文中のリンクを、周りの文字と 3:1 で区別する手法 G183。色がないとリンクと分からない失敗例 F73。
- [Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — 操作対象は 24 × 24 CSS ピクセル（レベル AA、WCAG 2.2 で追加）。間隔・同等の操作・文中・ブラウザ既定・不可欠の場合は例外。
- [Understanding SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) — 操作に伴う動きのアニメーションを止められる（レベル AAA）。`prefers-reduced-motion` を使う手法 C39・SCR40。色や透明度の変化は、動きに当たらない。
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — 動きを抑える設定を判定するメディア特性。動きを控えめな演出に置き換える例。
- [Understanding SC 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) — 自動で始まり5秒を超えて動く内容と、自動で更新される情報は、止められるようにする（レベル A）。
- [Understanding SC 2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) — 1秒間に3回を超えて点滅させない（レベル A）。

### カルーセル

フォルダ: [`patterns/carousel/`](patterns/carousel/)

スライダーやスライドショーのように、複数の内容を切り替えて見せる部品のルール。トップページのメインビジュアルや、横に送るカードの一覧を対象にしている。

前提にするルール: 自動で動く内容の止め方は [見え方と動き](#見え方と動き)、見えない要素のフォーカスは [キーボードとフォーカス](#キーボードとフォーカス)、名前の付け方は [ARIA と支援技術への伝え方](#aria-と支援技術への伝え方) に従う。

参考にした資料:

- [WAI-ARIA Authoring Practices: Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) — 切り替えを止めるボタンと、その置き場所。フォーカスやホバーの間は切り替えを止める。前後のボタン。カルーセルとスライドの名前、`aria-roledescription`。自動で切り替わる間は `aria-live` を `off` にする。
- [Understanding SC 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) — 自動で始まり5秒を超えて動く内容は、止められるようにする（レベル A）。
- [MDN: inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert) — `inert` を付けた要素は、フォーカスと支援技術の対象から外れる。

### ダイアログ

フォルダ: [`patterns/dialog/`](patterns/dialog/)

モーダルなど、ページの上に重ねて開くダイアログのルール。確認、入力、詳細の表示などに使うものを対象にしている。

前提にするルール: フォーカスの一般的な扱いは [キーボードとフォーカス](#キーボードとフォーカス)、名前と状態の伝え方は [ARIA と支援技術への伝え方](#aria-と支援技術への伝え方) に従う。

参考にした資料:

- [MDN: dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) — `showModal()` で開くと背景が inert になり、Esc で閉じられる。最初のフォーカスと、`autofocus` を付ける勧め。閉じるボタンを置く勧め。ダイアログに `tabindex` を付けない。`method="dialog"` と `closedby`。`open` 属性で開かない。
- [MDN browser-compat-data: dialog](https://github.com/mdn/browser-compat-data/blob/main/html/elements/dialog.json) — `closedby` に対応する版（Chrome 134、Firefox 141。Safari は未対応）。
- [MDN: HTMLDialogElement.returnValue](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue) — Esc で閉じたときは `returnValue` が設定されない。開くたびに初期化する例。
- [MDN: :modal](https://developer.mozilla.org/en-US/docs/Web/CSS/:modal) — `showModal()` で開いたダイアログに一致する疑似クラス。2022年9月から主要なブラウザで使える。
- [WAI-ARIA Authoring Practices: Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — 最初のフォーカス先（内容が長い場合、取り消せない操作の場合）。閉じたらフォーカスを戻す。名前の付け方。見える閉じるボタン。

### 開閉する部品

フォルダ: [`patterns/disclosure/`](patterns/disclosure/)

アコーディオン、ナビゲーションのドロップダウン、ハンバーガーメニューのように、ボタンで内容を開閉する部品のルール。

前提にするルール: フォーカスの一般的な扱いは [キーボードとフォーカス](#キーボードとフォーカス)、状態の属性は [ARIA と支援技術への伝え方](#aria-と支援技術への伝え方)、動きの抑制は [見え方と動き](#見え方と動き) に従う。

参考にした資料:

- [WAI-ARIA Authoring Practices: Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) — 開閉のボタンと、`aria-expanded` を付ける位置。`aria-controls` は任意。Enter・Space で開閉する。
- [WAI-ARIA Authoring Practices: Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) — 見出しの中にボタンを置き、見出しの中にはボタンだけを入れる構造。
- [WAI-ARIA Authoring Practices: Disclosure Navigation Menu](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) — ナビゲーションに `menu` の役割を使わない理由。`aria-current="page"`。Esc で閉じて、ボタンへフォーカスを戻す動作。
- [MDN: details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) — `name` 属性で、同じ名前の中の1つだけを開く。開閉を滑らかに動かす標準の方法はない。
- [MDN browser-compat-data: details](https://github.com/mdn/browser-compat-data/blob/main/html/elements/details.json) — `name` 属性に対応する版（Chrome 120、Firefox 130、Safari 17.2）。
- [MDN: inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert) — `inert` を付けた要素は、フォーカスと支援技術の対象から外れる。

### フォーム

フォルダ: [`patterns/form/`](patterns/form/)

問い合わせ、会員登録、検索などの入力フォームのルール。ラベル、入力の種類、エラーの伝え方、送信後の扱いを決めている。

前提にするルール: フォーカスの一般的な扱いは [キーボードとフォーカス](#キーボードとフォーカス)、名前と状態の伝え方は [ARIA と支援技術への伝え方](#aria-と支援技術への伝え方)、送信中の表示と二重送信は [通信と非同期処理](#通信と非同期処理) に従う。

参考にした資料:

- [MDN: placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/placeholder) — `placeholder` をラベルの代わりにしない理由。
- [Understanding SC 3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) — ラベルと説明（レベル A）。必須の示し方の手法 H90。`fieldset` と `legend` の手法 H71。
- [Understanding SC 1.3.5 Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html) — 利用者自身の情報を入力する欄は、目的を識別できるようにする（レベル AA）。
- [MDN: autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete) — `autocomplete` の値の一覧。`address-level1`・`address-level2` の意味。
- [MDN: input type="number"](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number) — 数量でない値には `type="number"` を使わず、`inputmode="numeric"` を使う。
- [Understanding SC 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) — エラーのある欄を特定し、文字で説明する（レベル A）。`aria-invalid` を使う手法 ARIA21。
- [Understanding SC 3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html) — 直し方を示す（レベル AA）。安全性を損なう場合は例外。

## 変更履歴

| 日付 | 変更内容 |
|---|---|
