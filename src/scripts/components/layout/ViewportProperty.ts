import { Component, type ComponentOptions } from "../../base/Component";

/**
 * ビューポート高さ関連のカスタムプロパティを :root に設定するコンポーネント。
 *
 * iOS 26 Safari（Liquid Glass UI）ではタブモードやアドレスバー展開状態で
 * `window.innerHeight` が変動し、`100vh` が `window.outerHeight` 基準になる。
 * 旧 iOS や他ブラウザと挙動を統一するため、JS で高さ系の値を算出して
 * document.documentElement にカスタムプロパティとして書き出す。
 */
export class ViewportProperty extends Component {
  /** rAF 間引き用のフレーム ID */
  private _rafId: number | null = null;
  /** orientationchange 後の再計測用タイマー ID */
  private _orientationTimerId: ReturnType<typeof setTimeout> | null = null;

  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    // 即時 1 回実行
    this._update();
    this._setEventListener();
  }

  private _setEventListener() {
    this._addEL(window, "resize", this._onUpdate.bind(this));
    this._addEL(
      window,
      "orientationchange",
      this._onOrientationChange.bind(this)
    );

    // ソフトキーボード等による visualViewport の変化にも追随する
    if (window.visualViewport) {
      this._addEL(window.visualViewport, "resize", this._onUpdate.bind(this));
    }
  }

  /**
   * rAF ベースの間引き。連続発火しても 1 フレーム 1 回に抑える。
   */
  private _onUpdate() {
    if (this._rafId !== null) return;

    this._rafId = window.requestAnimationFrame(() => {
      this._rafId = null;
      this._update();
    });
  }

  /**
   * orientationchange 直後は値が確定していないことがあるため、
   * 即時更新に加えて少し遅延させた再計測も行う。
   */
  private _onOrientationChange() {
    this._onUpdate();

    if (this._orientationTimerId !== null) {
      clearTimeout(this._orientationTimerId);
    }
    this._orientationTimerId = setTimeout(() => {
      this._orientationTimerId = null;
      this._update();
    }, 300);
  }

  /**
   * iOS / iPadOS 判定。iPadOS の Mac 偽装 UA も考慮する。
   */
  private _isIOS(): boolean {
    const ua = navigator.userAgent;
    const isIOSUA = /iPad|iPhone|iPod/.test(ua);
    // iPadOS は "Macintosh" を名乗るため maxTouchPoints で判別する
    const isIPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;

    return isIOSUA || isIPadOS;
  }

  /**
   * カスタムプロパティを :root に設定する。
   */
  private _update() {
    const root = document.documentElement;
    const innerHeight = window.innerHeight;

    // フルスクリーン高さ。iOS では outerHeight が常に画面全体を指すので採用。
    // 非 iOS では outerHeight がブラウザ chrome 全体を含み page 領域より
    // 大きくなるため innerHeight にフォールバックする。
    const fullscreenHeight = this._isIOS() ? window.outerHeight : innerHeight;

    // 定番の 1vh 相当値
    const vh = innerHeight * 0.01;

    // ソフトキーボード対応。非対応環境では innerHeight にフォールバック。
    const visualViewportHeight = window.visualViewport?.height ?? innerHeight;

    root.style.setProperty("--fullscreen-height", `${fullscreenHeight}px`);
    root.style.setProperty("--vh", `${vh}px`);
    root.style.setProperty(
      "--visual-viewport-height",
      `${visualViewportHeight}px`
    );
  }

  public override destroy() {
    if (this._rafId !== null) {
      window.cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    if (this._orientationTimerId !== null) {
      clearTimeout(this._orientationTimerId);
      this._orientationTimerId = null;
    }

    super.destroy();
  }
}
