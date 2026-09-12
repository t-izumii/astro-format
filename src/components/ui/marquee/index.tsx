import type { JSX } from "preact";

type Props = JSX.HTMLAttributes<HTMLDivElement> & {
  speed?: number;
  direction?: 1 | -1;
  pauseOnHover?: boolean;
  scrollBoost?: boolean;
};

export default function Marquee({
  children,
  speed,
  direction,
  pauseOnHover,
  scrollBoost,
  class: className,
  className: extraClass,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      data-marquee=""
      className={["c-marquee", className, extraClass].filter(Boolean).join(" ")}
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
