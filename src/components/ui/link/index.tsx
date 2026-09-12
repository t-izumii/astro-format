import type { ComponentChildren, AnchorHTMLAttributes } from "preact";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ComponentChildren;
  href: string;
}

export default function Link({ children, ...rest }: Props) {
  return (
    <a {...rest} className="c-link">
      {children}
    </a>
  );
}
