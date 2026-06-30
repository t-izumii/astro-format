import type { ComponentChildren } from "preact";

type GridRepeat = number | "auto-fit" | "auto-fill";

interface Props {
  children: ComponentChildren;
  className?: string;
  /** レンダリングするHTMLタグ（デフォルト: div） */
  as?: keyof preact.JSX.IntrinsicElements;
  /** カラムの直接指定（例: "1fr 100px 1fr"）。指定時は repeat 計算を無視 */
  layout?: string;
  /** PCのカラム数（数値 or "auto-fit" / "auto-fill"） */
  repeat?: GridRepeat;
  /** PCのカラム最小幅（例: "200px"） */
  minSize?: string;
  /** PCのアイテム間の溝（例: "20px"） */
  gap?: string;
  /** SP用のカラム直接指定。未指定時はPCの値を継承 */
  layoutSp?: string;
  /** SPのカラム数 */
  repeatSp?: GridRepeat;
  /** SPのカラム最小幅 */
  minSizeSp?: string;
  /** SPのアイテム間の溝 */
  gapSp?: string;
}

/**
 * グリッドレイアウト（装飾なしのオブジェクト）。
 *
 * `repeat` / `minSize` / `gap` などを渡すと内部のCSSカスタムプロパティに
 * マップされ、PC・SPそれぞれのカラム構成を制御できる。
 * `layout` を渡した場合は repeat 計算を無視してそのままカラム定義として使う。
 *
 * @example 3カラム・溝20px
 * <Grid repeat={3} gap="20px">...</Grid>
 *
 * @example 最小200pxの自動折り返し、SPは1カラム
 * <Grid minSize="200px" repeatSp={1}>...</Grid>
 *
 * @example カラムを直接指定
 * <Grid layout="1fr 100px 1fr">...</Grid>
 */
export default function Grid({
  children,
  className,
  as = "div",
  layout,
  repeat,
  minSize,
  gap,
  layoutSp,
  repeatSp,
  minSizeSp,
  gapSp,
}: Props) {
  const Tag = as as any;
  const classes = ["o-grid", className].filter(Boolean).join(" ");

  return (
    <Tag
      className={classes}
      style={
        {
          "--_grid-layout": layout,
          "--_grid-repeat": repeat,
          "--_grid-min-size": minSize,
          "--_grid-gap": gap,
          "--_grid-layout-sp": layoutSp,
          "--_grid-repeat-sp": repeatSp,
          "--_grid-min-size-sp": minSizeSp,
          "--_grid-gap-sp": gapSp,
        } as preact.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
