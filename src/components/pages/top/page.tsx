import Picture from "../../ui/picture";
import Button from "../../ui/button";
import Icon from "@/components/ui/icon";
import Modal from "../../ui/modal";

export default function Pages() {
  return (
    <div>
      <h2>TOP</h2>

      {/* モーダル動作確認用 */}
      <button type="button" className="js-modalOpen" data-modal-target="test">
        モーダルを開く
      </button>

      <Modal dataModalId="test">
        <h3>テストモーダル</h3>
        <p>これはテスト用のモーダルです。</p>
      </Modal>

      <Picture
        img={{
          src: "https://placehold.jp/150x150.png",
          alt: "Sample Image",
          width: 600,
          height: 400,
        }}
        sp={{
          src: "https://placehold.jp/150x150.png",
          width: 300,
          height: 200,
        }}
        width="400px"
      />

      <Icon name="arrow" width={40} height={40} />
      <Button label="test" />
    </div>
  );
}
