import type { ComponentChildren } from "preact";

type Props = {
  children: ComponentChildren;
  speed?: number;
  direction?: 1 | -1;
  pauseOnHover?: boolean;
  scrollBoost?: boolean;
  class?: string;
};

export default function Marquee({
  children,
  speed,
  direction,
  pauseOnHover,
  scrollBoost,
  class: className,
}: Props) {
  return (
    <div
      className={`c-marquee js-marquee ${className ?? ""}`}
      data-speed={speed}
      data-direction={direction}
      data-pause-on-hover={pauseOnHover ? "" : undefined}
      data-scroll-boost={scrollBoost ? "" : undefined}
    >
      <div className="c-marquee__track">
        <div className="c-marquee__set">{children}</div>
      </div>
    </div>
  );
}
