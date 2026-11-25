# エラーは入力欄のそばに文字で示し、入力欄と結び付ける

- 強さ: 必須
- 対象: 入力内容を検証するフォーム。
- WCAG: 3.3.1 A、3.3.3 AA

エラーがあった欄には `aria-invalid="true"` を付け、エラーの文を入力欄のそばに置いて `aria-describedby` で結び付ける。エラーの文には、何が問題で、どう直せばよいかを書く。送信時にエラーがあった場合は、最初のエラーの欄か、ページ上部に置いたエラーの一覧へフォーカスを移す。

理由: 枠を赤くするだけでは、どの欄がなぜエラーなのかが文字で伝わらない。送信してもフォーカスが動かないと、利用者はエラーが起きたことに気づかない。

例外・代替: 正しい値を示すと安全性が損なわれる場合（パスワードの照合など）は、直し方を具体的に書かなくてよい。

- 構築: エラーを直したら、`aria-invalid` を外し、エラーの文も消す。
- レビュー: わざと誤った値で送信し、エラーの欄とエラーの文が伝わるか、フォーカスがどこへ移るかを確かめる。

## サンプル: エラーの文を入力欄に結び付ける

```html
<label for="email">メールアドレス（必須）</label>
<p id="email-hint">例: name@example.com</p>
<input
  type="email"
  id="email"
  name="email"
  autocomplete="email"
  required
  aria-invalid="true"
  aria-describedby="email-hint email-error"
/>
<p id="email-error">メールアドレスに「@」が含まれていません。「name@example.com」の形で入力してください。</p>
```
