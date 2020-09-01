import style from "./banners.txt";
import banner1 from "./banner1.svg";

import RessourcesLoader, { HttpMethod } from "../RessourcesLoader";

function htmlToElement(html: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html.trim(), "text/html");
  return doc.body.firstChild as HTMLElement;
}

function applyStyle(element: HTMLElement, styles: string) {
  let defs: SVGDefsElement | HTMLElement = element.querySelector(
    "defs"
  ) as SVGDefsElement;
  if (!defs) {
    defs = document.createElement("defs");
    element.appendChild(defs);
  }
  const css: HTMLStyleElement = document.createElement("style");
  css.type = "text/css";
  css.appendChild(document.createTextNode(styles));
  defs.appendChild(css);
}

export default class Banner {
  private _svg: HTMLElement;
  private _textContainer: HTMLElement;

  constructor(svg: HTMLElement) {
    this._textContainer = svg.querySelector(".name") as HTMLElement;
    this._svg = svg;
    applyStyle(svg, style);
  }

  set label(value: string) {
    const name = value.trim();
    const max = parseInt(`${this._textContainer.getAttribute("data-max")}`, 10);
    this._textContainer.textContent = `${name.substring(0, max)}`;
  }

  static async load(): Promise<Banner> {
    try {
      const img = await RessourcesLoader.httpRequest({
        method: HttpMethod.GET,
        url: `./${banner1}`
      });
      return new Banner(htmlToElement(img));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async compile(): Promise<HTMLImageElement> {
    const data = new XMLSerializer().serializeToString(this._svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);
    const img = await RessourcesLoader.loadImage(url);
    window.URL.revokeObjectURL(url);
    img.width *= 0.5;
    img.height *= 0.5;
    return img;
  }
}
