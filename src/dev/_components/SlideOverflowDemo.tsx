import Carousel from "@/components/ui/slide";

const renderSlides = (start: number, count: number) =>
  Array.from({ length: count }, (_, i) => {
    const n = start + i;
    return (
      <img
        key={n}
        src={`https://picsum.photos/800/400?random=${n}`}
        alt={`スライド${n}`}
        width={800}
        height={400}
      />
    );
  });

export default function SlideOverflowDemo() {
  return (
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div>
        <small>PCは複数表示 / スマホ(～900px)はloopで1画面1枚</small>
        <Carousel
          overflowOnly
          options={{
            type: "loop",
            autoWidth: true,
            gap: "1rem",
            breakpoints: {
              900: { perPage: 1, autoWidth: false },
            },
          }}
        >
          {renderSlides(3, 3)}
        </Carousel>
      </div>

      <div>
        <small>多い（はみ出すのでカルーセル化）</small>
        <Carousel
          overflowOnly
          options={{ type: "loop", autoWidth: true, gap: "1rem" }}
        >
          {renderSlides(4, 4)}
        </Carousel>
      </div>
    </div>
  );
}
