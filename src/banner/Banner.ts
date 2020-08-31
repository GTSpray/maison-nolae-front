import style from "./banners.txt";
import banner1 from "./banner1.svg";

import RessourcesLoader, { HttpMethod } from "../RessourcesLoader";

function htmlToElement(html: string): HTMLElement {
  const template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild as HTMLElement;
}

export default class Banner {
  private svg: HTMLElement;

  constructor(svg: HTMLElement) {
    this.svg = svg;
    this.applyStyle(style);
  }

  set label(value: string) {
    const name = value.trim();
    const max = parseInt(`${this.svg.getAttribute("data-max")}`, 10);
    this.svg.textContent = `${name.substring(0, max)}`;
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

  applyStyle(styles: string) {
    let defs: SVGDefsElement | HTMLElement = this.svg.querySelector(
      "defs"
    ) as SVGDefsElement;
    if (!defs) {
      defs = document.createElement("defs");
      this.svg.appendChild(defs);
    }
    const css: HTMLStyleElement = document.createElement("style");
    css.type = "text/css";
    css.appendChild(document.createTextNode(styles));
    defs.appendChild(css);
  }

  async compile(): Promise<SVGImageElement> {
    const data = new XMLSerializer().serializeToString(this.svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);
    const img = await RessourcesLoader.loadImage(url);
    window.URL.revokeObjectURL(url);
    return img;
  }
}
