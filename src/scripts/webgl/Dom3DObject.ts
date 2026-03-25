import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DomPlane } from "./DomPlane";
import { Light } from "./Light";
import type { Create3DObjectOptions } from "./types";
import {
  OFFSCREEN_FRUSTUM_SIZE,
  OFFSCREEN_CAMERA_POSITION_Z,
  OFFSCREEN_MODEL_FIT_SIZE,
  RENDER_TARGET_SAMPLES,
  DEFAULT_SCALE,
  DEFAULT_OFFSET,
} from "./constants";

export class Dom3DObject {
  element: HTMLElement | null;
  model: THREE.Group | null;
  loader: GLTFLoader;
  mainScene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  canvasRect: DOMRect;
  registerCallback: (callback: () => void) => () => void;
  options: Create3DObjectOptions;
  originalSize: THREE.Vector3 | null = null;
  isVisible: boolean;
  needsRender: boolean;
  private observer: IntersectionObserver | null;
  private removeCallback: (() => void) | null;
  private destroyed: boolean;

  // オフスクリーンレンダリング用
  offscreenScene: THREE.Scene;
  offscreenCamera: THREE.OrthographicCamera;
  offscreenLight: Light | null = null;
  renderTarget: THREE.WebGLRenderTarget;
  domPlane: DomPlane | null = null;

  constructor(
    el: HTMLElement | null,
    mainScene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    canvasRect: DOMRect,
    registerCallback: (callback: () => void) => () => void,
    options: Create3DObjectOptions,
  ) {
    this.element = el;
    this.mainScene = mainScene;
    this.renderer = renderer;
    this.canvasRect = canvasRect;
    this.registerCallback = registerCallback;
    this.model = null;
    this.loader = new GLTFLoader();
    this.options = {
      scale: DEFAULT_SCALE,
      offset: DEFAULT_OFFSET,
      backgroundColor: undefined,
      renderTargetSize: undefined,
      ...options,
    };

    // DOM要素がある場合のみオフスクリーンレンダリングをセットアップ
    this.isVisible = !el;
    this.needsRender = true;
    this.destroyed = false;
    this.observer = null;
    this.removeCallback = null;
    if (this.hasElement() && el) {
      this.setupOffscreenRendering();
      this.removeCallback = registerCallback(() => this.renderOffscreen());

      this.observer = new IntersectionObserver((entries) => {
        this.isVisible = entries[0].isIntersecting;
      });
      this.observer.observe(el);
    }

    this.init();
  }

  private init() {
    this.loadModel();
  }

  /**
   * DOM要素を持っているか
   */
  private hasElement(): boolean {
    return this.element !== null;
  }

