import type { ComponentChildren } from 'preact';

interface Props {
  children: ComponentChildren;
  className?: string;
  /** レンダリングするHTMLタグ（デフォルト: div） */
  as?: keyof preact.JSX.IntrinsicElements;
  /** 最大幅の上書き（例: "960px"）。デフォルト 1200px */
  maxWidth?: string;
  /** 左右paddingの上書き（例: "16px"）。デフォルト 20px */
  padding?: string;
}

/**
 * 中央寄せのコンテナ（装飾なしのオブジェクト）。
 *
 * デフォルトで max-width 1200px・左右padding 20px・中央寄せ。
 * `maxWidth` / `padding` で個別に上書きできる。
 *
 * @example
 * <Container>...</Container>
 * <Container as="section" maxWidth="960px">...</Container>
 */
export default function Container({
  children,
  className,
  as = 'div',
  maxWidth,
  padding,
}: Props) {
  const Tag = as as any;
  const classes = ['o-container', className].filter(Boolean).join(' ');

  return (
    <Tag
      className={classes}
      style={
        {
          '--_container-max-width': maxWidth,
          '--_container-padding': padding,
        } as preact.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
