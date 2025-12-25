import { gsap } from "gsap";
import { Component, type ComponentOptions } from "../../base/Component";
import { Events, type TEventPayloads } from "../../constants/events";
import { EventEmitter } from "../../utils/EventEmitter";
import { MEDIA_SP } from "../../constants/window-size";

const INCLUDE_HEADER_HEIGHT = 65;

export class ScrollToHandler extends Component {
  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);
    this._setEventListeners();
  }

  private _setEventListeners() {
    this._handleScrollTo = this._handleScrollTo.bind(this);
    EventEmitter.on(Events.SCROLL_TO, this._handleScrollTo);
  }

  private _handleScrollTo(payload: TEventPayloads["SCROLL_TO"]) {
    const { target, options } = payload;
    const { duration, offset, needHeader} = options;

    // オフセット計算
    const isMobile = this._componentOptions?.media === MEDIA_SP;
    const scrollOffset = offset !== undefined
      ? offset
      : isMobile ? INCLUDE_HEADER_HEIGHT : 0;

    // スクロール開始イベント
    EventEmitter.emit(Events.AUTO_SCROLL, { needHeader });

    // GSAPでスクロール実行
    gsap.to(window, {
      scrollTo: { y: target, offsetY: scrollOffset },
      duration,
      ease: "power3.inOut",
      onComplete: () => {
        // スクロール完了イベント
        EventEmitter.emit(Events.AUTO_SCROLL, { needHeader: true });

        // フォーカス設定
        this._setFocusToTarget(document.querySelector(target));
      },
    });
  }

  private _setFocusToTarget(target: HTMLElement | null) {
    const targetElement = target ? target : document.documentElement;

    // 一時的にフォーカスを受け取れるようにする
    if (targetElement.tabIndex === -1) {
      targetElement.tabIndex = 0;
      targetElement.focus({ preventScroll: true });
      targetElement.removeAttribute('tabindex');
    } else {
      targetElement.focus({ preventScroll: true });
    }
  }

  public override destroy() {
    EventEmitter.off(Events.SCROLL_TO, this._handleScrollTo);
    super.destroy();
  }
}