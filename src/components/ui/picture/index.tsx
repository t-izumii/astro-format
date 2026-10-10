import type {
  HTMLAttributes,
  ImgHTMLAttributes,
  SourceHTMLAttributes,
} from "preact";
import { MIN_PC_WIDTH } from "@/scripts/constants/window-size";

interface Props extends HTMLAttributes<HTMLPictureElement> {
  // props をオブジェクトで渡すため markuplint では検査できない。代替テキストと寸法の漏れは型で防ぐ
  img: ImgHTMLAttributes & {
    alt: string;
    width: number | string;
    height: number | string;
  };
  sp?: SourceHTMLAttributes;
}

export default function Picture({
  img,
  sp,
  class: _class,
  className: _className,
  ...rest
}: Props) {
  return (
    <picture {...rest} className="c-picture">
      {sp && <source {...sp} media={`(width < ${MIN_PC_WIDTH}px)`} />}
      <img {...img} />
    </picture>
  );
}
