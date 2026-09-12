import type { ComponentChildren, HTMLAttributes } from "preact";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ComponentChildren;
}

export default function Grid({ children, ...rest }: Props) {
  return (
    <div {...rest} className="o-grid">
      {children}
    </div>
  );
}
