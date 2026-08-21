import type { ComponentChildren } from "preact";

type GridRepeat = number | "auto-fit" | "auto-fill";
type GridGap = number | string;

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
  /** PCのアイテム間の溝（縦横一括）。数値はrem換算（例: 20 → 1.25rem） */
  gap?: GridGap;
  /** PCの列方向の溝。指定時は gap を上書き */
  columnGap?: GridGap;
  /** PCの行方向の溝。指定時は gap を上書き */
  rowGap?: GridGap;
  /** SP用のカラム直接指定。未指定時はPCの値を継承 */
  layoutSp?: string;
  /** SPのカラム数 */
  repeatSp?: GridRepeat;
  /** SPのカラム最小幅 */
  minSizeSp?: string;
  /** SPのアイテム間の溝（縦横一括） */
  gapSp?: GridGap;
  /** SPの列方向の溝。未指定時は gapSp → columnGap → gap の順に継承 */
  columnGapSp?: GridGap;
  /** SPの行方向の溝。未指定時は gapSp → rowGap → gap の順に継承 */
  rowGapSp?: GridGap;
}

// 数値の場合はrem換算、文字列はそのまま
const toRem = (value: GridGap | undefined) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value / 16}rem` : value;
};

/**
 * グリッドレイアウト（装飾なしのオブジェクト）。
 *
 * `repeat` / `minSize` / `gap` などを渡すと内部のCSSカスタムプロパティに
 * マップされ、PC・SPそれぞれのカラム構成を制御できる。
 * `layout` を渡した場合は repeat 計算を無視してそのままカラム定義として使う。
 * 溝は `gap` の縦横一括指定に加え、`columnGap` / `rowGap` で方向別に上書きできる。
 *
 * @example 3カラム・溝20px
 * <Grid repeat={3} gap={20}>...</Grid>
 *
 * @example 列20px・行40pxの溝
 * <Grid repeat={3} columnGap={20} rowGap={40}>...</Grid>
 *
 * @example 最小200pxの自動折り返し、SPは1カラムで行の溝だけ詰める
 * <Grid minSize="200px" repeatSp={1} rowGapSp={16}>...</Grid>
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
  columnGap,
  rowGap,
  layoutSp,
  repeatSp,
  minSizeSp,
  gapSp,
  columnGapSp,
  rowGapSp,
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
          "--_grid-gap": toRem(gap),
          "--_grid-column-gap": toRem(columnGap),
          "--_grid-row-gap": toRem(rowGap),
          "--_grid-layout-sp": layoutSp,
          "--_grid-repeat-sp": repeatSp,
          "--_grid-min-size-sp": minSizeSp,
          "--_grid-gap-sp": toRem(gapSp),
          "--_grid-column-gap-sp": toRem(columnGapSp),
          "--_grid-row-gap-sp": toRem(rowGapSp),
        } as preact.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
