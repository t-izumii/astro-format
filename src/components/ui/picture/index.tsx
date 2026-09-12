import type { JSX } from "preact";

type Props = JSX.IntrinsicElements["picture"];

export default function Picture({
  children,
  class: className,
  className: extraClass,
  ...rest
}: Props) {
  return (
    <picture
      {...rest}
      className={["c-picture", className, extraClass].filter(Boolean).join(" ")}
    >
      {children}
    </picture>
  );
}
