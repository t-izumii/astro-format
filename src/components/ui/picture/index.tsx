import type {
  HTMLAttributes,
  ImgHTMLAttributes,
  SourceHTMLAttributes,
} from "preact";

interface Props extends HTMLAttributes<HTMLPictureElement> {
  img: ImgHTMLAttributes;
  sp?: SourceHTMLAttributes;
}

export default function Picture({ img, sp, ...rest }: Props) {
  return (
    <picture {...rest} className="c-picture">
      {sp && <source {...sp} media="(width < 768px)" />}
      <img {...img} />
    </picture>
  );
}
