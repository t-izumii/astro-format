import { debounce } from "throttle-debounce";
import { Component, type ComponentOptions } from "../../base/Component";

export class SizeObserver extends Component {
  private _rObserver: ResizeObserver | null = null;

  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    this._setEventListeners();
  }

  private _setEventListeners() {
    if (!this._elTarget) return;

    this._rObserver = new ResizeObserver(
      debounce(100, (entries: ResizeObserverEntry[]) => {
        // debounce の待ち時間中に destroy されると要素の参照は null になる
        const el = this._elTarget;
        if (!el) return;

        entries.forEach((entry) => {
          entry.borderBoxSize.forEach((size) => {
            el.style.setProperty(
              "--size-observer-width",
              `${size.inlineSize}px`
            );
            el.style.setProperty(
              "--size-observer-height",
              `${size.blockSize}px`
            );
          });
        });
      })
    );
    this._rObserver.observe(this._elTarget);
  }

  protected override _onDestroy() {
    this._rObserver?.disconnect();
    this._rObserver = null;
  }
}
