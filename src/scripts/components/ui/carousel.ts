import Splide, { type Options } from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { Component, type ComponentOptions } from "../../base/Component";

export class Carousel extends Component {
  private _splide: Splide | null = null;

  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);
    this._init();
  }

  private _init() {
    const splideOptions = this._getOptions();
    const splide = new Splide(this._elTarget as HTMLElement, splideOptions);

    // data-overflow-only: はみ出した時だけカルーセル化（収まる時はただの横並び）
    if (this._elTarget?.dataset.overflowOnly === "true") {
      splide.on("overflow", (isOverflow: boolean) => {
        splide.go(0); // 位置をリセット
        splide.options = {
          arrows: isOverflow,
          pagination: isOverflow,
          drag: isOverflow,
          // type:"loop"のクローンをトグル（収まる時は0にして横並びにする）
          clones: isOverflow ? undefined : 0,
        };
      });
    }

    this._splide = splide.mount();
  }

  private _getOptions(): Options {
    const dataOptions = this._elTarget?.dataset.splide;

    if (dataOptions) {
      try {
        return JSON.parse(dataOptions) as Options;
      } catch {
        console.warn("Invalid splide options:", dataOptions);
      }
    }

    return {};
  }

  /**
   * 指定のスライドへ移動
   */
  public go(index: number) {
    this._splide?.go(index);
  }

  /**
   * 自動再生を開始
   */
  public play() {
    this._splide?.Components.Autoplay?.play();
  }

  /**
   * 自動再生を停止
   */
  public pause() {
    this._splide?.Components.Autoplay?.pause();
  }

  /**
   * オプションを更新
   */
  public refresh() {
    this._splide?.refresh();
  }

  public override destroy() {
    this._splide?.destroy();
    this._splide = null;
    super.destroy();
  }
}
