import type { JSX } from "preact";

type Props = JSX.IntrinsicElements["a"] & { href: string };

export default function Link({
  children,
  class: className,
  className: extraClass,
  ...rest
}: Props) {
  return (
    <a
      {...rest}
      className={["c-link", className, extraClass].filter(Boolean).join(" ")}
    >
      {children}
    </a>
  );
}
