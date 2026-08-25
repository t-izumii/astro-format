import { Component, type ComponentOptions } from "../../base/Component";
import { Events } from "../../constants/events";
import { MEDIA_PC, MEDIA_SP, MIN_PC_WIDTH } from "../../constants/window-size";
import { EventEmitter } from "../../utils/EventEmitter";

export class MediaChange extends Component {
  private _mql: MediaQueryList;

  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    // matchesがtrueならpc、falseならsp
    this._mql = window.matchMedia(`(min-width: ${MIN_PC_WIDTH}px)`);

    this._onChange = this._onChange.bind(this);
    this._mql.addEventListener("change", this._onChange);
  }

  /**
   * media(pc/sp)が切り替わったタイミングでのみ発火される
   */
  private _onChange(e: MediaQueryListEvent) {
    const media = e.matches ? MEDIA_PC : MEDIA_SP;

    this._componentOptions!.media = media;
    EventEmitter.emit(Events.MEDIA_CHANGED, { media });
  }

  protected override _onDestroy() {
    this._mql.removeEventListener("change", this._onChange);
  }
}
