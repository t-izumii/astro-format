import * as THREE from "three";

// 共通の型定義
export interface Offset3D {
  x: number;
  y: number;
  z: number;
}

export interface CreatePlaneOptions {
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: { [key: string]: THREE.Uniform };
}

export interface Create3DObjectOptions {
  modelPath: string;
  scale?: number;
  offset?: Offset3D;
  backgroundColor?: number;
  renderTargetSize?: number;
}

export interface DOMPositionInfo {
  pageTop: number;
  pageLeft: number;
  isFixed: boolean;
}
