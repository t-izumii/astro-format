import { gsap } from "gsap";
import { Component, type ComponentOptions } from "../../base/Component";
import { Events, type TEventPayloads } from "../../constants/events";
import { EventEmitter } from "../../utils/EventEmitter";
import { AssetProgress } from "../../utils/AssetProgress";

const EASE_DURATION = 0;

// 実際の読み込みがどれだけ速く終わっても、ローディング表示は最低このミリ秒数は見せる
// （ローカル環境等で一瞬で終わり、チラついて見えるのを防ぐためのペーシング）
const MIN_DISPLAY_DURATION = 0;

export class AssetLoader extends Component {
  private _onAssetLoaded = this._handleAssetLoaded.bind(this);
  private _onAssetLoadProgress = this._handleAssetLoadProgress.bind(this);

  // ASSET_LOAD_PROGRESSは完了リソース単位の階段状データのため、
  // 表示用にこの値をイージングで滑らかに追従させる
  private _easedProgress = { value: 0 };
  private _startedAt = performance.now();

  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    AssetProgress.init();
    this._addEE(Events.ASSET_LOADED, this._onAssetLoaded);
    this._addEE(Events.ASSET_LOAD_PROGRESS, this._onAssetLoadProgress);
  }

  private _handleAssetLoadProgress(
    payload: TEventPayloads["ASSET_LOAD_PROGRESS"]
  ) {
    if (import.meta.env.DEV) {
      console.log(
        `[AssetLoader] progress(raw) ${Math.round(payload.progress * 100)}%`,
        payload
      );
    }

    gsap.to(this._easedProgress, {
      value: payload.progress,
      duration: EASE_DURATION,
      ease: "power2.out",
      overwrite: true,
      onUpdate: this._emitEasedProgress.bind(this),
    });
  }

  private _emitEasedProgress() {
    EventEmitter.emit(Events.ASSET_LOAD_PROGRESS_EASED, {
      progress: this._easedProgress.value,
    });

    if (import.meta.env.DEV) {
      console.log(
        `[AssetLoader] progress(eased) ${Math.round(this._easedProgress.value * 100)}%`
      );
    }
  }

  private _handleAssetLoaded() {
    const remaining =
      MIN_DISPLAY_DURATION - (performance.now() - this._startedAt);

    if (remaining <= 0) {
      this._finishLoading();
      return;
    }

    // 実読み込みが最低表示時間より速く終わった場合、100%への到達をその残り時間まで引き伸ばす
    gsap.to(this._easedProgress, {
      value: 1,
      duration: remaining / 1000,
      ease: "power2.out",
      overwrite: true,
      onUpdate: this._emitEasedProgress.bind(this),
      onComplete: this._finishLoading.bind(this),
    });
  }

  private _finishLoading() {
    if (import.meta.env.DEV) {
      console.log("[AssetLoader] loaded");
    }
    this._elTarget?.classList.add("is-loaded");
  }

  protected override _onDestroy() {
    gsap.killTweensOf(this._easedProgress);
  }
}
