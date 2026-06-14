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

/**
 * レスポンシブ画像コンポーネント。
 *
 * - `sp` を渡すと768px未満でSP向け画像に切り替わる
 * - `img.width` / `img.height` を渡すとアスペクト比が自動設定され、CLSを防ぐ
 * - `width` は数値のみの文字列（例: "320"）を渡すとpx→rem変換される
 *
 * @example 基本
 * <Picture img={{ src: 'assets/images/sample.png', alt: 'サンプル', width: 800, height: 600 }} width="100%" />
 *
 * @example SP画像を差し替え
 * <Picture
 *   img={{ src: 'assets/images/hero-pc.png', alt: 'ヒーロー', width: 1440, height: 800 }}
 *   sp={{ src: 'assets/images/hero-sp.png', width: 750, height: 1000 }}
 *   width="100%"
 * />
 *
 * @example LCP対象（優先読み込み）
 * <Picture img={{ src: 'assets/images/kv.jpg', alt: 'KV', fetchpriority: 'high', loading: 'eager' }} width="100%" />
 */
export default function Picture({ img, sp, width, widthSp, className }: Props) {
  const loading = img.loading ?? 'lazy';
  const baseUrl = import.meta.env.BASE_URL || '';
  const resolvePath = (path: string) =>
    path.startsWith('http') ? path : `${baseUrl}${path}`;

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
          '--_display-width': width ?? undefined,
          '--_display-width-sp': widthSp ?? undefined,
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
