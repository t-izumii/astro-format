import { Component, type ComponentOptions } from "../../base/Component"
import { EventEmitter } from "../../utils/EventEmitter"
import { Events } from "../../constants/events"

export class ZoomScale extends Component {
  private readonly _isFirefox: boolean
  private readonly _BASE_DPR_STORAGE_KEY = "browser-base-dpr" as const

  constructor(elTarget: Element, options: ComponentOptions) {
    super(elTarget, options)

    const ua = navigator.userAgent
    this._isFirefox = /Firefox/i.test(ua)

    this._setEventListeners()
    this._updateBrowserZoomScale()
  }

  private _setEventListeners() {
    EventEmitter.on(Events.WINDOW_RESIZED, this._onResize.bind(this))
  }

  private _onResize() {
    this._updateBrowserZoomScale()
  }

  private _updateBrowserZoomScale(): void {
    const browserZoom = this._isFirefox
      ? this._calculateZoomByDevicePixelRatio()
      : this._calculateZoomByViewport()
    this._elTarget.style.setProperty("--window-zoom", String(browserZoom))
  }

  private _calculateZoomByViewport(): number {
    return window.outerWidth / window.innerWidth
  }

  private _calculateZoomByDevicePixelRatio(): number {
    const currentDPR = window.devicePixelRatio
    let baseDPR = parseFloat(localStorage.getItem(this._BASE_DPR_STORAGE_KEY))

    if (!baseDPR) {
      baseDPR = currentDPR
      localStorage.setItem(this._BASE_DPR_STORAGE_KEY, String(baseDPR))
    }

    return currentDPR / baseDPR
  }

  public override destroy() {
    super.destroy()
  }
}
