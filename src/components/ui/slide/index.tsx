import { toChildArray, type JSX } from "preact";

interface BreakpointOptions {
  perPage?: number;
  autoWidth?: boolean;
  gap?: string;
  arrows?: boolean;
  pagination?: boolean;
  destroy?: boolean;
}

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  overflowOnly?: boolean;
  options?: {
    type?: "slide" | "loop";
    perPage?: number;
    autoWidth?: boolean;
    gap?: string;
    autoplay?: boolean;
    interval?: number;
    arrows?: boolean;
    pagination?: boolean;
    mediaQuery?: "min" | "max";
    breakpoints?: Record<number, BreakpointOptions>;
  };
}

export default function Carousel({
  children,
  class: className,
  className: extraClass,
  overflowOnly = false,
  options = {},
  ...rest
}: Props) {
  const {
    type = "slide",
    perPage = 1,
    autoWidth = false,
    gap = "0",
    autoplay = false,
    interval = 0,
    arrows = true,
    pagination = true,
    mediaQuery = "max",
    breakpoints = {},
  } = options;

  return (
    <div
      {...rest}
      data-carousel=""
      className={["c-carousel", "splide", className, extraClass]
        .filter(Boolean)
        .join(" ")}
      data-overflow-only={overflowOnly ? "true" : undefined}
      data-splide={JSON.stringify({
        type,
        perPage,
        autoWidth,
        gap,
        autoplay,
        interval,
        arrows,
        pagination,
        mediaQuery,
        breakpoints,
      })}
    >
      <div className="splide__track">
        <ul className="splide__list">
          {toChildArray(children).map((child, index) => (
            <li className="c-carousel__slide splide__slide" key={index}>
              {child}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
