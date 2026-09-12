import type { ComponentChildren, DialogHTMLAttributes } from "preact";

interface Props extends DialogHTMLAttributes<HTMLDialogElement> {
  children: ComponentChildren;
  "data-modal-id": string;
}

export default function Modal({ children, ...rest }: Props) {
  return (
    <dialog {...rest} className="c-modal">
      <div className="c-modal__container">
        <button
          className="c-modal__close"
          data-modal-close=""
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
