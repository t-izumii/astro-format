import type { TEventPayloads, TEvents } from "../constants/events";

type Listener<T extends TEvents> = (payload: TEventPayloads[T]) => void;

type Listeners<T extends TEvents> = {
  [key in T]?: Set<Listener<T>>;
};

export class EventEmitter {
  private static _listeners: Listeners<TEvents> = {};

  /**
   * イベントを購読する
   * @param event
   * @param listener
   */
  static on<T extends TEvents>(event: T, listener: Listener<T>) {
    const targetListeners = EventEmitter._listeners[event] as
      | Set<Listener<T>>
      | undefined;

    if (!targetListeners) {
      (EventEmitter._listeners as Listeners<T>)[event] = new Set([listener]);
    } else {
      targetListeners.add(listener);
    }
  }

  /**
   * イベントの購読を解除する
   * @param event
   * @param listener
   */
  static off<T extends TEvents>(event: T, listener: Listener<T>) {
    const targetListeners = EventEmitter._listeners[event] as
      | Set<Listener<T>>
      | undefined;

    targetListeners?.delete(listener);
  }

  /**
   * イベントを発火する
   *
   * 同期配信だとemitより後にonした購読者に届かない。AssetProgress.init()は
   * 計測対象0件のとき、コンストラクタ内でemitした2行下でonしている。
   * requestAnimationFrameでは1フレーム遅延、rAF内emitの次フレーム送り、
   * 背景タブでの滞留、クリック起点でのuser activation喪失が起きる。
   *
   * @param event
   * @param payload
   */
  static emit<T extends TEvents>(event: T, payload: TEventPayloads[T]) {
    queueMicrotask(() => EventEmitter._dispatch(event, payload));
  }

  /**
   * 登録済みリスナーへ実際に配信する
   *
   * SPA遷移では1つのイベントの配信中に全コンポーネントのdestroy(=off)と
   * 再生成(=on)が走る。生のSet.forEachは反復中に追加された値を訪問するため
   * 生成されたばかりのコンポーネントが自分を生んだイベントを受け取り、
   * 配列のspliceは配信中の解除で後続のリスナーが飛ばされる。
   *
   * @param event
   * @param payload
   * @returns
   */
  private static _dispatch<T extends TEvents>(
    event: T,
    payload: TEventPayloads[T]
  ) {
    const targetListeners = EventEmitter._listeners[event];

    if (!targetListeners || targetListeners.size < 1) {
      // console.error("[EventEmitter] Targets not found.", event);
      return;
    }

    Array.from(targetListeners).forEach((listener) => {
      // 配信中にdestroyされたコンポーネントのハンドラは呼ばない
      if (!targetListeners.has(listener)) return;

      try {
        listener(payload);
      } catch (e) {
        console.error(
          "EventEmitter.emit() でエラーが発生しました。\n終了したコンポーネントのイベントリスナーの登録が適切に解除されていない可能性があります。（EventEmitter.off()）"
        );
        console.error(e);
      }
    });
  }
}
