import type { DOMPositionInfo } from "./types";

/**
 * DOM要素の位置計算を担当するユーティリティクラス
 */
export class DomPositionCalculator {
  private element: HTMLElement;
  private canvasRect: DOMRect;
  private positionInfo: DOMPositionInfo;
  rect: DOMRect;

  constructor(element: HTMLElement, canvasRect: DOMRect) {
    this.element = element;
    this.canvasRect = canvasRect;
    this.rect = element.getBoundingClientRect();
    this.positionInfo = {
      pageTop: 0,
      pageLeft: 0,
      isFixed: false,
    };
    this.refreshPositionType();
    this.updatePositionInfo();
  }

  /**
   * DOM要素の位置情報を更新（毎フレーム呼ばれる）
   */
  updatePositionInfo(): void {
    this.rect = this.element.getBoundingClientRect();

    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    if (this.positionInfo.isFixed) {
      this.positionInfo.pageTop = this.rect.top;
      this.positionInfo.pageLeft = this.rect.left;
    } else {
      this.positionInfo.pageTop = this.rect.top + scrollY;
      this.positionInfo.pageLeft = this.rect.left + scrollX;
    }
  }

  /**
   * position: fixed かどうかを再チェック（初期化・リサイズ時のみ呼ぶ）
   */
  refreshPositionType(): void {
    this.positionInfo.isFixed =
      window.getComputedStyle(this.element).position === "fixed";
  }

  /**
   * WebGL座標系での位置を計算
   */
  calculateWebGLPosition(scrollX: number = 0, scrollY: number = 0): {
    x: number;
    y: number;
  } {
    let canvasCenterX: number;
    let canvasCenterY: number;

    if (this.positionInfo.isFixed) {
      // position: fixed の場合、スクロール位置を考慮しない
      canvasCenterX = this.canvasRect.left + this.canvasRect.width / 2;
      canvasCenterY = this.canvasRect.top + this.canvasRect.height / 2;
    } else {
      // 通常の場合、スクロール位置を考慮する
      canvasCenterX =
        this.canvasRect.left + scrollX + this.canvasRect.width / 2;
      canvasCenterY =
        this.canvasRect.top + scrollY + this.canvasRect.height / 2;
    }

    const x = this.positionInfo.pageLeft + this.rect.width / 2 - canvasCenterX;
    const y = -(
      this.positionInfo.pageTop +
      this.rect.height / 2 -
      canvasCenterY
    );

    return { x, y };
  }

  /**
   * Canvas矩形を更新
   */
  setCanvasRect(canvasRect: DOMRect): void {
    this.canvasRect = canvasRect;
  }

  /**
   * position: fixedかどうか
   */
  get isFixed(): boolean {
    return this.positionInfo.isFixed;
  }

  /**
   * ページトップ位置
   */
  get pageTop(): number {
    return this.positionInfo.pageTop;
  }

  /**
   * ページレフト位置
   */
  get pageLeft(): number {
    return this.positionInfo.pageLeft;
  }
}
