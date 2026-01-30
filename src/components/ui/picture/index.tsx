// todo:改修
// media="(max-width: 767px)"を渡せる構成に変更する
// widthは単位付きで渡せるようにする

interface Props {
  src: string;
  srcSp?: string;
  alt: string;
  width?: number;
  widthSp?: number;
  height?: number;
  heightSp?: number;
  className?: string;
  fetchpriority?: "high" | "low" | "auto";
  loading?: "lazy" | "eager";
}

export default function Picture({
  src,
  srcSp,
  alt,
  width,
  widthSp,
  height,
  heightSp,
  className,
  fetchpriority,
  loading,
}: Props) {

  const baseUrl = import.meta.env.BASE_URL || "";
  const resolvePath = (path: string) =>
    path.startsWith("http") ? path : `${baseUrl}${path}`;

  return (
    <picture
      className={`c-picture ${className || ""}`}
      style={{
        "--width": width,
        "--width-sp": widthSp,
        "--height": height,
        "--height-sp": heightSp,
      } as preact.CSSProperties}
    >
      {srcSp && <source srcSet={resolvePath(srcSp)} media="(max-width: 767px)" />}
      <img
        src={resolvePath(src)}
        alt={alt}
        width={width}
        height={height}
        fetchpriority={fetchpriority as any}
        loading={loading}
      />
    </picture>
  );
}