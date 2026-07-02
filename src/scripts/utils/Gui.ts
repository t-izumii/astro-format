import GUI from "lil-gui";

/**
 * lil-guiの一元管理クラス
 */
export class Gui {
  private static _gui: GUI | null = null;

  static get instance(): GUI | null {
    if (!import.meta.env.DEV) return null;

    if (Gui._gui === null) {
      Gui._gui = new GUI();
    }

    return Gui._gui;
  }
}
