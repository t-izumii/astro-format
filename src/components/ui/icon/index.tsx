import type { HTMLAttributes } from "preact";

const icons = import.meta.glob<string>("./svg/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

interface Props extends HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export default function Icon({
  name,
  class: _class,
  className: _className,
  ...rest
}: Props) {
  const svgContent = icons[`./svg/${name}.svg`] || "";
  return (
    <span
      data-scope="c-icon"
      aria-hidden="true"
      {...rest}
      className="c-icon"
      // eslint-disable-next-line no-restricted-syntax -- 埋め込むのは svg/ の自前のファイルだけ
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
