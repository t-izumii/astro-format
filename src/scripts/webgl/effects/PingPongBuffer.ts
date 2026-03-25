import * as THREE from "three";

export interface PingPongBufferOptions {
  width?: number;
  height?: number;
  minFilter?: number;
  magFilter?: number;
  format?: number;
  type?: number;
  samples?: number;
}

/**
 * ピンポンレンダリング用のバッファ管理クラス
 * 2つのレンダーターゲットを交互に使用してフィードバック効果を実現
 */
export class PingPongBuffer {
  private renderer: THREE.WebGLRenderer;
  private readTarget: THREE.WebGLRenderTarget;
  private writeTarget: THREE.WebGLRenderTarget;
  private width: number;
  private height: number;
  private options: PingPongBufferOptions;

  constructor(
    renderer: THREE.WebGLRenderer,
    width: number,
    height: number,
    options: PingPongBufferOptions = {},
  ) {
    this.renderer = renderer;
    this.width = width;
    this.height = height;
    this.options = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      samples: 0,
      ...options,
    };

    // 2つのレンダーターゲットを作成
    this.readTarget = this.createRenderTarget();
    this.writeTarget = this.createRenderTarget();
  }

  /**
   * レンダーターゲットを作成
   */
  private createRenderTarget(): THREE.WebGLRenderTarget {
    const target = new THREE.WebGLRenderTarget(this.width, this.height, {
      minFilter: this.options.minFilter,
      magFilter: this.options.magFilter,
      format: this.options.format,
      type: this.options.type,
      stencilBuffer: false,
      depthBuffer: false,
    });

    // マルチサンプリング設定
    if (this.options.samples && this.options.samples > 0) {
      target.samples = this.options.samples;
    }

    return target;
  }

  /**
   * readとwriteのターゲットを入れ替え
   */
  swap(): void {
    const temp = this.readTarget;
    this.readTarget = this.writeTarget;
    this.writeTarget = temp;
  }

  /**
   * シーンをwriteターゲットにレンダリング
   */
  render(scene: THREE.Scene, camera: THREE.Camera): void {
    const currentRenderTarget = this.renderer.getRenderTarget();

    this.renderer.setRenderTarget(this.writeTarget);
    this.renderer.render(scene, camera);
    this.renderer.setRenderTarget(currentRenderTarget);
  }

  /**
   * メッシュをwriteターゲットにレンダリング（シンプル版）
   */
  renderMesh(mesh: THREE.Mesh, camera: THREE.Camera): void {
    const currentRenderTarget = this.renderer.getRenderTarget();

    this.renderer.setRenderTarget(this.writeTarget);
    this.renderer.clear();
    this.renderer.render(mesh, camera);
    this.renderer.setRenderTarget(currentRenderTarget);
  }

  /**
   * 現在のreadターゲットのテクスチャを取得
   */
  getReadTexture(): THREE.Texture {
    return this.readTarget.texture;
  }

  /**
   * 現在のwriteターゲットのテクスチャを取得
   */
  getWriteTexture(): THREE.Texture {
    return this.writeTarget.texture;
  }

  /**
   * readターゲットを取得
   */
  getReadTarget(): THREE.WebGLRenderTarget {
    return this.readTarget;
  }

  /**
   * writeターゲットを取得
   */
  getWriteTarget(): THREE.WebGLRenderTarget {
    return this.writeTarget;
  }

  /**
   * リサイズ処理
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.readTarget.setSize(width, height);
    this.writeTarget.setSize(width, height);
  }

  /**
   * バッファをクリア
   */
  clear(color?: THREE.Color): void {
    const currentRenderTarget = this.renderer.getRenderTarget();

    if (color) {
      const oldClearColor = this.renderer.getClearColor(new THREE.Color());
      const oldClearAlpha = this.renderer.getClearAlpha();

      this.renderer.setClearColor(color, 1.0);
      this.renderer.setRenderTarget(this.readTarget);
      this.renderer.clear();
      this.renderer.setRenderTarget(this.writeTarget);
      this.renderer.clear();

      this.renderer.setClearColor(oldClearColor, oldClearAlpha);
    } else {
      this.renderer.setRenderTarget(this.readTarget);
      this.renderer.clear();
      this.renderer.setRenderTarget(this.writeTarget);
      this.renderer.clear();
    }

    this.renderer.setRenderTarget(currentRenderTarget);
  }

  /**
   * リソースを破棄
   */
  dispose(): void {
    this.readTarget.dispose();
    this.writeTarget.dispose();
  }
}
