import Stats from "stats.js";

type TTickPayload = { delta: number; fps: number };
type TTickCallback = (payload: TTickPayload) => void;

/**
 * requestAnimationFrame / fpsの一元管理クラス
 */
export class Ticker {
  private static _callbacks: Set<TTickCallback> = new Set();
  private static _rafId: number | null = null;
  private static _lastTime: number | null = null;
  private static _fps = 0;
  private static _stats: Stats | null = null;

  static get fps() {
    return Ticker._fps;
  }

  /**
   * tickの購読処理
   * @param callback
   */
  static on(callback: TTickCallback) {
    Ticker._callbacks.add(callback);

    // 開発時のみfps計測パネルを表示する
    if (import.meta.env.DEV && Ticker._stats === null) {
      Ticker._stats = new Stats();
      Ticker._stats.showPanel(0);
      document.body.appendChild(Ticker._stats.dom);
    }

    if (Ticker._rafId === null) {
      Ticker._rafId = requestAnimationFrame(Ticker._loop);
    }
  }

  /**
   * tickの購読解除処理
   * @param callback
   */
  static off(callback: TTickCallback) {
    Ticker._callbacks.delete(callback);

    if (Ticker._callbacks.size === 0 && Ticker._rafId !== null) {
      cancelAnimationFrame(Ticker._rafId);
      Ticker._rafId = null;
      Ticker._lastTime = null;
    }
  }

  private static _loop = (time: number) => {
    Ticker._stats?.begin();

    const delta = Ticker._lastTime === null ? 0 : time - Ticker._lastTime;
    Ticker._lastTime = time;
    Ticker._fps = delta > 0 ? 1000 / delta : 0;

    Ticker._callbacks.forEach((callback) => {
      callback({ delta, fps: Ticker._fps });
    });

    Ticker._stats?.end();
    Ticker._rafId = requestAnimationFrame(Ticker._loop);
  };
}
