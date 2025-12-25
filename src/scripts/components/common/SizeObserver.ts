import { debounce } from "throttle-debounce";
import { Component, type ComponentOptions } from "../../base/Component";

export class SizeObserver extends Component {
  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    this._setEventListeners();
  }

  private _setEventListeners() {
    const rObserver = new ResizeObserver(
      debounce(100, (entries: ResizeObserverEntry[]) => {
        entries.forEach((entry) => {
          entry.borderBoxSize.forEach((size) => {
            this._elTarget!.style.setProperty(
              "--width",
              `${size.inlineSize}px`
            );
            this._elTarget!.style.setProperty(
              "--height",
              `${size.blockSize}px`
            );
          });
        });
      })
    );
    rObserver.observe(this._elTarget!);
  }

  public override destroy() {
    super.destroy();
  }
}
