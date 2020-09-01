import Banner from "./banner/Banner";

export default class Pin {
  private _banner: Banner;
  private _sprite: HTMLImageElement;
  private _width: number;
  private _height: number;
  private _x: number;
  private _y: number;
  private _text: string;

  constructor(banners: HTMLElement, text: string, w: number, h: number) {
    this._banner = new Banner(banners);
    this._width = w;
    this._height = h;
    this._sprite = new Image();

    this.x = 0;
    this.y = 0;
    this.text = text;
  }

  get sprite() {
    return this._sprite;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  set text(text: string) {
    if (this._text !== text) {
      this._text = text;
      this._banner.label = text;
      this._banner.compile().then((img) => {
        this._sprite = img;
      });
    }
  }

  get text() {
    return this._text;
  }

  set x(x: number) {
    this._x = x - this._width / 2;
  }

  set y(y: number) {
    this._y = y;
  }

  get x(): number {
    return this._x + this._width / 2;
  }

  get y() {
    return this._y;
  }
}
