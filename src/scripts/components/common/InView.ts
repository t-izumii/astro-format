import { Component, type ComponentOptions } from "../../base/Component";

export class InView extends Component {
  private _iObserver: IntersectionObserver | null = null;
  private _timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    this._setEventListeners();
  }

  private _setEventListeners() {
    // IntersectionObserverの設定は少し遅らせる
    this._timeoutId = setTimeout(() => {
      this._iObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const cls = this._elTarget?.dataset.inViewClass ?? "is-inView";
              this._elTarget?.classList.add(cls);
              this._iObserver?.unobserve(this._elTarget!);
            }
          });
        },
        { rootMargin: this._elTarget?.dataset.rootMargin }
      );
      if (this._elTarget) {
        this._iObserver.observe(this._elTarget);
      }
    }, 500);
  }

  protected override _onDestroy() {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    this._iObserver?.disconnect();
    this._iObserver = null;
  }
}
