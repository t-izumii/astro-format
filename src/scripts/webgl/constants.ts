// カメラ設定
export const CAMERA_FOV = 60;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 10000;

// オフスクリーンレンダリング設定
export const OFFSCREEN_FRUSTUM_SIZE = 2;
export const OFFSCREEN_CAMERA_POSITION_Z = 5;
export const OFFSCREEN_MODEL_FIT_SIZE = 2;

// レンダーターゲット設定
export const RENDER_TARGET_SAMPLES = 4; // マルチサンプリング

// デフォルト値
export const DEFAULT_SCALE = 1;
export const DEFAULT_OFFSET = { x: 0, y: 0, z: 0 };

// ライト設定
export const AMBIENT_LIGHT_COLOR = 0xffffff;
export const AMBIENT_LIGHT_INTENSITY = 0.5;
export const DIRECTIONAL_LIGHT_COLOR = 0xffffff;
export const DIRECTIONAL_LIGHT_INTENSITY = 1.0;
export const DIRECTIONAL_LIGHT_POSITION = { x: 1, y: 1, z: 1 };
