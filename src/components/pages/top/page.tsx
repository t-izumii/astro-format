import Picture from "@/components/ui/picture";
import Button from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import Modal from "@/components/ui/modal";

export default function Page() {
  return (
    <div>
      <h1 className="p-home__heading">TOP</h1>
      <Button data-modal-target="test">モーダルを開く</Button>
      <Modal data-modal-id="test" aria-labelledby="test-title">
        <h2 id="test-title">テストモーダル</h2>
        <p>これはテスト用のモーダルです。</p>
      </Modal>
      <Picture
        sp={{
          srcSet: "https://placehold.jp/150x150.png",
          width: 300,
          height: 200,
        }}
        img={{
          src: "https://placehold.jp/150x150.png",
          alt: "Sample Image",
          width: 600,
          height: 400,
          loading: "lazy",
        }}
      />
      <Icon name="arrow" style={{ "--icon-size": "2.5rem" }} />
      <Button>test</Button>
    </div>
  );
}
