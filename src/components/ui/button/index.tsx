import type { ComponentChildren, ButtonHTMLAttributes } from "preact";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ComponentChildren;
}

export default function Button({ children, type = "button", ...rest }: Props) {
  return (
    <button {...rest} type={type} className="c-button">
      {children}
    </button>
  );
}
