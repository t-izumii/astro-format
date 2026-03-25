import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Camera } from './Camera';
import { Light } from './Light';
import { DomPlane } from './DomPlane';
import { Dom3DObject } from './Dom3DObject';
import type { CreatePlaneOptions, Create3DObjectOptions } from './types';

export class WebGLApp {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: Camera;
  light: Light;
  controls: OrbitControls | null;
  updateCallbacks: (() => void)[];
  resizeCallbacks: (() => void)[];
  rect: DOMRect;
  domPlanes: DomPlane[];
  dom3DObjects: Dom3DObject[];
  startTime: number;
  clock: THREE.Clock;
  private rafId: number = 0;
  private resizeHandler: () => void = () => {};

  constructor(selector: string | HTMLElement) {
    // コンテナを取得
    const element =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
    if (!element) {
      throw new Error(`Container not found: ${selector}`);
    }
    this.container = element as HTMLElement;

    // canvasを生成してコンテナに追加
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);

    this.rect = this.container.getBoundingClientRect();
    console.log(this.rect);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.camera = new Camera(this.rect);
    this.light = new Light(this.scene);
    this.controls = null;
    this.updateCallbacks = [];
    this.resizeCallbacks = [];
    this.domPlanes = [];
    this.dom3DObjects = [];
    this.startTime = Date.now();
    this.clock = new THREE.Clock();

    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    // シーンの背景を透明に
    this.scene.background = null;

    // レンダラーの設定
    this.renderer.setSize(this.rect.width, this.rect.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // sceneのgetterを追加
  getScene() {
    return this.scene;
  }

  // カメラのgetterを追加
  getCamera() {
    return this.camera;
  }

  // rendererのgetterを追加
  getRenderer() {
    return this.renderer;
  }

  // lightのgetterを追加
  getLight() {
    return this.light;
  }

  // canvasサイズを追加
  getViewPort() {
    return this.rect;
  }

  // オブジェクトを追加するメソッド
  addObject(object: THREE.Object3D) {
    this.scene.add(object);
  }

  // オブジェクトを削除するメソッド
  removeObject(object: THREE.Object3D) {
    this.scene.remove(object);
  }

  // DomPlaneを作成するメソッド
  createPlane(
    selector: string | HTMLElement | null,
    options?: CreatePlaneOptions
  ) {
    let element: HTMLElement | null = null;

    if (selector !== null && selector !== undefined) {
      element =
        typeof selector === 'string'
          ? (document.querySelector(selector) as HTMLElement)
          : selector;

      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
    }

    const domPlane = new DomPlane(
      element,
      this.scene,
      this.rect,
      (callback) => this.addUpdateCallback(callback),
      options
    );
    this.domPlanes.push(domPlane);

    return domPlane;
  }

  // DomPlaneを削除するメソッド
  removePlane(domPlane: DomPlane) {
    const index = this.domPlanes.indexOf(domPlane);
    if (index > -1) {
      this.domPlanes.splice(index, 1);
      domPlane.destroy();
    }
  }

  // Dom3DObjectを作成するメソッド
  create3DObject(
    selector: string | HTMLElement | null,
    options: Create3DObjectOptions
  ) {
    let element: HTMLElement | null = null;

    if (selector) {
      element =
        typeof selector === 'string'
          ? (document.querySelector(selector) as HTMLElement)
          : selector;

      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
    }

    const dom3DObject = new Dom3DObject(
      element,
      this.scene,
      this.renderer,
      this.rect,
      (callback) => this.addUpdateCallback(callback),
      options
    );
    this.dom3DObjects.push(dom3DObject);

    return dom3DObject;
  }

  // Dom3DObjectを削除するメソッド
  remove3DObject(dom3DObject: Dom3DObject) {
    const index = this.dom3DObjects.indexOf(dom3DObject);
    if (index > -1) {
      this.dom3DObjects.splice(index, 1);
      dom3DObject.destroy();
    }
  }

  // アニメーションループに更新処理を追加するメソッド（戻り値で削除可能）
  addUpdateCallback(callback: () => void): () => void {
    this.updateCallbacks.push(callback);
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) this.updateCallbacks.splice(index, 1);
    };
  }

  // リサイズ時の処理を追加するメソッド（戻り値で削除可能）
  addResizeCallback(callback: () => void): () => void {
    this.resizeCallbacks.push(callback);
    return () => {
      const index = this.resizeCallbacks.indexOf(callback);
      if (index > -1) this.resizeCallbacks.splice(index, 1);
    };
  }

  // OrbitControlsを有効化するメソッド
  enableOrbitControls() {
    if (!this.controls) {
      this.controls = new OrbitControls(this.camera.instance!, this.canvas);
    }
    return this.controls;
  }

  // OrbitControlsを取得するメソッド
  getControls() {
    return this.controls;
  }

  setupEventListeners() {
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    this.resizeHandler = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.onResize(), 100);
    };
    window.addEventListener('resize', this.resizeHandler);

    // lenis
    // window.addEventListener("scroll", () => this.onScroll());
  }

  onScroll() {
    this.domPlanes.forEach((plane) => plane.updateScroll());
    this.dom3DObjects.forEach((obj) => obj.updateScroll());
  }

  onResize() {
    this.rect = this.container.getBoundingClientRect();

    // カメラのアスペクト比を更新
    this.camera.resize(this.rect);

    // レンダラーのサイズを更新
    this.renderer.setSize(this.rect.width, this.rect.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // すべてのDomPlaneのcanvasRectとサイズと位置を更新
    this.domPlanes.forEach((plane) => {
      plane.setCanvasRect(this.rect);
      plane.resize();
    });

    // すべてのDom3DObjectのcanvasRectとサイズと位置を更新
    this.dom3DObjects.forEach((obj) => {
      obj.setCanvasRect(this.rect);
      obj.resize();
    });

    // 登録された更新処理を実行
    this.resizeCallbacks.forEach((callback) => callback());
  }

  destroy() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.resizeHandler);

    this.domPlanes.forEach((plane) => plane.destroy());
    this.dom3DObjects.forEach((obj) => obj.destroy());
    this.domPlanes = [];
    this.dom3DObjects = [];
    this.updateCallbacks = [];
    this.resizeCallbacks = [];

    this.controls?.dispose();
    this.renderer.dispose();
    this.canvas.remove();
  }

  animate = () => {
    this.rafId = requestAnimationFrame(this.animate);

    // OrbitControlsの更新（ダンピングが有効な場合に必要）
    if (this.controls) {
      this.controls.update();
    }

    // 登録された更新処理を実行
    this.updateCallbacks.forEach((callback) => callback());

    // レンダリング
    this.renderer.render(this.scene, this.camera.instance!);
  };
}
