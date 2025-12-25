import { Component, type ComponentOptions } from "../../base/Component";
import { Events } from "../../constants/events";
import { EventEmitter } from "../../utils/EventEmitter";

export class ScrollTo extends Component {
  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);
    this._setEventListeners();
  }

  private _setEventListeners() {
    this._handleClick = this._handleClick.bind(this);
    this._addEL(this._elTarget!, "click", this._handleClick);
  }

  private _handleClick(e: PointerEvent) {
    const scrollTarget = this._elTarget?.dataset.scrollTo;

    if (scrollTarget && document.querySelector(scrollTarget)) {
      e.preventDefault();
      e.stopPropagation();

      // data属性から設定を取得
      const duration = this._elTarget?.dataset.scrollDuration
        ? parseFloat(this._elTarget.dataset.scrollDuration)
        : 1;

      const offset = this._elTarget?.dataset.scrollOffset
        ? parseFloat(this._elTarget.dataset.scrollOffset)
        : undefined;

      const needHeader = this._elTarget?.dataset.scrollNeedHeader === "true";

      // SCROLL_TOイベントをemit
      EventEmitter.emit(Events.SCROLL_TO, {
        target: scrollTarget,
        options: { duration, offset, needHeader }
      });
    }
  }

  public override destroy() {
    super.destroy();
  }
}