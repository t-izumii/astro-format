import * as THREE from "three";
import type { CreatePlaneOptions } from "./types";
import { DomPositionCalculator } from "./DomPositionCalculator";

const defaultVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const defaultFragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uResolution;
  varying vec2 vUv;

  void main() {
    vec4 texture = texture2D(uTexture, vUv);
    gl_FragColor = vec4(texture.rgb, texture.a);
  }
`;

export class DomPlane {
  element: HTMLElement | null;
  texture: THREE.Texture | null;
  mesh: THREE.Mesh;
  geometry: THREE.PlaneGeometry;
  material: THREE.ShaderMaterial;
  textureLoader: THREE.TextureLoader;
  scene: THREE.Scene;
  registerCallback: (callback: () => void) => () => void;
  clock: THREE.Clock;
  positionCalculator: DomPositionCalculator | null;
  canvasRect: DOMRect;
  isVisible: boolean;
  private observer: IntersectionObserver | null;
  private removeCallback: () => void;
  private destroyed: boolean;

  constructor(
    el: HTMLElement | null,
    scene: THREE.Scene,
    canvasRect: DOMRect,
    registerCallback: (callback: () => void) => () => void,
    options: CreatePlaneOptions = {},
  ) {
    this.element = el;
    this.scene = scene;
    this.registerCallback = registerCallback;
    this.texture = null;
    this.destroyed = false;
    this.textureLoader = new THREE.TextureLoader();
    this.textureLoader.setCrossOrigin("anonymous");
    this.clock = new THREE.Clock();
    this.canvasRect = canvasRect;
    this.positionCalculator = el ? new DomPositionCalculator(el, canvasRect) : null;

    // フルスクリーンは常に表示、DOM要素は IntersectionObserver で監視
    this.isVisible = !el;
    this.observer = null;
    if (el) {
      this.observer = new IntersectionObserver((entries) => {
        this.isVisible = entries[0].isIntersecting;
        this.mesh.visible = this.isVisible;
      });
      this.observer.observe(el);
    }

    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

    // デフォルトのuniformsとカスタムuniformsをマージ
    const uniforms = {
      uTexture: { value: null },
      uAlpha: { value: 1.0 },
      uResolution: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      ...options.uniforms,
    };

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: uniforms,
      vertexShader: options.vertexShader || defaultVertexShader,
      fragmentShader: options.fragmentShader || defaultFragmentShader,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // シーンに自動追加
    this.scene.add(this.mesh);

    this.init();

    // uTime更新とDOM要素の位置追従をWebGLAppのアニメーションループに登録
    this.removeCallback = this.registerCallback(() => {
      if (!this.isVisible) return;
      this.material.uniforms.uTime.value = this.clock.getElapsedTime();
      // 毎フレームDOM要素の位置を更新（CSSアニメーション対応）
      if (this.positionCalculator) {
        this.updatePosition();
      }
    });
  }

  private updatePosition() {
    // DOM要素の現在位置を取得
    this.positionCalculator!.updatePositionInfo();

    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    this.setPosition(scrollX, scrollY);
  }

  private init() {
    this.loadTexture();
    this.resize();
  }

  private loadTexture() {
    const texturePath = this.element?.getAttribute("data-texture");

    if (texturePath) {
      this.textureLoader.load(
        texturePath,
        (texture: THREE.Texture) => {
          if (this.destroyed) return;
          this.texture = texture;
          this.material.uniforms.uTexture.value = texture;
          this.material.needsUpdate = true;
        },
        undefined,
        (error: ErrorEvent) => {
          console.error(`Failed to load texture: ${texturePath}`, error);
        },
      );
    } else if (this.material.uniforms.uTexture.value) {
      // すでにテクスチャが設定されている場合（例：Dom3DObjectから渡された場合）
      this.texture = this.material.uniforms.uTexture.value;
    }
  }

  private updateSize() {
    if (this.positionCalculator) {
      const rect = this.positionCalculator.rect;
      this.mesh.scale.set(rect.width, rect.height, 1);
      this.material.uniforms.uResolution.value.set(rect.width, rect.height);
    } else {
      // フルスクリーン: canvasサイズに合わせる
      this.mesh.scale.set(this.canvasRect.width, this.canvasRect.height, 1);
      this.material.uniforms.uResolution.value.set(this.canvasRect.width, this.canvasRect.height);
    }
  }

  private setPosition(scrollX: number, scrollY: number) {
    if (!this.positionCalculator) return;
    const { x, y } = this.positionCalculator.calculateWebGLPosition(
      scrollX,
      scrollY,
    );
    this.mesh.position.set(x, y, 0);
  }

  public setCanvasRect(canvasRect: DOMRect) {
    this.canvasRect = canvasRect;
    if (this.positionCalculator) {
      this.positionCalculator.setCanvasRect(canvasRect);
    }
  }

  public updateScroll() {
    if (!this.positionCalculator) return;

    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // position: fixed の場合、rectを更新する必要がある
    if (this.positionCalculator.isFixed) {
      this.positionCalculator.updatePositionInfo();
    }

    this.setPosition(scrollX, scrollY);
  }

  public resize() {
    if (this.positionCalculator) {
      this.positionCalculator.refreshPositionType();
      this.positionCalculator.updatePositionInfo();

      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      this.updateSize();
      this.setPosition(scrollX, scrollY);
    } else {
      // フルスクリーン: サイズのみ更新、位置は原点固定
      this.updateSize();
      this.mesh.position.set(0, 0, 0);
    }
  }

  public getMesh() {
    return this.mesh;
  }

  public destroy() {
    this.destroyed = true;
    this.removeCallback();
    this.observer?.disconnect();
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
    if (this.texture) {
      this.texture.dispose();
    }
  }
}
