import {
  disablePageScroll,
  enablePageScroll,
  markScrollable,
} from '@fluejs/noscroll';
import { Component, type ComponentOptions } from '../../base/Component';
import { Events, type TEventPayloads } from '../../constants/events';
import { EventEmitter } from '../../utils/EventEmitter';

export class Modal extends Component {
  private _dialog: HTMLDialogElement;
  private _closeButton: HTMLElement | null | undefined;
  private _onCloseCallback?: () => void;

  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    this._dialog = this._elTarget as HTMLDialogElement;
    this._closeButton = this._elTarget?.querySelector('.js-modalClose');

    markScrollable(this._dialog);

    this._setEventListeners();
  }

  private _setEventListeners() {
    this._handleOpen = this._handleOpen.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleBackdropClick = this._handleBackdropClick.bind(this);
    this._handleDialogClose = this._handleDialogClose.bind(this);

    EventEmitter.on(Events.OPEN_MODAL, this._handleOpen);
    if (this._closeButton) {
      this._addEL(this._closeButton, 'click', this._handleCloseClick);
    }
    this._addEL(this._dialog, 'click', this._handleBackdropClick);
    this._addEL(this._dialog, 'close', this._handleDialogClose);
  }

  /**
   * モーダルを開く
   * @param payload - イベントペイロード
   * @param payload.id - 対象モーダルのdata-modal-id
   * @param payload.onClose - 閉じた後に実行されるコールバック
   */
  private _handleOpen(payload: TEventPayloads['OPEN_MODAL']) {
    if (this._dialog.dataset.modalId !== payload.id) return;

    this._onCloseCallback = payload.onClose;
    document.body.classList.add('is-modalOpen');
    disablePageScroll();
    this._dialog.showModal();
  }

  private _handleCloseClick() {
    this._dialog.close();
  }

  private _handleBackdropClick(e: MouseEvent) {
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
    document.body.classList.remove('is-modalOpen');
    enablePageScroll();
    this._onCloseCallback?.();
    this._onCloseCallback = undefined;
  }

  public override destroy() {
    if (this._dialog.open) enablePageScroll();
    EventEmitter.off(Events.OPEN_MODAL, this._handleOpen);
    super.destroy();
  }
}
