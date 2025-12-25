import { debounce } from "throttle-debounce";
import { Component, type ComponentOptions } from "../../base/Component";
import { EventEmitter } from "../../utils/EventEmitter";
import { Events } from "../../constants/events";
import {
  MEDIA_PC,
  MEDIA_SP,
  MIN_PC_WIDTH,
} from "../../constants/window-size";

export class WindowSize extends Component {
  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    this._setEventListener();
  }

  private _setEventListener() {
    this._addEL(window, "resize", debounce(200, this._onResize.bind(this)));
  }

  private _onResize() {
    this._componentOptions!.windowWidth = window.innerWidth;
    this._componentOptions!.windowHeight = window.innerHeight;
    (this._componentOptions!.media =
      this._componentOptions!.windowWidth >= MIN_PC_WIDTH
        ? MEDIA_PC
        : MEDIA_SP),
      EventEmitter.emit(Events.WINDOW_RESIZED, undefined);
  }

  public override destroy() {
    super.destroy();
  }
}
