import { Component, type ComponentOptions } from "../../base/Component";

export class InView extends Component {
  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    this._setEventListeners();
  }

  private _setEventListeners() {
    // IntersectionObserverの設定は少し遅らせる
    setTimeout(() => {
      const iObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this._elTarget?.classList.add(
                this._elTarget.dataset.inViewClass!
              );

              iObserver.unobserve(this._elTarget!);
            }
          });
        },
        { rootMargin: this._elTarget?.dataset.rootMargin }
      );
      iObserver.observe(this._elTarget!);
    }, 500);
  }

  public override destroy() {
    super.destroy();
  }
}
