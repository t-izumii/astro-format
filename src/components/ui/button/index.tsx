import type { JSX } from "preact";

type Props = JSX.IntrinsicElements["button"];

export default function Button({
  children,
  class: className,
  className: extraClass,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      type={type}
      className={["c-button", className, extraClass].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
