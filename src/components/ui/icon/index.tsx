import type { JSX } from "preact";

const icons = import.meta.glob<string>("./svg/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

type Props = Omit<
  JSX.IntrinsicElements["span"],
  "children" | "dangerouslySetInnerHTML"
> & { name: string };

export default function Icon({
  name,
  class: className,
  className: extraClass,
  ...rest
}: Props) {
  const svgContent = icons[`./svg/${name}.svg`] || "";
  return (
    <span
      data-scope="c-icon"
      aria-hidden="true"
      {...rest}
      className={["c-icon", className, extraClass].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
