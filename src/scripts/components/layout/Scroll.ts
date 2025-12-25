import { throttle } from "throttle-debounce";
import { Component, type ComponentOptions } from "../../base/Component";
import { EventEmitter } from "../../utils/EventEmitter";
import { Events } from "../../constants/events";

export class Scroll extends Component {
  private _lastScroll: number | null = null;

  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    this._setEventListener();
  }

  private _setEventListener() {
    this._addEL(window, "scroll", throttle(16, this._onScroll.bind(this)));
  }

  private _onScroll() {
    const scroll = window.scrollY;

    EventEmitter.emit(Events.SCROLL, {
      scrollPosition: scroll,
      diff: this._lastScroll !== null ? scroll - this._lastScroll : 0,
    });

    this._lastScroll = scroll;
  }

  public override destroy() {
    super.destroy();
  }
}
