import { Events, type TEventPayloads } from "../constants/events";

type TEvents = keyof typeof Events;

type Listener<T extends TEvents> = (payload: TEventPayloads[T]) => void;

type Listeners<T extends TEvents> = {
  [key in T]?: Listener<T>[];
};

export class EventEmitter {
  private static _listeners: Listeners<TEvents> = {};

  /**
   * イベントを購読する
   * @param event
   * @param listener
   */
  static on<T extends TEvents>(event: T, listener: Listener<T>) {
    const targetListeners = EventEmitter._listeners[event] as Listener<T>[];

    if (!targetListeners || targetListeners.length < 1) {
      (EventEmitter._listeners as Listeners<T>)[event] = [listener];
    } else {
      targetListeners.push(listener);
    }
  }

  /**
   * イベントの購読を解除する
   * @param event
   * @param listener
   */
  static off<T extends TEvents>(event: T, listener: Listener<T>) {
    const targetListeners = EventEmitter._listeners[event] as Listener<T>[];

    if (targetListeners && targetListeners.length >= 1) {
      let targetPos = -1;
      for (let i = 0, length = targetListeners.length; i < length; i++) {
        if (targetListeners[i] === listener) {
          targetPos = i;
          break;
        }
      }

      if (targetPos >= 0) {
        targetListeners.splice(targetPos, 1);
      }
    }
  }

  /**
   * イベントを発火する
   * @param event
   * @param payload
   * @returns
   */
  static emit<T extends TEvents>(event: T, payload: TEventPayloads[T]) {
    window.requestAnimationFrame(() => {
      const targetListeners = EventEmitter._listeners[event];

      if (!targetListeners) {
        // console.error("[EventEmitter] Targets not found.", event);
        return;
      }

      // event !== "TICK" && console.log("EventEmitter.emit", event);

      targetListeners.forEach((listener) => {
        try {
          listener(payload);
        } catch (e) {
          console.error(
            "EventEmitter.emit() でエラーが発生しました。\n終了したコンポーネントのイベントリスナーの登録が適切に解除されていない可能性があります。（EventEmitter.off()）"
          );
          console.error(e);
        }
      });
    });
  }
}
