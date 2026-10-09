import {
  disablePageScroll,
  enablePageScroll,
  markScrollable,
} from "@fluejs/noscroll";
import { Component, type ComponentOptions } from "@/scripts/base/Component";
import { Events, type TEventPayloads } from "@/scripts/constants/events";

export class Modal extends Component {
  private _dialog: HTMLDialogElement;
  private _onCloseCallback?: () => void;

  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    this._dialog = this._elTarget as HTMLDialogElement;

    markScrollable(this._dialog);

    this._setEventListeners();
  }

  private _setEventListeners() {
    this._handleOpen = this._handleOpen.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleDialogClose = this._handleDialogClose.bind(this);

    this._addEE(Events.OPEN_MODAL, this._handleOpen);
    this._addEL(this._dialog, "click", this._handleClick);
    this._addEL(this._dialog, "close", this._handleDialogClose);
  }

  /**
   * モーダルを開く
   * @param payload - イベントペイロード
   * @param payload.id - 対象モーダルのdata-modal-id
   * @param payload.onClose - 閉じた後に実行されるコールバック
   */
  private _handleOpen(payload: TEventPayloads["OPEN_MODAL"]) {
    if (this._dialog.dataset.modalId !== payload.id) return;

    this._onCloseCallback = payload.onClose;
    document.body.classList.add("is-modalOpen");
    disablePageScroll();
    this._dialog.showModal();
  }

  /**
   * 閉じるボタンと背景のクリックを1つのリスナーで処理する
   * 閉じるボタンは利用側がchildrenに置いたものも含めて委譲で拾う
   */
  private _handleClick(e: MouseEvent) {
    const target = e.target as Element;

    if (target.closest("[data-modal-close]")) {
      this._dialog.close();
      return;
    }

    // 子孫からのclickは対象外にする。キーボード起点のclickは座標が0になり得るため、
    // 座標判定だけだと内側のボタン操作で閉じてしまう
    if (target !== this._dialog) return;

    // dialog自身へのclickは、背景(::backdrop)か内容のない余白のどちらか
    const rect = this._dialog.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;

    if (isOutside) {
      this._dialog.close();
    }
  }

  /**
   * モーダルが閉じた後の処理
   */
  private _handleDialogClose() {
    document.body.classList.remove("is-modalOpen");
    enablePageScroll();
    this._onCloseCallback?.();
    this._onCloseCallback = undefined;
  }

  protected override _onDestroy() {
    if (this._dialog.open) enablePageScroll();
  }
}
