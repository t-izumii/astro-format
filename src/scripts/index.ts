import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Component, type ComponentOptions } from "./base/Component";
import { SizeObserver } from "./components/common/SizeObserver";
import { WindowSize } from "./components/layout/WindowSize";
import { AssetLoader } from "./components/layout/AssetLoader";
import { MediaChange } from "./components/common/mediaChange";
import { MEDIA_PC, MEDIA_SP, MIN_PC_WIDTH } from "./constants/window-size";
import { LoadScrollTo } from "./components/common/LoadScrollTo";
import { ScrollToHandler } from "./components/common/ScrollToHandler";
import { ScrollTo } from "./components/common/ScrollTo";
import { InView } from "./components/common/InView";
import { Scroll } from "./components/layout/Scroll";
import { Modal } from "./components/ui/modal";
import { ModalOpen } from "./components/ui/modalOpen";
import { Carousel } from "./components/ui/carousel";
// import { Events } from "./constants/events";
// import { EventEmitter } from "./utils/EventEmitter";

type ComponentList = { selector: string; component: typeof Component }[];

const LAYOUT_COMPONENTS: ComponentList = [
  // body
  // Layout
  // Header
];

const PAGE_COMPONENTS: ComponentList = [
  // Layout
  { selector: "body", component: AssetLoader },
  { selector: "body", component: WindowSize },
  { selector: "body", component: MediaChange },
  { selector: "body", component: Scroll },
  { selector: "body", component: LoadScrollTo },
  { selector: "body", component: ScrollToHandler },

  // Common
  { selector: ".js-sizeObserver", component: SizeObserver },
  { selector: ".js-scrollTo", component: ScrollTo },
  { selector: ".js-inView", component: InView },

  // UI
  { selector: ".js-modal", component: Modal },
  { selector: ".js-modalOpen", component: ModalOpen },
  { selector: ".js-carousel", component: Carousel },
];

// setup gsap
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const windowWidth = window.innerWidth;
const options: ComponentOptions = {
  windowWidth,
  windowHeight: window.innerHeight,
  media: windowWidth >= MIN_PC_WIDTH ? MEDIA_PC : MEDIA_SP,
};

let pageComponents: Component[] | null = null;

/**
 * Componentをセットアップする
 */
const setupComponents = (componentInfos: ComponentList): Component[] => {
  const components: Component[] = [];
  componentInfos.forEach((c) => {
    try {
      const targets = document.querySelectorAll(c.selector);

      if (targets.length > 0) {
        targets.forEach((t) => {
          const component = new c.component(t, options);
          components.push(component);
        });
      }
    } catch (e) {
      console.error(e);
    }
  });

  return components;
};

const onDOMContentLoaded = () => {
  // init
  setupComponents(LAYOUT_COMPONENTS);
  pageComponents = setupComponents(PAGE_COMPONENTS);

  // // after page transition
  // EventEmitter.on(Events.WILL_REPLACE_CONTENT, () => {
  //   pageComponents?.forEach((component) => component.destroy());
  // });
  // EventEmitter.on(Events.CONTENT_REPLACED, () => {
  //   pageComponents = setupComponents(PAGE_COMPONENTS);
  // });
};

// deferで読み込んでいるため、DOMContentLoaded時に実行される
onDOMContentLoaded();
