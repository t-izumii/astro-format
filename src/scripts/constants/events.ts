import type { MEDIA_PC, MEDIA_SP } from "./window-size";

export const Events = {
  // Window
  WINDOW_RESIZED: "WINDOW_RESIZED",
  MEDIA_CHANGED: "MEDIA_CHANGED",

  // Asset
  ASSET_LOAD_PROGRESS: "ASSET_LOAD_PROGRESS",
  // ASSET_LOAD_PROGRESSは完了リソース単位で階段状に更新されるため、
  // 表示用にイージングで滑らかに補間した値をこちらで別途通知する
  ASSET_LOAD_PROGRESS_EASED: "ASSET_LOAD_PROGRESS_EASED",
  ASSET_LOADED: "ASSET_LOADED",

  // // Content
  // CONTENT_RESIZED: "CONTENT_RESIZED",

  // Scroll
  SCROLL_STATE_CHANGE: "SCROLL_STATE_CHANGE",
  SCROLL: "SCROLL",
  SCROLL_TO: "SCROLL_TO",
  SCROLL_STOPPED: "SCROLL_STOPPED",

  // Modal
  OPEN_MODAL: "OPEN_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL",

  // TOP Hello
  CHANGE_TOP_HELLO_ANIMATION: "CHANGE_TOP_HELLO_ANIMATION",
} as const;

export type TEvents = keyof typeof Events;

export type TEventPayloads = {
  WINDOW_RESIZED: undefined;
  MEDIA_CHANGED: { media: typeof MEDIA_PC | typeof MEDIA_SP };
  ASSET_LOAD_PROGRESS: { loaded: number; total: number; progress: number };
  ASSET_LOAD_PROGRESS_EASED: { progress: number };
  ASSET_LOADED: undefined;
  // CONTENT_RESIZED: { isHorizontal: boolean, isVertical: boolean };
  SCROLL_STATE_CHANGE: { needsStop: boolean };
  SCROLL: { scrollPosition: number; diff: number };
  SCROLL_TO: {
    target: string;
    options: {
      duration: number;
      offset?: number;
      offsetHeader: boolean;
    };
  };
  SCROLL_STOPPED: undefined;
  CHANGE_TOP_HELLO_ANIMATION: { no: number; dir: "normal" | "inverse" };
  OPEN_MODAL: { id: string; onClose?: () => void };
  CLOSE_MODAL: { id: string };
};
