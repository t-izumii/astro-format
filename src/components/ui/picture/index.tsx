interface SpSource {
  src: string;
  width?: number;
  height?: number;
}

interface ImgProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fetchpriority?: 'high' | 'low' | 'auto';
  loading?: 'lazy' | 'eager';
}

interface Props {
  img: ImgProps;
  sp?: SpSource;
  width?: string;
  widthSp?: string;
  className?: string;
}

export default function Picture({ img, sp, width, widthSp, className }: Props) {
  const loading = img.loading ?? 'lazy';
  const baseUrl = import.meta.env.BASE_URL || '';
  const resolvePath = (path: string) =>
    path.startsWith('http') ? path : `${baseUrl}${path}`;

  const convertToRem = (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && value === String(numValue)) {
      return `${numValue / 16}rem`;
    }
    return value;
  };

  return (
    <picture
      className={`c-picture ${className || ''}`}
      style={
        {
          '--_aspect-ratio':
            img.width && img.height
              ? `${img.width} / ${img.height}`
              : undefined,
          '--_aspect-ratio-sp':
            sp?.width && sp?.height ? `${sp.width} / ${sp.height}` : undefined,
          '--_display-width': width ? convertToRem(width) : undefined,
          '--_display-width-sp': widthSp ? convertToRem(widthSp) : undefined,
        } as preact.CSSProperties
      }
    >
      {sp && (
        <source
          srcSet={resolvePath(sp.src)}
          media="(width < 768px)"
          width={sp.width}
          height={sp.height}
        />
      )}
      <img
        src={resolvePath(img.src)}
        alt={img.alt}
        width={img.width}
        height={img.height}
        fetchpriority={img.fetchpriority as any}
        loading={loading}
      />
    </picture>
  );
}
