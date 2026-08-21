import Marquee from "@/components/ui/marquee";

type Props = {
  speed?: number;
  direction?: 1 | -1;
  pauseOnHover?: boolean;
  scrollBoost?: boolean;
  withImage?: boolean;
};

const TEXTS = ["MARQUEE", "★", "ENDLESS", "★", "SCROLLING", "★"];

/** 子要素は必ずPreact側から渡す（Astroのslot経由だと1要素に潰れる） */
export default function MarqueeDemo({
  speed,
  direction,
  pauseOnHover,
  scrollBoost,
  withImage,
}: Props) {
  return (
    <Marquee
      speed={speed}
      direction={direction}
      pauseOnHover={pauseOnHover}
      scrollBoost={scrollBoost}
    >
      {TEXTS.map((text) => (
        <span key={text} className="p-catalog__marqueeItem">
          {text}
        </span>
      ))}
      {withImage && (
        <img
          className="p-catalog__marqueeItem"
          src="https://picsum.photos/240/120?random=11"
          alt="サンプル画像"
          width={240}
          height={120}
        />
      )}
      {withImage && (
        <img
          className="p-catalog__marqueeItem"
          src="https://picsum.photos/240/120?random=12"
          alt="サンプル画像"
          width={240}
          height={120}
        />
      )}
    </Marquee>
  );
}
