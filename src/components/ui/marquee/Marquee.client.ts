import { Component, type ComponentOptions } from "@/scripts/base/Component";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { canAnimate, getMotionQuery } from "@/scripts/utils/motion";

gsap.registerPlugin(ScrollTrigger);

export interface MarqueeOptions extends ComponentOptions {
  /** 流れる速度 (px/sec) */
  speed?: number;
  /** 1 = 左流れ / -1 = 右流れ */
  direction?: 1 | -1;
  /** hover で減速停止 */
  pauseOnHover?: boolean;
  /** スクロール速度に応じて timeScale をブースト */
  scrollBoost?: boolean;
  /** ブーストの上限倍率 */
  maxBoost?: number;
}

const SPEED = 30;
const MAX_BOOST = 4;
const BOOST_REF = 800;
const BOOST_DECAY = 260;

const readFlag = (value: string | undefined, fallback: boolean) =>
  value === undefined ? fallback : value !== "false";

const readDirection = (value: string | undefined): 1 | -1 | undefined => {
  if (value === undefined) return undefined;
  return Number(value) === -1 ? -1 : 1;
};

export class Marquee extends Component {
  private _root: HTMLElement;
  private _speed: number;
  private _dir: 1 | -1;
  private _pauseOnHover: boolean;
  private _scrollBoost: boolean;
  private _maxBoost: number;

  private _elTrack: HTMLElement | null = null;
  private _elSet: HTMLElement | null = null;
  private _elToggle: HTMLButtonElement | null = null;
  private _clones: HTMLElement[] = [];

  private _tween: gsap.core.Tween | null = null;
  private _st: ScrollTrigger | null = null;
  private _ro: ResizeObserver | null = null;
  private _io: IntersectionObserver | null = null;

  private _setWidth = 0;
  private _repeat = 2;
  private _raf = 0;
  private _boostTimer = 0;
  /** 動きを許可されて動作中（または開始処理中）か */
  private _active = false;
  private _observed = false;
  /** 待機中に停止→再開された場合、古い開始処理を捨てるための番号 */
  private _startId = 0;
  private _inView = true;
  /** 停止ボタンで利用者が止めたか */
  private _userPaused = false;
  private _destroyed = false;
  private _hovering = false;

  private _onEnter = () => {
    this._hovering = true;
    this._setTimeScale(0);
  };

  private _onLeave = () => {
    this._hovering = false;
    this._setTimeScale(1);
  };

  private _onToggle = () => {
    this._userPaused = !this._userPaused;
    this._applyPlayState();
  };

  // 動きの抑制設定は実行中にも変わるため追従する
  private _onMotionChange = () => {
    if (canAnimate()) {
      void this._start();
    } else {
      this._stop();
    }
  };

  constructor(elTarget: Element, options: MarqueeOptions) {
    super(elTarget, options);

    this._root = elTarget as HTMLElement;

    const data = this._root.dataset;

    this._speed = Number(data.speed) || options.speed || SPEED;
    this._dir = readDirection(data.direction) ?? options.direction ?? 1;
    this._pauseOnHover = readFlag(
      data.pauseOnHover,
      options.pauseOnHover ?? false
    );
    this._scrollBoost = readFlag(
      data.scrollBoost,
      options.scrollBoost ?? false
    );
    this._maxBoost = Number(data.maxBoost) || options.maxBoost || MAX_BOOST;

    this.init();
  }

  private async init() {
    this._buildDom();

    this._elToggle = this._root.querySelector<HTMLButtonElement>(
      "[data-marquee-toggle]"
    );
    if (this._elToggle) this._addEL(this._elToggle, "click", this._onToggle);
    this._addEL(getMotionQuery(), "change", this._onMotionChange);

    if (canAnimate()) await this._start();

    this._root.classList.add("is-ready");
  }

  /** 動きを開始する */
  private async _start() {
    if (this._active) return;
    this._active = true;
    const startId = ++this._startId;

    await this._waitAssets();
    // 待機中に破棄・抑制への切り替え・再開があった場合は開始しない
    if (this._destroyed || startId !== this._startId || !this._active) return;

    this._measure();
    this._syncClones();
    this._createTween();

    if (!this._observed) {
      this._observe();
      this._observed = true;
    }

    this._root.classList.add("is-animating");
    if (this._elToggle) this._elToggle.hidden = false;
    this._applyPlayState();
  }

  /** 動きを止め、clone を外して静止状態（横スクロール）に戻す */
  private _stop() {
    this._active = false;
    this._startId++;

    cancelAnimationFrame(this._raf);
    this._tween?.kill();
    this._tween = null;
    gsap.set(this._sets, { clearProps: "transform" });

    this._clones.forEach((clone) => clone.remove());
    this._clones = [];

    this._root.classList.remove("is-animating");
    if (this._elToggle) this._elToggle.hidden = true;
  }

  /** 画面内にあり、利用者が止めていないときだけ再生する */
  private _applyPlayState() {
    if (this._elToggle) {
      this._elToggle.textContent = this._userPaused ? "再生" : "一時停止";
    }

    if (!this._tween) return;
    if (this._inView && !this._userPaused) {
      this._tween.play();
    } else {
      this._tween.pause();
    }
  }

  /* ---------------- DOM ---------------- */

