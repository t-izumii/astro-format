import * as THREE from "three";
import { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR } from "./constants";

export class Camera {
  rect: DOMRect;
  instance: THREE.PerspectiveCamera | null;

  constructor(rect: DOMRect) {
    this.rect = rect;
    this.instance = null;
    this.init();
  }

  init() {
    const fovRad = (CAMERA_FOV / 2) * (Math.PI / 180);
    const distance = this.rect.height / 2 / Math.tan(fovRad);

    this.instance = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      this.rect.width / this.rect.height,
      CAMERA_NEAR,
      CAMERA_FAR,
    );

    this.instance!.position.z = distance;
  }

  resize(rect: DOMRect) {
    this.rect = rect;

    const fovRad = (CAMERA_FOV / 2) * (Math.PI / 180);
    const distance = this.rect.height / 2 / Math.tan(fovRad);

    this.instance!.aspect = rect.width / rect.height;
    this.instance!.position.z = distance;
    this.instance!.updateProjectionMatrix();
  }
}
