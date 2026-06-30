import { toChildArray, type ComponentChildren } from "preact";

interface BreakpointOptions {
  perPage?: number;
  autoWidth?: boolean;
  gap?: string;
  arrows?: boolean;
  pagination?: boolean;
  destroy?: boolean;
}

interface Props {
  children: ComponentChildren;
  className?: string;
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
  className,
  overflowOnly = false,
  options = {},
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
      className={["c-carousel", "splide", "js-carousel", className]
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
