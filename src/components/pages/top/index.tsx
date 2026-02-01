import Picture from "../../ui/picture";

export default function Pages() {
  return (
    <div>
      <h2>TOP</h2>

      <div class="o-grid" style="--_grid-layout: 1fr 10px 1fr;">
        <div class="o-grid__item">
          <h3>Item 1</h3>
        </div>
        <div class="o-grid__item">
          <h3>Item 2</h3>
        </div>
        <div class="o-grid__item">
          <h3>Item 3</h3>
        </div>
      </div>

      <Picture
        img={{
          src: "https://placehold.jp/150x150.png",
          alt: "Sample Image",
          width: 600,
          height: 400,
        }}
        sources={[
          {
            src: "https://placehold.jp/150x150.png",
            width: 300,
            height: 200,
          },
        ]}
        size={{
          width: "400px",
        }}
      />
    </div>
  );
}
