import {
  toChildArray,
  type ComponentChildren,
  type HTMLAttributes,
} from "preact";

interface BreakpointOptions {
  perPage?: number;
  autoWidth?: boolean;
  gap?: string;
  arrows?: boolean;
  pagination?: boolean;
  destroy?: boolean;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ComponentChildren;
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
  overflowOnly = false,
  options = {},
  class: _class,
  className: _className,
  ...rest
}: Props) {
  const {
    type = "slide",
    perPage = 1,
    autoWidth = false,
    gap = "0",
    autoplay = false,
    // 未指定なら undefined のまま JSON から落とし、Splide 既定の 5000ms を使う
    // （0 を渡すと待ち時間なしで次へ進み続ける）
    interval,
    arrows = true,
    pagination = true,
    mediaQuery = "max",
    breakpoints = {},
  } = options;

  return (
    <div
      {...rest}
      data-carousel=""
      className="c-carousel splide"
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
        ...(autoplay && {
          // 名前は Splide が aria-label に設定する。表示文言を含める
          i18n: { play: "自動再生を開始", pause: "自動再生を一時停止" },
        }),
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
      {/* 自動で動き続ける内容には停止手段が必要。Splide が .splide__toggle を検出して制御する */}
      {autoplay && (
        <button className="c-carousel__toggle splide__toggle" type="button">
          <span className="splide__toggle__play">再生</span>
          <span className="splide__toggle__pause">一時停止</span>
        </button>
      )}
    </div>
  );
}
