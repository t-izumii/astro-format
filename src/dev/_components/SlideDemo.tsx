import Carousel from "@/components/ui/slide";

export default function SlideDemo() {
  return (
    <Carousel options={{ type: "loop", autoWidth: true, gap: "1rem" }}>
      <img
        src="https://picsum.photos/800/400?random=1"
        alt="スライド1"
        width={800}
        height={400}
      />
      <img
        src="https://picsum.photos/800/400?random=2"
        alt="スライド2"
        width={800}
        height={400}
      />
      <img
        src="https://picsum.photos/800/400?random=3"
        alt="スライド3"
        width={800}
        height={400}
      />
      <img
        src="https://picsum.photos/800/400?random=4"
        alt="スライド4"
        width={800}
        height={400}
      />
    </Carousel>
  );
}
