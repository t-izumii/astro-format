interface Source {
  srcset: string;
  media?: string;
  type?: string;
}

interface Props {
  src: string;
  alt: string;
  width?: number;
  widthSp?: number;
  height?: number;
  heightSp?: number;
  className?: string;
  fetchpriority?: "high" | "low" | "auto";
  loading?: "lazy" | "eager";
  sources?: Source[];
  srcset?: string;
}

export default function Picture({
  src,
  alt,
  width,
  widthSp,
  height,
  heightSp,
  className,
  fetchpriority,
  loading,
  sources,
  srcset,
}: Props) {
  const baseUrl = import.meta.env.BASE_URL || "";
  const fullSrc = src.startsWith("http") ? src : `${baseUrl}${src}`;

  const containerStyle = {
    "--width": width,
    "--width-sp": widthSp,
    "--height": height,
    "--height-sp": heightSp,
  } as preact.CSSProperties;

  return (
    <picture className={`c-picture ${className || ""}`} style={containerStyle}>
      {sources?.map((source, index) => (
        <source
          key={index}
          srcSet={
            source.srcset.startsWith("http")
              ? source.srcset
              : `${baseUrl}${source.srcset}`
          }
          media={source.media}
          type={source.type}
        />
      ))}
      <img
        src={fullSrc}
        srcSet={srcset}
        alt={alt}
        width={width}
        height={height}
        fetchpriority={fetchpriority as any}
        loading={loading}
      />
    </picture>
  );
}