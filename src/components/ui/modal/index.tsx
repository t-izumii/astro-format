import type { ComponentChildren } from "preact";

interface Props {
  children?: ComponentChildren;
  dataModalId: string;
}

export default function Modal({ children, dataModalId }: Props) {
  return (
    <dialog className="c-modal js-modal" data-modal-id={dataModalId}>
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