  /**
   * オフスクリーンレンダリングのセットアップ
   */
  private setupOffscreenRendering(): void {
    if (!this.element) return;

    const rect = this.element.getBoundingClientRect();

    // オフスクリーンシーンとカメラの初期化
    this.offscreenScene = new THREE.Scene();
    this.offscreenScene.background =
      this.options.backgroundColor !== undefined
        ? new THREE.Color(this.options.backgroundColor)
        : null;

    // 正射投影カメラ（正面から撮影）
    this.offscreenCamera = new THREE.OrthographicCamera(
      -OFFSCREEN_FRUSTUM_SIZE / 2,
      OFFSCREEN_FRUSTUM_SIZE / 2,
      OFFSCREEN_FRUSTUM_SIZE / 2,
      -OFFSCREEN_FRUSTUM_SIZE / 2,
      0.1,
      1000,
    );
    this.offscreenCamera.position.set(0, 0, OFFSCREEN_CAMERA_POSITION_Z);
    this.offscreenCamera.lookAt(0, 0, 0);

    // レンダーターゲットのサイズを決定
    const rtWidth =
      this.options.renderTargetSize ||
      Math.ceil(rect.width * window.devicePixelRatio);
    const rtHeight =
      this.options.renderTargetSize ||
      Math.ceil(rect.height * window.devicePixelRatio);

    // レンダーターゲットの作成（マルチサンプリング対応）
    this.renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      samples: RENDER_TARGET_SAMPLES,
      colorSpace: THREE.SRGBColorSpace,
    });

    // ライトを追加
    this.offscreenLight = new Light(this.offscreenScene);
  }

  private loadModel() {
    const modelPath =
      this.element?.getAttribute("data-model") || this.options.modelPath;

    if (!modelPath) {
      console.error("Dom3DObject: modelPath が指定されていません。data-model 属性または options.modelPath を設定してください。");
      return;
    }

    this.loader.load(
      modelPath,
      (gltf: GLTF) => {
        if (this.destroyed) return;
        this.model = gltf.scene;
        this.setupModelByMode();
      },
      undefined,
      (error: ErrorEvent) => {
        console.error(`Failed to load model: ${modelPath}`, error);
      },
    );
  }

  /**
   * モード別にモデルをセットアップ
   */
  private setupModelByMode(): void {
    if (!this.model) return;

    if (this.hasElement()) {
      this.setupOffscreenModel();
    } else {
      this.setupStandaloneModel();
    }
  }

  /**
   * オフスクリーンモード用のモデルセットアップ
   */
  private setupOffscreenModel(): void {
    if (!this.model) return;

    // モデルのサイズを取得
    const box = new THREE.Box3().setFromObject(this.model);
    this.originalSize = new THREE.Vector3();
    box.getSize(this.originalSize);

    // モデルを中心に配置
    const center = new THREE.Vector3();
    box.getCenter(center);
    this.model.position.set(-center.x, -center.y, -center.z);

    // グループに入れる
    const group = new THREE.Group();
    group.add(this.model);
    this.model = group;

    // オフスクリーンシーンに追加
    this.offscreenScene.add(this.model);

    // スケール調整
    this.updateModelScale();

    // DomPlane作成
    this.createDomPlane();
  }

  /**
   * スタンドアロンモード用のモデルセットアップ
   */
  private setupStandaloneModel(): void {
    if (!this.model) return;

    // メインシーンに追加
    this.mainScene.add(this.model);

    // スケールとオフセット適用
    const scale = this.options.scale || DEFAULT_SCALE;
    this.model.scale.set(scale, scale, scale);

    if (this.options.offset) {
      this.model.position.set(
        this.options.offset.x,
        this.options.offset.y,
        this.options.offset.z,
      );
    }
  }

  private updateModelScale() {
    if (!this.model || !this.originalSize) return;

    const maxSize = Math.max(this.originalSize.x, this.originalSize.y);
    const scale =
      (OFFSCREEN_MODEL_FIT_SIZE / maxSize) *
      (this.options.scale || DEFAULT_SCALE);

    this.model.scale.set(scale, scale, scale);
  }

  private createDomPlane() {
    if (!this.element) return;

    // シンプルなフラグメントシェーダー（テクスチャをそのまま表示）
    const fragmentShader = `
      uniform sampler2D uTexture;
      varying vec2 vUv;

      void main() {
        vec4 texture = texture2D(uTexture, vUv);
        gl_FragColor = texture;
      }
    `;

    // DomPlaneを作成し、レンダーターゲットのテクスチャを適用
    this.domPlane = new DomPlane(
      this.element,
      this.mainScene,
      this.canvasRect,
      this.registerCallback,
      {
        uniforms: {
          uTexture: new THREE.Uniform(this.renderTarget.texture),
        },
        fragmentShader: fragmentShader,
      },
    );
  }

  private renderOffscreen() {
    if (!this.hasElement() || !this.model || !this.isVisible || !this.needsRender) return;

    const currentRenderTarget = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.offscreenScene, this.offscreenCamera);
    this.renderer.setRenderTarget(currentRenderTarget);

    this.needsRender = false;
  }

  public markNeedsRender() {
    this.needsRender = true;
  }

  public setCanvasRect(canvasRect: DOMRect) {
    this.canvasRect = canvasRect;

    if (this.domPlane) {
      this.domPlane.setCanvasRect(canvasRect);
    }
  }

  public updateScroll() {
    if (this.domPlane) {
      this.domPlane.updateScroll();
    }
  }

  public resize() {
    if (!this.element) return;

    const rect = this.element.getBoundingClientRect();

    // レンダーターゲットのサイズを更新
    if (!this.options.renderTargetSize) {
      const rtWidth = Math.ceil(rect.width * window.devicePixelRatio);
      const rtHeight = Math.ceil(rect.height * window.devicePixelRatio);

      // サイズが変わった場合のみレンダーターゲットを再作成
      if (
        this.renderTarget.width !== rtWidth ||
        this.renderTarget.height !== rtHeight
      ) {
        this.renderTarget.dispose();
        this.renderTarget.setSize(rtWidth, rtHeight);

        // DomPlaneのテクスチャを更新
        if (this.domPlane) {
          this.domPlane.material.uniforms.uTexture.value =
            this.renderTarget.texture;
          this.domPlane.material.needsUpdate = true;
        }
      }
    }

    if (this.domPlane) {
      this.domPlane.resize();
    }

    this.markNeedsRender();
  }

  public getModel() {
    return this.model;
  }

  public getDomPlane() {
    return this.domPlane;
  }

  public destroy() {
    this.destroyed = true;
    this.removeCallback?.();
    this.observer?.disconnect();

    // DomPlaneを削除
    if (this.domPlane) {
      this.domPlane.destroy();
      this.domPlane = null;
    }

    // モデルを削除
    if (this.model) {
      // シーンから削除
      if (this.hasElement()) {
        this.offscreenScene.remove(this.model);
      } else {
        this.mainScene.remove(this.model);
      }

      // リソース解放
      this.model.traverse((child: THREE.Object3D) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      });
      this.model = null;
    }

    // レンダーターゲットを削除
    if (this.hasElement() && this.renderTarget) {
      this.renderTarget.dispose();
    }
  }
}
