import type { ComponentChildren, HTMLAttributes } from "preact";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ComponentChildren;
}

export default function Container({ children, ...rest }: Props) {
  return (
    <div {...rest} className="o-container">
      {children}
    </div>
  );
}
