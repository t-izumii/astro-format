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
    const target = this._getHashSelector(window.location.hash);

    if (target && document.querySelector(target)) {
      // SCROLL_TOイベントをemit
      EventEmitter.emit(Events.SCROLL_TO, {
        target: target,
        options: { duration: 1, offsetHeader: false },
      });
    }
  }

  private _getHashSelector(hash: string): string | null {
    if (hash.length <= 1) return null;

    try {
      return `#${CSS.escape(decodeURIComponent(hash.slice(1)))}`;
    } catch {
      return null;
    }
  }
}
