import { gsap } from 'gsap';
import { Component, type ComponentOptions } from '../../base/Component';
import { Events, type TEventPayloads } from '../../constants/events';
import { EventEmitter } from '../../utils/EventEmitter';

export class ScrollToHandler extends Component {
  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);
    this._setEventListeners();
  }

  private _setEventListeners() {
    this._handleScrollTo = this._handleScrollTo.bind(this);
    EventEmitter.on(Events.SCROLL_TO, this._handleScrollTo);
  }

  private _handleScrollTo(payload: TEventPayloads['SCROLL_TO']) {
    const { target, options } = payload;
    const { duration, offset, offsetHeader } = options;

    const headerHeight = offsetHeader
      ? (document.querySelector<HTMLElement>('header')?.offsetHeight ?? 0)
      : 0;

    const scrollOffset = (offset ?? 0) + headerHeight;

    // GSAPでスクロール実行
    gsap.to(window, {
      scrollTo: { y: target, offsetY: scrollOffset },
      duration,
      ease: 'power3.inOut',
      onComplete: () => {
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
