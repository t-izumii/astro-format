// 動きを付けてよい条件。CSS の motion mixin と同じく no-preference の一致だけを許可し、
// 抑制指定や未対応の環境では静止状態にする
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

// 設定の変更（change）を購読するための MediaQueryList
export const getMotionQuery = (): MediaQueryList =>
  window.matchMedia(MOTION_QUERY);

// 設定は実行中に変わるため、呼び出しのたびに判定する
export const canAnimate = (): boolean => getMotionQuery().matches;
