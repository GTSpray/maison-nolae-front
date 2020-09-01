import Banner from "./banner/Banner";

export default class Pin {
  private _banner: Banner;
  private _sprite: HTMLImageElement;
  private _width: number;
  private _height: number;
  private _x: number;
  private _y: number;
  private _text: string;

  constructor(banners: HTMLElement, text: string, w?: number, h?: number) {
    this._banner = new Banner(banners);

    const { width, height } = banners.getBoundingClientRect();

    this._width = w ? w : width;
    this._height = h ? h : height;
    this._sprite = new Image();

    this._x = 0;
    this._y = 0;
    this._text = '';

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
    this._x = Math.round(x - this._width / 2);
  }

  set y(y: number) {
    this._y = Math.round(y - this._height / 2);
  }

  get x(): number {
    return this._x;
  }

  get y() {
    return this._y;
  }
}
