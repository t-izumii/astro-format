import type { JSX } from "preact";

type Props = JSX.IntrinsicElements["dialog"] & {
  "data-modal-id": string;
};

export default function Modal({
  children,
  class: className,
  className: extraClass,
  ...rest
}: Props) {
  return (
    <dialog
      {...rest}
      className={["c-modal", "js-modal", className, extraClass]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="c-modal__container js-modalContainer">
        <button
          className="c-modal__close js-modalClose"
          type="button"
          aria-label="閉じる"
        >
          ×
        </button>
        <div className="c-modal__inner">{children}</div>
      </div>
    </dialog>
  );
}
