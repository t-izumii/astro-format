export const Events = {
  // Window
  WINDOW_RESIZED: "WINDOW_RESIZED",

  // // Content
  // CONTENT_RESIZED: "CONTENT_RESIZED",

  // Scroll
  SCROLL_STATE_CHANGE: "SCROLL_STATE_CHANGE",
  SCROLL: "SCROLL",
  SCROLL_TO: "SCROLL_TO",
  SCROLL_STOPPED: "SCROLL_STOPPED",
  AUTO_SCROLL: "AUTO_SCROLL",

  // Modal
  OPEN_MODAL: "OPEN_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL",

  // TOP Hello
  CHANGE_TOP_HELLO_ANIMATION: "CHANGE_TOP_HELLO_ANIMATION",
} as const;

export type TEventPayloads = {
  WINDOW_RESIZED: undefined;
  // CONTENT_RESIZED: { isHorizontal: boolean, isVertical: boolean };
  SCROLL_STATE_CHANGE: { needsStop: boolean };
  SCROLL: { scrollPosition: number; diff: number };
  SCROLL_TO: {
    target: string;
    options: {
      duration: number;
      offset?: number;
      needHeader: boolean;
    };
  };
  AUTO_SCROLL: { needHeader: boolean };
  SCROLL_STOPPED: undefined;
  CHANGE_TOP_HELLO_ANIMATION: { no: number; dir: "normal" | "inverse" };
  OPEN_MODAL: { id: string };
  CLOSE_MODAL: { id: string };
};
