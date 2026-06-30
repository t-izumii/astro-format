// SVGファイルを自動でインポート (eager: true で即座にロード)
const icons = import.meta.glob<string>("./svg/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

interface IconProps {
  name: string;
  size?: number | string;
  spSize?: number | string;
  width?: number | string;
  height?: number | string;
  spWidth?: number | string;
  spHeight?: number | string;
}

export default function Icon({
  name,
  size,
  spSize,
  width,
  height,
  spWidth,
  spHeight,
}: IconProps) {
  const finalWidth = width ?? size;
  const finalHeight = height ?? size;
  const finalSpWidth = spWidth ?? spSize;
  const finalSpHeight = spHeight ?? spSize;

  const iconPath = `./svg/${name}.svg`;
  const svgContent = icons[iconPath as keyof typeof icons] || "";

  // 数値の場合はrem換算、文字列はそのまま
  const toRem = (value: number | string | undefined) => {
    if (value === undefined) return undefined;
    return typeof value === "number" ? `${value / 16}rem` : value;
  };

  return (
    <span
      className="c-icon"
      data-scope="c-icon"
      style={
        {
          "--_width": toRem(finalWidth),
          "--_height": toRem(finalHeight),
          "--_sp-width": toRem(finalSpWidth),
          "--_sp-height": toRem(finalSpHeight),
        } as preact.CSSProperties
      }
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
