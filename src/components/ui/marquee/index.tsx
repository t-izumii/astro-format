import type { ComponentChildren, HTMLAttributes } from "preact";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ComponentChildren;
  speed?: number;
  direction?: 1 | -1;
  pauseOnHover?: boolean;
  scrollBoost?: boolean;
}

export default function Marquee({
  children,
  speed,
  direction,
  pauseOnHover,
  scrollBoost,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      data-marquee=""
      className="c-marquee"
      data-speed={speed}
      data-direction={direction}
      data-pause-on-hover={pauseOnHover ? "" : undefined}
      data-scroll-boost={scrollBoost ? "" : undefined}
    >
      <div className="c-marquee__track">
        <div className="c-marquee__set" data-marquee-set="">
          {children}
        </div>
      </div>
    </div>
  );
}
