import { Events } from "../constants/events";
import { EventEmitter } from "./EventEmitter";

export type TAssetProgress = {
  loaded: number;
  total: number;
  progress: number;
  isLoaded: boolean;
};

// loading="lazy" の画像はビューポート外で意図的に読み込みを遅延させており、
// window の load イベントを待たないため計測対象から除外する
const RESOURCE_SELECTOR =
  'img:not([loading="lazy"]), script[src], link[rel="stylesheet"], video, audio, iframe';

/**
 * ページ内アセットの読み込み進捗を計測する静的クラス。
 *
 * Resource Timing APIはリソースの読み込みが完了した時点でしか観測できず、
 * ダウンロード中の途中経過（バイト単位の連続的な進捗）は取得できない。
 * そのため合計容量（total）は読み込み完了分から推定した目安値であり、
 * 全アセット読み込み完了時に実測値と一致する。
 */
export class AssetProgress {
  private static _isInitialized = false;
  private static _isLoaded = false;
  private static _observer: PerformanceObserver | null = null;
  private static _loadedBytes = 0;
  private static _loadedCount = 0;
  private static _totalCount = 0;

  /**
   * 計測を開始する（複数回呼び出しても初回のみ実行される）
   */
  static init() {
    if (AssetProgress._isInitialized) return;
    AssetProgress._isInitialized = true;

    AssetProgress._totalCount =
      document.querySelectorAll(RESOURCE_SELECTOR).length;

    if (
      AssetProgress._totalCount === 0 ||
      typeof PerformanceObserver === "undefined"
    ) {
      AssetProgress._finalize();
      return;
    }

    AssetProgress._observer = new PerformanceObserver(
      AssetProgress._handleEntries
    );
    AssetProgress._observer.observe({ type: "resource", buffered: true });

    if (document.readyState === "complete") {
      // すでにloadイベントが発火済みの場合、bufferedエントリーの配信を
      // 待ってから確定させる
      window.requestAnimationFrame(() => AssetProgress._finalize());
    } else {
      window.addEventListener("load", () => AssetProgress._finalize(), {
        once: true,
      });
    }
  }

  /**
   * 現在の読み込み進捗を取得する
   */
  static getProgress(): TAssetProgress {
    return {
      loaded: AssetProgress._loadedBytes,
      total: AssetProgress._estimateTotalBytes(),
      progress: AssetProgress._calcProgress(),
      isLoaded: AssetProgress._isLoaded,
    };
  }

  private static _handleEntries = (list: PerformanceObserverEntryList) => {
    list.getEntries().forEach((entry) => {
      const resourceEntry = entry as PerformanceResourceTiming;
      AssetProgress._loadedBytes +=
        resourceEntry.transferSize || resourceEntry.encodedBodySize || 0;
      AssetProgress._loadedCount += 1;
    });

    EventEmitter.emit(Events.ASSET_LOAD_PROGRESS, AssetProgress.getProgress());

    if (
      !AssetProgress._isLoaded &&
      AssetProgress._totalCount > 0 &&
      AssetProgress._loadedCount >= AssetProgress._totalCount
    ) {
      AssetProgress._finalize();
    }
  };

  private static _estimateTotalBytes(): number {
    if (AssetProgress._isLoaded || AssetProgress._loadedCount === 0) {
      return AssetProgress._loadedBytes;
    }

    const averageBytes =
      AssetProgress._loadedBytes / AssetProgress._loadedCount;

    return Math.round(
      averageBytes *
        Math.max(AssetProgress._totalCount, AssetProgress._loadedCount)
    );
  }

  private static _calcProgress(): number {
    if (AssetProgress._isLoaded) return 1;
    if (AssetProgress._totalCount === 0) return 0;

    return Math.min(AssetProgress._loadedCount / AssetProgress._totalCount, 1);
  }

  private static _finalize() {
    if (AssetProgress._isLoaded) return;
    AssetProgress._isLoaded = true;

    AssetProgress._observer?.disconnect();
    AssetProgress._observer = null;

    EventEmitter.emit(Events.ASSET_LOAD_PROGRESS, AssetProgress.getProgress());
    EventEmitter.emit(Events.ASSET_LOADED, undefined);
  }
}
