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
   * 配信はqueueMicrotaskで現在の同期ブロックの終了後まで遅らせる。
   * emitした直後に同じ同期ブロック内でonした購読者にも届くため、
   * 生成順への暗黙の依存が生まれない。AssetProgress.init()が計測対象
   * 0件のときコンストラクタ内から同期でemitし、その2行下でonしている
   * のが実例で、同期配信にするとローディングが永久に終わらなくなる。
   *
   * Why not requestAnimationFrame: 1フレーム遅れるうえ、rAFの中から
   * emitすると次フレーム送りになる。背景タブではrAFが止まりイベントが
   * 溜まる。クリック起点のイベントではuser activationを失い、Safariで
   * gesture依存のAPIが弾かれ得る。マイクロタスクにはいずれもない。
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
   * 配信中の購読変更に対して、次の3つを同時に満たす必要がある。
   * - 配信中にoffされても、後続のリスナーが飛ばされない
   * - 配信中にoffされたリスナーは呼ばない（破棄済みのものを叩かない）
   * - 配信中にonされたリスナーは今回の配信に混ぜない
   *
   * SPA遷移では1つのイベントの配信中に全コンポーネントのdestroy(=off)と
   * 再生成(=on)が走るため、3つとも実際に踏む。スナップショットを回しつつ
   * 呼び出し直前に在籍を確認することで満たす。
   *
   * Why not 生のSet.forEach: 反復中に追加された値を訪問するため、遷移で
   * 生成されたばかりのコンポーネントが、自分を生んだイベントを受け取る。
   * Why not 配列のsplice: 配信中の解除で後続のリスナーが飛ばされる。
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

    // event !== "TICK" && console.log("EventEmitter.emit", event);

    Array.from(targetListeners).forEach((listener) => {
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
