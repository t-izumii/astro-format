import { Component, type ComponentOptions } from "../../base/Component";
import { Events } from "../../constants/events";
import { EventEmitter } from "../../utils/EventEmitter";

export class ModalOpen extends Component {
  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);
    this._setEventListeners();
  }

  private _setEventListeners() {
    this._handleClick = this._handleClick.bind(this);
    this._addEL(this._elTarget!, "click", this._handleClick);
  }

  private _handleClick(e: PointerEvent) {
    const id = this._elTarget?.dataset.modalTarget;

    if (!id) return;

    e.preventDefault();

    // OPEN_MODALイベントをemit（対象は data-modal-id が一致する Modal）
    EventEmitter.emit(Events.OPEN_MODAL, { id });
  }

  public override destroy() {
    super.destroy();
  }
}