  /** 渡された親の子要素を 1セットとして track にまとめ直す */
  private _buildDom() {
    this._root.classList.add("c-marquee");

    // Preact が出した構造があればそれを使う（DOM を移動しない）
    const set = this._root.querySelector<HTMLElement>("[data-marquee-set]");
    if (set?.parentElement) {
      this._elSet = set;
      this._elTrack = set.parentElement;
      return;
    }

    // --- 以下はバニラ運用時のフォールバック ---
    const track = document.createElement("div");
    track.className = "c-marquee__track";
    const newSet = document.createElement("div");
    newSet.className = "c-marquee__set";
    newSet.dataset.marqueeSet = "";

    while (this._root.firstChild) newSet.appendChild(this._root.firstChild);
    track.appendChild(newSet);
    this._root.appendChild(track);

    this._elTrack = track;
    this._elSet = newSet;
  }

  /** 幅が確定してから測るための待機（画像未ロード時の setWidth = 0 対策） */
  private async _waitAssets() {
    if (!this._elSet) return;

    const imgs = Array.from(this._elSet.querySelectorAll("img"));
    await Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      ...imgs.map((img) =>
        img.complete ? Promise.resolve() : img.decode().catch(() => undefined)
      ),
    ]);
  }

  private _measure() {
    if (!this._elSet) return;

    this._setWidth = this._elSet.getBoundingClientRect().width;
    this._repeat =
      this._setWidth > 0
        ? Math.max(2, Math.ceil(this._root.offsetWidth / this._setWidth) + 1)
        : 2;
  }

  /** clone を過不足なく増減させる */
  private _syncClones() {
    if (!this._elSet || !this._elTrack) return;

    const current = this._clones.length + 1;

    if (current < this._repeat) {
      const frag = document.createDocumentFragment();

      for (let i = current; i < this._repeat; i++) {
        const clone = this._elSet.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        clone
          .querySelectorAll("a, button, input, select, textarea")
          .forEach((n) => n.setAttribute("tabindex", "-1"));

        this._clones.push(clone);
        frag.appendChild(clone);
      }

      this._elTrack.appendChild(frag);
    } else if (current > this._repeat) {
      while (this._clones.length + 1 > this._repeat)
        this._clones.pop()?.remove();
    }
  }

  /* ---------------- Tween ---------------- */

  private get _sets(): HTMLElement[] {
    return this._elSet ? [this._elSet, ...this._clones] : [];
  }

  private _createTween(progress = 0) {
    if (this._setWidth <= 0) return;

    const sets = this._sets;

    // 右流れは1セット分左へ寄せて開始する（左端に隙間を作らない）
    const from = this._dir === 1 ? 0 : -100;

    gsap.set(sets, { xPercent: from });

    this._tween = gsap.to(sets, {
      xPercent: from - 100 * this._dir,
      ease: "none",
      duration: this._setWidth / this._speed, // 幅が変わっても体感速度を一定に保つ
      repeat: -1,
      modifiers: {
        xPercent: gsap.utils.wrap(-100, 0),
      },
    });

    this._tween.progress(progress);
  }

  /** リサイズ時：進行度を保ったまま組み直す */
  private _refresh() {
    if (this._destroyed || !this._active || !this._elSet) return;

    const progress = this._tween?.progress() ?? 0;

    this._tween?.kill();
    this._tween = null;
    gsap.set(this._sets, { clearProps: "transform" }); // clone 元に inline transform を残さない

    this._measure();
    this._syncClones();
    this._createTween(progress);
    this._applyPlayState();
  }

  private _setTimeScale(value: number, duration = 0.4) {
    if (!this._tween) return;
    gsap.to(this._tween, { timeScale: value, duration, overwrite: true });
  }

  /* ---------------- Observers ---------------- */

  private _observe() {
    this._ro = new ResizeObserver(() => {
      cancelAnimationFrame(this._raf);
      this._raf = requestAnimationFrame(() => this._refresh());
    });
    this._ro.observe(this._root);

    this._io = new IntersectionObserver(([entry]) => {
      this._inView = entry.isIntersecting;
      this._applyPlayState();
    });
    this._io.observe(this._root);

    if (this._pauseOnHover) {
      this._addEL(this._root, "mouseenter", this._onEnter);
      this._addEL(this._root, "mouseleave", this._onLeave);
    }

    if (this._scrollBoost) this._initScrollBoost();
  }

  private _initScrollBoost() {
    this._st = ScrollTrigger.create({
      trigger: this._root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        if (!this._tween || this._hovering) return;

        const velocity = self.getVelocity();
        const boost =
          1 + Math.min(Math.abs(velocity) / BOOST_REF, this._maxBoost);

        this._setTimeScale(boost, 0.2);

        window.clearTimeout(this._boostTimer);
        this._boostTimer = window.setTimeout(() => {
          if (this._hovering) return;
          this._setTimeScale(1, 0.6);
        }, BOOST_DECAY);
      },
    });
  }

  /* ---------------- Lifecycle ---------------- */

  protected override _onDestroy() {
    this._destroyed = true;

    cancelAnimationFrame(this._raf);
    window.clearTimeout(this._boostTimer);

    this._tween?.kill();
    this._st?.kill();
    this._ro?.disconnect();
    this._io?.disconnect();

    this._tween = null;
    this._st = null;
    this._ro = null;
    this._io = null;
  }
}
