import type { JSX } from "preact";

type Props = JSX.IntrinsicElements["div"];

export default function Grid({
  children,
  class: className,
  className: extraClass,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={["o-grid", className, extraClass].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
