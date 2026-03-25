import { Component, type ComponentOptions } from '../../base/Component';
import { WebGLApp } from '@/scripts/webgl';

export class WebGl extends Component {
  private webGLApp: WebGLApp | null = null;

  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options);

    this._init();
  }

  _init() {
    if (!this._elTarget) {
      throw new Error('Target element is not available');
    }
    this.webGLApp = new WebGLApp(this._elTarget);

    this._createKv();
    this._createThumb();
  }

  _createKv() {
    this.webGLApp?.createPlane('.js-webglKv', {
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(0.0,1.0,1.0,1.0);
        }
      `,
    });
  }

  _createThumb() {
    const thumbs = document.querySelectorAll('.js-webglThumb');

    thumbs.forEach((thumb) => {
      this.webGLApp?.createPlane(thumb as HTMLElement, {});
    });
  }

  public override destroy() {
    this.webGLApp?.destroy();
    this.webGLApp = null;
    super.destroy();
  }
}
