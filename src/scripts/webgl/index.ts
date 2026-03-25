// Core classes
export { WebGLApp } from "./Core";
export { Camera } from "./Camera";
export { Light } from "./Light";
export { DomPlane } from "./DomPlane";
export { Dom3DObject } from "./Dom3DObject";

// Utilities
export { DomPositionCalculator } from "./DomPositionCalculator";

// Types
export type {
  CreatePlaneOptions,
  Create3DObjectOptions,
  Offset3D,
  DOMPositionInfo,
} from "./types";

// Constants
export * from "./constants";

// Effects
export { PingPongBuffer } from "./effects/PingPongBuffer";

// Scenes
export { BaseScene } from "./scenes/BaseScene";

// Re-export THREE.js for convenience
import * as THREE from "three";
export { THREE };
