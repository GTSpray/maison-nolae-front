import bannersTxt from "./banners.txt";
import bannersSvg from "./banners.svg";

import RessourcesLoader, { HttpMethod } from "../RessourcesLoader";

function htmlToElement(html: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html.trim(), "text/html");
  return doc.body.firstChild as HTMLElement;
}

function randomInt(min: number, max: number): number {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
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

  constructor(banners: HTMLElement) {
    const svg = banners.cloneNode(true) as HTMLElement;
    const b = svg.querySelectorAll(".banner");
    const m = randomInt(0, b.length);
    b.forEach((e, i) => {
      if (i !== m) {
        const parent = e.parentNode as HTMLElement;
        parent.removeChild(e);
      }
    });
    this._textContainer = svg.querySelector("text > textPath") as HTMLElement;
    this._svg = svg;
  }

  set label(value: string) {
    const name = value.trim();
    this._textContainer.textContent = `${name}`;
  }

  static async load(): Promise<HTMLElement> {
    try {
      const img = await RessourcesLoader.httpRequest({
        method: HttpMethod.GET,
        url: `./${bannersSvg}`,
      });
      const banners = htmlToElement(img);
      applyStyle(banners, bannersTxt);
      return banners;
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
    return img;
  }
}
