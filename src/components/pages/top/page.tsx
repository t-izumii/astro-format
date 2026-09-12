import Picture from "@/components/ui/picture";
import Button from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import Modal from "@/components/ui/modal";

export default function Page() {
  return (
    <div>
      <h2 className="p-home__heading">TOP</h2>
      <Button data-modal-target="test">モーダルを開く</Button>
      <Modal data-modal-id="test" aria-labelledby="test-title">
        <h3 id="test-title">テストモーダル</h3>
        <p>これはテスト用のモーダルです。</p>
      </Modal>
      <Picture style={{ "--picture-width": "400px" }}>
        <source
          srcSet="https://placehold.jp/150x150.png"
          media="(width < 768px)"
          width={300}
          height={200}
        />
        <img
          src="https://placehold.jp/150x150.png"
          alt="Sample Image"
          width={600}
          height={400}
          loading="lazy"
        />
      </Picture>
      <Icon name="arrow" style={{ "--icon-size": "2.5rem" }} />
      <Button>test</Button>
    </div>
  );
}
