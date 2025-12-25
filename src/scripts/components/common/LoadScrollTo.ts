import { Component, type ComponentOptions } from "../../base/Component";
import { Events } from "../../constants/events";
import { EventEmitter } from "../../utils/EventEmitter";

export class LoadScrollTo extends Component {
  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);
    this._setEventListeners();
  }

  private _setEventListeners() {
    this._addEL(window, "load", this._handleLoad.bind(this));
  }

  private _handleLoad() {
    const url = new URL(window.location.href);
    const target = url.hash;

    if (target && document.querySelector(target)) {
      // SCROLL_TOイベントをemit
      EventEmitter.emit(Events.SCROLL_TO, {
        target: target,
        options: { duration: 1, needHeader: false }
      });
    }
  }

  public override destroy() {
    super.destroy();
  }
}