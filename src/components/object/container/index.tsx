import type { JSX } from "preact";

type Props = JSX.IntrinsicElements["div"];

export default function Container({
  children,
  class: className,
  className: extraClass,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={["o-container", className, extraClass]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
