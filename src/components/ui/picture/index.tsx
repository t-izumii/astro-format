import type { ComponentChildren, HTMLAttributes } from "preact";

interface Props extends HTMLAttributes<HTMLPictureElement> {
  children: ComponentChildren;
}

export default function Picture({ children, ...rest }: Props) {
  return (
    <picture {...rest} className="c-picture">
      {children}
    </picture>
  );
}
