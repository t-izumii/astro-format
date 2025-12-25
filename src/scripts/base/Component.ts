import { MEDIA_PC, MEDIA_SP } from "../constants/window-size";

export type ComponentOptions = {
  windowWidth: number;
  windowHeight: number;
  media: typeof MEDIA_PC | typeof MEDIA_SP;
};

type EventListenerCallback = (param: any) => any;

type EventListenerTarget = {
  addEventListener: (event: any, callback: EventListenerCallback) => void;
  removeEventListener: (event: any, callback: EventListenerCallback) => void;
};

export class Component {
  protected _isDestroyed = false;
  protected _elTarget: HTMLElement | null;
  protected _componentOptions: ComponentOptions | null;

  private _eventListeners:
    | {
        target: EventListenerTarget;
        event: any;
        callback: EventListenerCallback;
      }[]
    | null = [];

  constructor(elTarget: Element, options: ComponentOptions) {
    this._elTarget = elTarget as HTMLElement;
    this._componentOptions = options;
  }

  /**
   * イベント購読処理
   * @param target
   * @param event
   * @param callback
   */
  protected _addEL(
    target: EventListenerTarget,
    event: any,
    callback: EventListenerCallback
  ) {
    this._eventListeners!.push({ target, event, callback });
    target.addEventListener(event, callback);
  }

  /**
   * イベント購読解除処理
   * @param target
   * @param event
   * @param callback
   */
  protected _removeEL(
    target: EventListenerTarget,
    event: any,
    callback: EventListenerCallback
  ) {
    target.removeEventListener(event, callback);

    // remove the listener from array
    this._eventListeners = this._eventListeners!.filter((listener) => {
      return !(
        listener.target === target &&
        listener.event === event &&
        listener.callback === callback
      );
    });
  }

  /**
   * 後始末処理
   */
  public destroy() {
    this._isDestroyed = true;

    // イベントの購読を解除
    this._eventListeners!.forEach((listener) => {
      listener.target.removeEventListener(listener.event, listener.callback);
    });
    this._eventListeners = null;

    // エレメントの参照を解除
    this._elTarget = null;

    // optionsの参照を削除
    this._componentOptions = null;
  }
}
