import type {
  HTMLAttributes,
  ImgHTMLAttributes,
  SourceHTMLAttributes,
} from "preact";
import { MIN_PC_WIDTH } from "@/scripts/constants/window-size";

interface Props extends HTMLAttributes<HTMLPictureElement> {
  img: ImgHTMLAttributes;
  sp?: SourceHTMLAttributes;
}

export default function Picture({ img, sp, ...rest }: Props) {
  return (
    <picture {...rest} className="c-picture">
      {sp && <source {...sp} media={`(width < ${MIN_PC_WIDTH}px)`} />}
      <img {...img} />
    </picture>
  );
}
